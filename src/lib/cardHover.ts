/**
 * カードのホバー（クラス .card-hover を付けた要素）。カーソルの位置に合わせて最大 MAX_TILT 度だけ傾き、少し浮く。
 *
 * - リスナーは document に 1 つずつだけ（/anime の数百枚のカードにも、カードごとの処理を足さない）。
 *   位置は requestAnimationFrame で 1 フレームに 1 回だけ読む。
 * - マウス（hover できて細かく指せる端末）だけで動かす。タッチ・キーボードでは何もしない。
 *   動きを減らす設定でも何もしない（CSS 側でも transform を止めている）。
 * - 押した瞬間に平らに戻す（.is-pressed）。View Transition は押したあとに旧ページを撮るので、
 *   傾いたままだと共有要素のモーフが傾いた状態から始まってしまう。
 * - スクロールしたら戻す（カーソルの下のカードが入れ替わっても pointermove は来ないため）。
 *
 * 見た目（傾き・浮き・時間）は index.css の「カードのホバー」節。
 */
const MAX_TILT = 4;

export const installCardHover = (): (() => void) => {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let current: HTMLElement | null = null;
  let frame = 0;
  let x = 0;
  let y = 0;

  const cardOf = (target: EventTarget | null) =>
    target instanceof Element ? target.closest<HTMLElement>(".card-hover") : null;

  const release = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (!current) return;
    current.classList.remove("is-tilting", "is-pressed");
    current.style.removeProperty("--tilt-x");
    current.style.removeProperty("--tilt-y");
    current = null;
  };

  const update = () => {
    frame = 0;
    const card = current;
    if (!card || card.classList.contains("is-pressed")) return;
    const r = card.getBoundingClientRect();
    if (!r.width || !r.height) return;
    // カードの中心を 0 として -0.5〜0.5。カーソルのある側が手前に浮くように傾ける
    const px = Math.min(Math.max((x - r.left) / r.width, 0), 1) - 0.5;
    const py = Math.min(Math.max((y - r.top) / r.height, 0), 1) - 0.5;
    card.style.setProperty("--tilt-x", `${(-py * 2 * MAX_TILT).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${(px * 2 * MAX_TILT).toFixed(2)}deg`);
    card.classList.add("is-tilting");
  };

  const onPointerMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !finePointer.matches || reducedMotion.matches) {
      release();
      return;
    }
    const card = cardOf(e.target);
    if (card !== current) {
      release();
      current = card;
    }
    if (!card) return;
    x = e.clientX;
    y = e.clientY;
    if (!frame) frame = requestAnimationFrame(update);
  };

  const onPointerDown = (e: PointerEvent) => {
    const card = cardOf(e.target);
    if (!card || card !== current) return;
    cancelAnimationFrame(frame);
    frame = 0;
    card.classList.add("is-pressed");
  };

  const root = document.documentElement;
  document.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerdown", onPointerDown, { passive: true });
  window.addEventListener("scroll", release, { passive: true });
  root.addEventListener("pointerleave", release);
  window.addEventListener("blur", release);

  return () => {
    release();
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("scroll", release);
    root.removeEventListener("pointerleave", release);
    window.removeEventListener("blur", release);
  };
};
