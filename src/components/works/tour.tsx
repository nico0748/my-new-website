/** Works 記事の「画面ツアー」。アプリのスクリーンショットを上に固定し、下の手順をスクロールで読み進めると、
 *  手順ごとに画面の該当箇所へ寄って印（囲み・点・下線）を付ける。
 *
 *  サイトの動きの決まりに合わせる:
 *  - 進めるのは利用者のスクロールだけ。自動再生・ループ・点滅・波紋はしない
 *  - 動かすのは transform（寄る・引く）と opacity（画像の切り替え・印）だけ。イージングは --motion-ease
 *  - 進み具合は 1px の線が左から伸びる形（構造の線）。印に光沢や影は足さない
 *  - 開いたとき・戻る / 進むでスクロール位置が戻ったとき・View Transition の最中は、動かさずにその手順の画面を出す
 *  - prefers-reduced-motion: reduce では寄る・切り替えをその場で行う（時間をかけない）
 *  - 高さの足りない画面（横向きのスマホなど）と印刷では固定をやめ、手順ごとに静止画を添える
 *  画面の内容は手順の本文に文章で書くこと（印は aria-hidden）。 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { createPortal } from "react-dom";
import { useLocation, useViewTransitionState } from "react-router-dom";

/** 画像に対する範囲（0〜100 の割合） */
export type TourRect = { x: number; y: number; w: number; h: number };

export type TourImage = { src: string; width: number; height: number; alt: string };

/**
 * 印。位置は画像に対する 0〜100 の割合。
 * - box: 囲み（x, y, w, h）
 * - dot: 輪（x, y が中心）
 * - underline: 下線（x, y, w, h の下辺に、左から伸びる線）
 */
export type TourMark = { kind?: "box" | "dot" | "underline"; x: number; y: number; w?: number; h?: number };

export type TourStep<K extends string = string> = {
  title: string;
  body: ReactNode;
  /** 画面のボタン名・キー（札で出す） */
  keys?: string[];
  /** images のどれを見せるか */
  image: K;
  /** 寄る範囲。枠の縦横比に合わせて広げる。省略時は画像の全体 */
  rect?: TourRect;
  /** スマホ（640px 未満）で寄る範囲。全体を見せる手順で、印のまわりに寄せたいときに渡す */
  rectSm?: TourRect;
  marks?: TourMark[];
};

const FULL: TourRect = { x: 0, y: 0, w: 100, h: 100 };
/** 手順が替わったとみなす線: 固定した画面の下端から、残りの高さの 30% の位置 */
const LINE_RATIO = 0.3;
/** 開いてからこの時間は、スクロール位置の復元とみなして動かさずに切り替える */
const SETTLE_MS = 600;

/* ─── 位置の計算 ─────────────────────────────── */

type ViewRect = { x: number; y: number; w: number; h: number };

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const round = (v: number) => Math.round(v * 1000) / 1000;

/** rect（割合）を、枠の縦横比 frame に合う範囲（元画像の px）にする。中心を保って短い辺を伸ばし、画像の外に出ないよう寄せる。 */
function fitRect(img: TourImage, rect: TourRect, frame: number): ViewRect {
  const W = img.width;
  const H = img.height;
  const cx = ((rect.x + rect.w / 2) / 100) * W;
  const cy = ((rect.y + rect.h / 2) / 100) * H;
  let w = Math.max(1, (rect.w / 100) * W);
  let h = Math.max(1, (rect.h / 100) * H);
  if (w / h < frame) w = h * frame;
  else h = w / frame;
  if (w > W) {
    w = W;
    h = W / frame;
  }
  if (h > H) {
    h = H;
    w = H * frame;
  }
  return { x: clamp(cx - w / 2, 0, W - w), y: clamp(cy - h / 2, 0, H - h), w, h };
}

/**
 * 画像の層の transform（transform-origin は左上）。層は枠と同じ幅で画像と同じ縦横比なので、
 * translate の % は層自身に対する割合になり、枠の大きさを測らなくても範囲 r がちょうど枠に収まる。
 */
function layerTransform(img: TourImage, r: ViewRect) {
  const k = img.width / r.w;
  return `scale(${round(k)}) translate(${round((-r.x / img.width) * 100)}%, ${round((-r.y / img.height) * 100)}%)`;
}

