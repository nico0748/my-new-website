import React, { useEffect, useLayoutEffect, useRef } from "react";
import { X } from "lucide-react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * ポップアップの外枠（アニメ・Timeline で共通）。背景とパネルは View Transition の名前
 * （modal-backdrop / modal-panel）を持ち、開閉時に背景は暗転・パネルは下から浮かぶ（index.css）。
 * - Esc・背景のクリック・閉じるボタンで閉じる。開いている間はページのスクロールを止める
 * - 開いたら閉じるボタンにフォーカスし、Tab はパネルの中だけを回る。閉じたら開く前の要素にフォーカスを戻す
 * - スマホでは画面の下に寄せ、PC では中央に置く
 */
const Modal: React.FC<{
  /** 見出しの id（aria-labelledby） */
  labelledBy: string;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ labelledBy, onClose, children }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  useLayoutEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
      if (e.key !== "Tab" || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const inside = panelRef.current.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === first || !inside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !inside)) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      // 同じページで閉じたときだけ戻す（別のページへ移ったときは開いた要素がもう無い）
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <div
        className="absolute inset-0"
        style={{ background: "var(--overlay)", viewTransitionName: "modal-backdrop" }}
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={panelRef}
        className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[720px] flex-col overflow-hidden rounded-xl border border-white/[0.1] sm:max-h-[calc(100dvh-4rem)]"
        style={{ background: "var(--surface)", viewTransitionName: "modal-panel" }}
      >
        <div className="overflow-y-auto">{children}</div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="閉じる"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full opacity-90 transition-opacity hover:opacity-100"
          style={{ background: "var(--overlay)", color: "var(--text-primary)" }}
        >
          <X size={18} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
};

export default Modal;
