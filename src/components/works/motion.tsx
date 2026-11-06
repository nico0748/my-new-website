/** Works 記事の「動く図」。アプリの処理の流れや構成を、見えたときに 1 回だけ描いて止める。
 *
 *  サイトの動きの決まりに合わせる:
 *  - 動きはフェード（ノード）と 1px の線が伸びる（つなぎ・境界）の 2 つだけ。イージングは --motion-ease
 *  - ループ・点滅・数字のカウントアップ・線上を走る点はしない（再生は 1 回。「もう一度再生」は利用者の操作）
 *  - 図は Reveal で包まない（再生の仕組みが二重になる）。再生の管理は図ごとに 1 つ（useFigurePlay）
 *  - ページ遷移（View Transition）の最中に見えた図は、描かずに終状態で出す（戻る / 進むでのちらつき防止）
 *  - prefers-reduced-motion: reduce・JS が無い・印刷では最初から終状態（初期状態は CSS の no-preference の中だけ）
 *  - 1 ステップ 0.45s、間隔 min(0.3s, 2.0s / (n - 1))、図全体は 2.5s 前後で止まる
 *  図の内容は、本文かキャプションでも文章で説明すること（読み上げ用）。 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useViewTransitionState } from "react-router-dom";

const STEP_SEC = 0.45;
const gapFor = (n: number) => (n <= 1 ? 0 : Math.min(0.3, 2.0 / (n - 1)));

/** 縦に長い図でも発火できるよう、見えている割合を 10% 刻みで受け取る */
const THRESHOLDS = Array.from({ length: 11 }, (_, i) => i / 10);

/**
 * 図の再生管理。半分以上見えたら 1 回だけ再生し、終わったら「もう一度再生」を出す。
 * 再生はクラスの付け直しで CSS アニメを頭から流し直す（DOM は作り直さない）。
 */
function useFigurePlay(totalSec: number) {
  const ref = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const isTransitioning = useViewTransitionState(pathname);
  const transitioningRef = useRef(isTransitioning);
  const [armed, setArmed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);

  useLayoutEffect(() => {
    transitioningRef.current = isTransitioning;
  });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;
    // 遷移で入ってきて、もう画面に入っている図は描かずに終状態のまま
    if (transitioningRef.current && el.getBoundingClientRect().top < window.innerHeight) return;

    setArmed(true);
    const io = new IntersectionObserver(
      (entries, observer) => {
        for (const e of entries) {
          if (!e.isIntersecting && e.boundingClientRect.top >= 0) continue;
          const rootH = e.rootBounds?.height ?? window.innerHeight;
          const passed = e.boundingClientRect.bottom < 0;
          const enough = e.intersectionRatio >= 0.5 || e.intersectionRect.height >= rootH * 0.5;
          // 遷移の最中に少しでも見えた図は、半分未満でも終状態で出す（空のまま見せない）
          const duringTransition = transitioningRef.current && e.isIntersecting;
          if (!passed && !enough && !duringTransition) continue;
          observer.disconnect();
          if (duringTransition || passed) {
            // 戻る / 進むで復元された位置で見えている・すでに通り過ぎた図は終状態で出す
            setArmed(false);
            setPlayed(true);
          } else {
            setPlaying(true);
          }
          return;
        }
      },
      { threshold: THRESHOLDS }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || played) return;
    const t = window.setTimeout(() => setPlayed(true), totalSec * 1000);
    return () => window.clearTimeout(t);
  }, [playing, played, totalSec]);

  const replay = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove("is-playing");
    void el.offsetWidth; // 終わった animation を一度破棄してから付け直す
    el.classList.add("is-playing");
  }, []);

  const className = ["wfig", armed && "is-armed", playing && "is-playing", played && "is-played"]
    .filter(Boolean)
    .join(" ");
  return { ref, className, replay };
}

const ReplayButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button type="button" className="wfig-replay" onClick={onClick} aria-label="図をもう一度再生">
    もう一度再生
  </button>
);

const FigureFrame: React.FC<{
  play: ReturnType<typeof useFigurePlay>;
  label: string;
  caption?: React.ReactNode;
  gap: number;
  extraClass?: string;
  children: React.ReactNode;
}> = ({ play, label, caption, gap, extraClass = "", children }) => (
  <figure
    ref={play.ref}
    className={`${play.className} ${extraClass}`}
    style={{ "--gap": `${gap}s`, "--step": `${STEP_SEC}s` } as React.CSSProperties}
  >
    <div className="wfig-canvas" role="img" aria-label={label}>
      {children}
    </div>
    <div className="wfig-foot">
      {caption ? <figcaption>{caption}</figcaption> : <span />}
      <ReplayButton onClick={play.replay} />
    </div>
  </figure>
);

/* ─── Flow: 処理の流れ ───────────────────────── */

export type FlowStep = {
  /** ノードの名前（「PDF」「GROBID」など） */
  title: React.ReactNode;
  /** そのステップで運ぶ値・出力（等幅の札で出す。例: `-..`、350mm） */
  value?: React.ReactNode;
  /** 1 行の補足 */
  detail?: React.ReactNode;
};