/** 印の位置を、枠（見えている範囲 r）に対する % で返す */
function markBox(img: TourImage, r: ViewRect, m: TourMark) {
  const px = (m.x / 100) * img.width;
  const py = (m.y / 100) * img.height;
  return {
    left: ((px - r.x) / r.w) * 100,
    top: ((py - r.y) / r.h) * 100,
    width: ((((m.w ?? 0) / 100) * img.width) / r.w) * 100,
    height: ((((m.h ?? 0) / 100) * img.height) / r.h) * 100,
  };
}

/** 同じ画像の中で a から b へ寄る時間（ms）。倍率の差と、中心の移動距離（画像の幅に対する割合）で伸ばす */
function panDuration(img: TourImage, a: ViewRect, b: ViewRect) {
  const d = Math.hypot(a.x + a.w / 2 - (b.x + b.w / 2), a.y + a.h / 2 - (b.y + b.h / 2)) / img.width;
  return Math.round(clamp(650 + 300 * Math.abs(Math.log2(a.w / b.w)) + 400 * d, 650, 1150));
}

const pct = (v: number) => `${round(v)}%`;

/* ─── 画面（枠の中身） ───────────────────────── */

const Mark: React.FC<{ m: TourMark; box: ReturnType<typeof markBox>; i: number }> = ({ m, box, i }) => {
  const kind = m.kind ?? "box";
  if (kind === "dot") {
    return <span className="wtour-mark wtour-mark-dot" style={{ left: pct(box.left), top: pct(box.top), "--i": i } as CSSProperties} />;
  }
  if (kind === "underline") {
    return (
      <span
        className="wtour-mark wtour-mark-line"
        style={{ left: pct(box.left), top: pct(box.top + box.height), width: pct(box.width), "--i": i } as CSSProperties}
      />
    );
  }
  return (
    <span
      className="wtour-mark wtour-mark-box"
      style={
        {
          left: `calc(${pct(box.left)} - 4px)`,
          top: `calc(${pct(box.top)} - 4px)`,
          width: `calc(${pct(box.width)} + 8px)`,
          height: `calc(${pct(box.height)} + 8px)`,
          "--i": i,
        } as CSSProperties
      }
    />
  );
};

/** 印の面。拡大しない別の面に、見えている範囲に対する % で置く（線の太さが拡大で変わらない）。 */
const Marks: React.FC<{ img: TourImage; r: ViewRect; marks?: TourMark[]; on: boolean }> = ({ img, r, marks, on }) => (
  <div className="wtour-marks" data-on={on ? "" : undefined} aria-hidden>
    {marks?.map((m, i) => <Mark key={i} m={m} box={markBox(img, r, m)} i={i} />)}
  </div>
);

const Layer: React.FC<{ img: TourImage; r: ViewRect; on: boolean; alt: string }> = ({ img, r, on, alt }) => (
  <div className="wtour-layer" data-on={on ? "" : undefined} style={{ transform: layerTransform(img, r) }}>
    <img src={img.src} width={img.width} height={img.height} alt={alt} loading="lazy" decoding="async" draggable={false} />
  </div>
);

/** スマホの幅か（640px 未満）。rectSm を使うかどうかに使う */
const NARROW = "(max-width: 639px)";
function useNarrow() {
  const [narrow, setNarrow] = useState(() => typeof window !== "undefined" && window.matchMedia(NARROW).matches);
  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return narrow;
}

/* ─── 本体 ───────────────────────────────────── */

type Spot = { cur: number; instant: boolean };

/**
 * 画面ツアー。上に画面を固定し（sticky）、下の手順をスクロールすると、手順ごとに画面の該当箇所へ寄る。
 * - 手順の切り替えは、固定した画面の下端から残りの高さの 30% の線を、最後に越えた手順
 * - 画像は images のキーごとに 1 枚の層。替わるときは入ってくる層を上でフェードインする（出ていく層は下で不透明のまま）
 * - 下の線（手順の数だけの区切り）を押すと、その手順までスクロールする
 * - 「画面を拡大」で、いま見せている画像の全体を開く
 */
