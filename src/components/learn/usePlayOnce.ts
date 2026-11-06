import { useCallback, useEffect, useRef, useState } from "react";

/** 図解を「見えたときに 1 回だけ再生して止まる」ためのフック（diagrams.tsx 用）。
 *
 *  - 要素が半分以上見えたら playing=true。以後 false には戻らない（IO は発火した時点で disconnect）
 *  - StrictMode の effect 二重実行でも、発火済みなら observe し直さないので結果は同じ
 *  - doneAfterMs を渡すと、再生開始からその時間後に played=true（「もう一度再生」ボタンの表示用）
 *  - replay() は再生クラスを付け直して CSS アニメを頭から流し直す。再マウントはしない
 *    （LearnLayout の目次は MutationObserver で本文の子要素の増減を見ているため、DOM を作り直さない）
 *
 *  動きそのものは learn.css の `.dgm-play.is-playing` 配下に書く。
 *  prefers-reduced-motion: reduce では CSS 側が終状態を出すので、ここでは分岐しない。 */
export const PLAYING_CLASS = "is-playing";

/** 縦に長い図でも発火できるよう、見えている割合を 10% 刻みで受け取る */
const THRESHOLDS = Array.from({ length: 11 }, (_, i) => i / 10);

export function usePlayOnce<T extends HTMLElement>(doneAfterMs = 0) {
  const ref = useRef<T>(null);
  const firedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || firedRef.current) return;
    const fire = () => {
      firedRef.current = true;
      setPlaying(true);
    };
    if (typeof IntersectionObserver === "undefined") {
      fire();
      return;
    }
    const io = new IntersectionObserver(
      (entries, observer) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          // 図の半分以上、または（画面より背が高い図なら）画面の半分以上を占めたら再生
          const rootH = e.rootBounds?.height ?? window.innerHeight;
          if (e.intersectionRatio >= 0.5 || e.intersectionRect.height >= rootH * 0.5) {
            observer.disconnect();
            fire();
            return;
          }
        }
      },
      { threshold: THRESHOLDS }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || played) return;
    const t = window.setTimeout(() => setPlayed(true), doneAfterMs);
    return () => window.clearTimeout(t);
  }, [playing, played, doneAfterMs]);

  const replay = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.classList.remove(PLAYING_CLASS);
    // ここでスタイルを確定させ、終わった animation を一度破棄してから付け直す
    void el.offsetWidth;
    el.classList.add(PLAYING_CLASS);
  }, []);

  return { ref, playing, played, replay };
}