/**
 * 処理の流れ。ノードが順に浮かび、あいだの線が伸びる。
 * PC（md 以上）はステップが 4 つまでなら横並び、それより多いか direction="vertical" なら縦並び。スマホは常に縦並び。
 * note は図の下に添える補足（分岐や例外の経路）。
 */
export const Flow: React.FC<{
  steps: FlowStep[];
  /** 読み上げ用の図の説明（図の内容を 1 文で） */
  label: string;
  caption?: React.ReactNode;
  note?: React.ReactNode;
  direction?: "auto" | "vertical";
}> = ({ steps, label, caption, note, direction = "auto" }) => {
  const n = steps.length;
  const gap = gapFor(n);
  const play = useFigurePlay((n - 1) * gap + STEP_SEC + 0.3);
  const horizontal = direction === "auto" && n <= 4;

  return (
    <FigureFrame play={play} label={label} caption={caption} gap={gap} extraClass={`wfig-flow ${horizontal ? "is-row" : ""}`}>
      <ol className="wfig-flow-list" style={{ "--n": n } as React.CSSProperties}>
        {steps.map((s, i) => (
          <li key={i} className="wfig-flow-item" style={{ "--i": i } as React.CSSProperties}>
            <div className="wfig-node">
              <span className="wfig-node-no">{String(i + 1).padStart(2, "0")}</span>
              <span className="wfig-node-title">{s.title}</span>
              {s.value && <span className="wfig-value">{s.value}</span>}
              {s.detail && <span className="wfig-node-detail">{s.detail}</span>}
            </div>
            {i < n - 1 && <span aria-hidden className="wfig-link" />}
          </li>
        ))}
      </ol>
      {note && (
        <p className="wfig-note" style={{ "--n": n } as React.CSSProperties}>
          {note}
        </p>
      )}
    </FigureFrame>
  );
};

/* ─── Layers: 構成図 ─────────────────────────── */

export type Layer = {
  title: React.ReactNode;
  /** 層の中身（技術名など）。小さな札で並べる */
  items?: React.ReactNode[];
  detail?: React.ReactNode;
  /** 次の層へのつなぎに添える文字（「HTTP」「MCP」など） */
  link?: React.ReactNode;
  /** 横に出る別経路（例: 「R2 へ直接アップロード」）。層の右（スマホでは下）に線でつなぐ */
  aside?: { title: React.ReactNode; detail?: React.ReactNode };
  /** 境界（boundary）の外に置く層。先頭か末尾に置く */
  outside?: boolean;
};

/**
 * 構成図。層を上から積み、層のあいだの線を順に描く。
 * boundary を渡すと、outside でない層を囲む枠（「127.0.0.1 の中」など）を最後に出す。
 */
export const Layers: React.FC<{
  layers: Layer[];
  label: string;
  caption?: React.ReactNode;
  boundary?: React.ReactNode;
}> = ({ layers, label, caption, boundary }) => {
  const n = layers.length;
  const gap = gapFor(n + 1);
  const play = useFigurePlay(n * gap + STEP_SEC + 0.3);

  const renderLayer = (l: Layer, i: number) => (
    <li key={i} className="wfig-layer" style={{ "--i": i } as React.CSSProperties}>
      <div className="wfig-layer-row">
        <div className="wfig-node">
          <span className="wfig-node-title">{l.title}</span>
          {l.detail && <span className="wfig-node-detail">{l.detail}</span>}
          {l.items && l.items.length > 0 && (
            <span className="wfig-chips">
              {l.items.map((it, j) => (
                <span key={j} className="wfig-chip">
                  {it}
                </span>
              ))}
            </span>
          )}
        </div>
        {l.aside && (
          <div className="wfig-aside">
            <span aria-hidden className="wfig-aside-link" />
            <div className="wfig-node is-aside">
              <span className="wfig-node-title">{l.aside.title}</span>
              {l.aside.detail && <span className="wfig-node-detail">{l.aside.detail}</span>}
            </div>
          </div>
        )}
      </div>
      {i < n - 1 && (
        <div className="wfig-layer-link">
          <span aria-hidden className="wfig-link" />
          {l.link && <span className="wfig-link-label">{l.link}</span>}
        </div>
      )}
    </li>
  );

  const firstIn = layers.findIndex((l) => !l.outside);
  const lastIn = layers.length - 1 - [...layers].reverse().findIndex((l) => !l.outside);
  const hasBoundary = boundary != null && firstIn >= 0;

  return (
    <FigureFrame play={play} label={label} caption={caption} gap={gap} extraClass="wfig-layers">
      <ol className="wfig-layer-list">
        {hasBoundary ? (
          <>
            {layers.slice(0, firstIn).map((l, i) => renderLayer(l, i))}
            <li className="wfig-boundary" style={{ "--i": n } as React.CSSProperties}>
              <span className="wfig-boundary-label">{boundary}</span>
              <ol className="wfig-layer-list">{layers.slice(firstIn, lastIn + 1).map((l, i) => renderLayer(l, firstIn + i))}</ol>
            </li>
            {layers.slice(lastIn + 1).map((l, i) => renderLayer(l, lastIn + 1 + i))}
          </>
        ) : (
          layers.map(renderLayer)
        )}
      </ol>
    </FigureFrame>
  );
};