export function ScreenTour<K extends string>({
  label,
  images,
  steps,
  aspect,
}: {
  /** ツアー全体の名前（読み上げ用。「単語帳からグラフまで」など） */
  label: string;
  images: Record<K, TourImage>;
  steps: TourStep<K>[];
  /** 枠の縦横比（幅 / 高さ）。省略時は最初の手順の画像の縦横比 */
  aspect?: number;
}) {
  const n = steps.length;
  const firstImg = images[steps[0].image];
  const frame = aspect ?? firstImg.width / firstImg.height;
  const narrow = useNarrow();
  const rects = steps.map((s) => fitRect(images[s.image], (narrow && s.rectSm) || s.rect || FULL, frame));
  const keys = Array.from(new Set(steps.map((s) => s.image)));

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const enlargeRef = useRef<HTMLButtonElement>(null);
  const [spot, setSpot] = useState<Spot>({ cur: 0, instant: true });
  const [live, setLive] = useState(false);
  const [zoom, setZoom] = useState(false);
  const cur = clamp(spot.cur, 0, n - 1);

  const { pathname } = useLocation();
  const isTransitioning = useViewTransitionState(pathname);
  const transitioningRef = useRef(isTransitioning);
  useLayoutEffect(() => {
    transitioningRef.current = isTransitioning;
  });

  /** いまの手順: 線を最後に越えた手順（どれも越えていなければ最初） */
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const items = listRef.current?.children;
    if (!stage || !items) return 0;
    const sb = stage.getBoundingClientRect().bottom;
    const line = sb + Math.max(0, window.innerHeight - sb) * LINE_RATIO;
    let a = 0;
    for (let i = 0; i < items.length; i++) {
      if (items[i].getBoundingClientRect().top <= line) a = i;
      else break;
    }
    return a;
  }, []);

  // 固定した画面の高さを CSS に渡す（手順の高さを「画面の下に残る高さ」から決める）
  useLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    if (!root || !stage) return;
    const apply = () => root.style.setProperty("--wtour-stage-h", `${Math.round(stage.offsetHeight)}px`);
    apply();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(apply);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  // 開いた時点のスクロール位置に合わせ、動かさずにその手順を出す（戻る / 進むで位置が戻ったときも）
  useLayoutEffect(() => {
    setLive(true);
    setSpot({ cur: measure(), instant: true });
  }, [measure]);

  // スクロールで手順を切り替える。画面の近くにある間だけ見る
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const settleAt = performance.now() + SETTLE_MS;
    let frameId = 0;
    let attached = false;
    let jumpNext = false;
    const update = () => {
      frameId = 0;
      const a = measure();
      const instant = jumpNext || performance.now() < settleAt || transitioningRef.current;
      jumpNext = false;
      setSpot((s) => (s.cur === a ? s : { cur: a, instant }));
    };
    const onScroll = () => {
      if (!frameId) frameId = requestAnimationFrame(update);
    };
    const attach = () => {
      if (attached) return;
      attached = true;
      // 離れている間に進んだ分は、動かさずに合わせる
      jumpNext = true;
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
    };
    const detach = () => {
      if (!attached) return;
      attached = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver === "undefined") attach();
    else {
      io = new IntersectionObserver(([e]) => (e.isIntersecting ? attach() : detach()), { rootMargin: "120px 0px" });
      io.observe(root);
    }
    return () => {
      io?.disconnect();
      detach();
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [measure]);

  /** 手順 i までスクロールする（i の上端が固定した画面のすぐ下に来る位置。最初の手順は画面が固定され始める位置） */
  const goTo = (i: number) => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const li = listRef.current?.children[i];
    if (!root || !stage || !li) return;
    const top =
      i === 0
        ? root.getBoundingClientRect().top + window.scrollY
        : li.getBoundingClientRect().top + window.scrollY - stage.offsetHeight;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
  };

  // 拡大表示: Esc で閉じ、閉じたら「画面を拡大」へフォーカスを戻す
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(false);
    window.addEventListener("keydown", onKey);
    const button = enlargeRef.current;
    return () => {
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [zoom]);

  // どこから来たか（寄る時間と、印を出すまでの待ち時間を決める）
  const move = useRef({ cur, from: cur });
  if (move.current.cur !== cur) move.current = { cur, from: move.current.cur };
  const from = move.current.from;
  const sameImage = steps[from].image === steps[cur].image;
  const panMs = from === cur || spot.instant ? 0 : sameImage ? panDuration(images[steps[cur].image], rects[from], rects[cur]) : 0;
  const markDelay = spot.instant ? 0 : sameImage ? Math.round(panMs * 0.55) : 300;

  /** 層 key の置き場所: 表示中ならいまの手順、そうでなければ、その画像を使ういちばん近い手順（同じ距離なら先の手順） */
  const rectFor = (key: K): ViewRect => {
    for (let d = 0; d < n; d++) {
      if (cur + d < n && steps[cur + d].image === key) return rects[cur + d];
      if (cur - d >= 0 && steps[cur - d].image === key) return rects[cur - d];
    }
    return fitRect(images[key], FULL, frame);
  };

  const curImg = images[steps[cur].image];
  const aspectStyle = { "--wtour-aspect": round(frame) } as CSSProperties;

  return (
    <div
      ref={rootRef}
      className={["wtour", live && "is-live", spot.instant && "is-instant"].filter(Boolean).join(" ")}
      role="group"
      aria-label={label}
      style={aspectStyle}
    >
      <div ref={stageRef} className="wtour-stage">
        <div className="wtour-frame">
          <div
            className="wtour-view"
            style={{ "--wtour-pan": `${panMs}ms`, "--wtour-mark-delay": `${markDelay}ms` } as CSSProperties}
          >
            {keys.map((key) => (
              <Layer key={key} img={images[key]} r={rectFor(key)} on={key === steps[cur].image} alt={key === steps[cur].image ? images[key].alt : ""} />
            ))}
            {steps.map((s, i) => (
              <Marks key={i} img={images[s.image]} r={rects[i]} marks={s.marks} on={i === cur} />
            ))}
          </div>
          <div className="wtour-bar">
            <div className="wtour-segs">
              {steps.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  className="wtour-seg"
                  data-on={i <= cur ? "" : undefined}
                  aria-current={i === cur ? "step" : undefined}
                  aria-label={`手順 ${i + 1}「${s.title}」へ`}
                  onClick={() => goTo(i)}
                >
                  <span aria-hidden className="wtour-seg-fill" />
                </button>
              ))}
            </div>
            <span className="wtour-count" aria-hidden>
              {cur + 1} / {n}
            </span>
            <button ref={enlargeRef} type="button" className="wtour-enlarge" onClick={() => setZoom(true)}>
              画面を拡大
            </button>
          </div>
        </div>
      </div>

      <ol ref={listRef} className="wtour-steps">
        {steps.map((s, i) => {
          const img = images[s.image];
          const firstOfImage = steps.findIndex((t) => t.image === s.image) === i;
          return (
            <li key={i} className="wtour-step" data-current={i === cur ? "" : undefined} aria-current={live && i === cur ? "step" : undefined}>
              <span className="wtour-no">
                <span aria-hidden>{i + 1}</span>
                <span className="sr-only">手順 {i + 1}</span>
              </span>
              <div className="wtour-text">
                <h4 className="wtour-title">{s.title}</h4>
                <div className="wtour-body">{s.body}</div>
                {s.keys && s.keys.length > 0 && (
                  <ul className="wtour-keys">
                    {s.keys.map((k) => (
                      <li key={k}>
                        <kbd>{k}</kbd>
                      </li>
                    ))}
                  </ul>
                )}
                {/* 高さの足りない画面と印刷だけで見せる静止画（ふだんは display: none なので読み込まれない） */}
                <div className="wtour-still">
                  <div className="wtour-view">
                    <Layer img={img} r={rects[i]} on alt={firstOfImage ? img.alt : ""} />
                    <Marks img={img} r={rects[i]} marks={s.marks} on />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {zoom &&
        createPortal(
          <div className="wa-zoom" role="dialog" aria-modal="true" aria-label="画面の拡大表示" onClick={() => setZoom(false)}>
            <img src={curImg.src} alt={curImg.alt} />
            <p className="wa-zoom-hint">Esc またはクリックで閉じる</p>
          </div>,
          document.body
        )}
    </div>
  );
}
