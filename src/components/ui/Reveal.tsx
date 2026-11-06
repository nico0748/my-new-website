import React, { useLayoutEffect, useRef, useState } from "react";
import { useLocation, useViewTransitionState } from "react-router-dom";

/**
 * 同じフレームでまとめて画面に入った要素には、DOM 順に少しずつ遅延を付ける。
 * 初回表示（Profile → WORKS）や、カードの 1 行（左 → 右）が順番に浮かび上がる。
 */
const STAGGER_SEC = 0.1;
let batchStartedAt = 0;
let batchCount = 0;
const nextStagger = (): number => {
  const now = performance.now();
  if (now - batchStartedAt > 120) {
    batchStartedAt = now;
    batchCount = 0;
  }
  return Math.min(batchCount++, 5) * STAGGER_SEC;
};

/**
 * IntersectionObserver のコールバックはブラウザが呼ぶ順番が決まっていない（Chromium では毎回変わる）。
 * 同じ通知でまとめて入った要素をいったん溜め、DOM 順に並べてから遅延を割り当てる。
 * 通知はすべての Observer のコールバックを 1 つのタスクで呼ぶので、次のタスク（setTimeout 0）で並べればそろう。
 */
type PendingShow = { el: HTMLElement; show: (stagger: number) => void };
let pendingShows: PendingShow[] = [];
const queueShow = (el: HTMLElement, show: (stagger: number) => void) => {
  pendingShows.push({ el, show });
  if (pendingShows.length > 1) return;
  setTimeout(() => {
    const batch = pendingShows;
    pendingShows = [];
    batch
      .sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
      .forEach((p) => p.show(nextStagger()));
  }, 0);
};

type RevealTag = "div" | "li" | "section";

type RevealProps = {
  as?: RevealTag;
  /** 自動で付く順番の遅延に足す秒数。 */
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "className" | "style" | "children">;

/**
 * スクロールして画面に入ったら、下からフェードインさせる（一度だけ）。
 *
 * ページ遷移（View Transition）で入ってきたときは、最初から画面内にある要素は
 * アニメさせずに即表示する。遷移アニメと二重にならず、一覧カードの画像やタイトルの
 * モーフが終わった瞬間に要素が消えて浮かび直す「ちらつき」も起きない。
 * 戻る・進む（スクロール位置が復元される）でも同じになるよう、遷移アニメの最中に
 * 画面へ入ったものも即表示にする。
 * 動きを減らす設定（prefers-reduced-motion）では CSS 側で常に表示する。
 */
const Reveal: React.FC<RevealProps> = ({ as = "div", delay = 0, className = "", style, children, ...rest }) => {
  const ref = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  // 最初の描画の時点でページ遷移アニメの最中か（＝遷移で入ってきたか）だけを覚えておく
  const isTransitioning = useViewTransitionState(pathname);
  const enteredByTransition = useRef(isTransitioning);
  // 今まさに遷移アニメの最中か。描画のたびに写しておき、IntersectionObserver のコールバックから読む
  const isTransitioningRef = useRef(isTransitioning);
  const [state, setState] = useState<"hidden" | "shown" | "instant">("hidden");
  const [stagger, setStagger] = useState(0);

  useLayoutEffect(() => {
    isTransitioningRef.current = isTransitioning;
  });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (enteredByTransition.current) {
      // 遷移後はページ先頭から表示されるので、文書内の位置で「最初の画面に入るか」を判定する
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (top < window.innerHeight) {
        setState("instant");
        return;
      }
    }

    if (!("IntersectionObserver" in window)) {
      setState("instant");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // 画面に入った / すでに上へ通り過ぎている（戻る操作でスクロール位置が復元された）なら表示
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          if (isTransitioningRef.current) {
            // 遷移アニメの最中に入った（戻る・進むで復元された位置で見えている）なら即表示。
            // 上の「先頭から表示」前提の判定では拾えず、モーフの直後に消えて浮かび直してしまうため
            setState("instant");
          } else {
            queueShow(el, (s) => {
              setStagger(s);
              setState("shown");
            });
          }
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const cls = ["reveal", state === "shown" && "is-shown", state === "instant" && "is-instant", className]
    .filter(Boolean)
    .join(" ");

  return React.createElement(
    as,
    {
      ...rest,
      ref,
      className: cls,
      style: { ...style, "--reveal-delay": `${stagger + delay}s` } as React.CSSProperties,
    },
    children
  );
};

export default Reveal;
