/** 初回利用者向けオンボーディング・ツアー（nicoTech Learn）。
 *  - 初回訪問時に自動表示（localStorage `nicotech:onboarded`）
 *  - ヘッダーの「?」ボタン（window イベント "nicotech:guide-open"）でいつでも再表示
 *  - 数ステップのモーダルツアー。⚠ 絵文字は使わず SVG アイコンで表現。 */

import { useEffect, useState, type ReactNode } from "react";

const SEEN_KEY = "nicotech:onboarded";

interface Step {
  icon: ReactNode;
  title: string;
  body: ReactNode;
}

const I = {
  book: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><circle cx="3.5" cy="6" r="1" /><circle cx="3.5" cy="12" r="1" /><circle cx="3.5" cy="18" r="1" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  keys: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2" /><line x1="7" y1="12" x2="7" y2="12" /><line x1="12" y1="12" x2="12" y2="12" /><line x1="17" y1="12" x2="17" y2="12" /><line x1="7" y1="16" x2="17" y2="16" />
    </svg>
  ),
};

const STEPS: Step[] = [
  {
    icon: I.book,
    title: "nicoTech Learn へようこそ",
    body: "Web・インフラ・セキュリティなどを、章の順に積み上げて学べる教材ライブラリです。まずは使い方をかんたんに案内します。",
  },
  {
    icon: I.grid,
    title: "コースを選ぶ",
    body: <>トップの<strong>コースカード</strong>、または上部ヘッダーの<strong>コースナビ（Web / インフラ …）</strong>から、学びたい分野に移動できます。</>,
  },
  {
    icon: I.list,
    title: "章の順に読み進める",
    body: <>各コースは左サイドバーで<strong>章ごと</strong>に整理されています。記事は「入門 → 基礎 → 実践」の並び。上から順に読むのがおすすめです。</>,
  },
  {
    icon: I.check,
    title: "進捗が記録される",
    body: <>各見出しの<strong>チェックボックス</strong>で読了を記録。すべて読むと記事が完了になり、<strong>コースの進捗バー</strong>に反映されます。<strong>「続きから読む」</strong>で前回の続きに戻れます。</>,
  },
  {
    icon: I.keys,
    title: "便利な操作",
    body: <><strong>検索</strong>は <kbd>⌘</kbd><kbd>K</kbd>（Windows は <kbd>Ctrl</kbd><kbd>K</kbd>）。記事内では <kbd>←</kbd><kbd>→</kbd> で前後の記事へ。このガイドはヘッダーの <strong>?</strong> からいつでも開けます。</>,
  },
];

const OnboardingGuide = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  // 初回のみ自動表示 + ヘッダーの「?」/イベントで再表示
  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* noop */
    }
    if (!seen) {
      setStep(0);
      setOpen(true);
    }
    const onOpen = () => {
      setStep(0);
      setOpen(true);
    };
    window.addEventListener("nicotech:guide-open", onOpen);
    return () => window.removeEventListener("nicotech:guide-open", onOpen);
  }, []);

  // Esc で閉じる
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => {
    setOpen(false);
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* noop */
    }
  };

  if (!open) return null;

  const last = step === STEPS.length - 1;
  const s = STEPS[step];

  return (
    <div className="guide-overlay" onClick={close}>
      <div className="guide-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="使い方ガイド" aria-modal="true">
        <button className="guide-close" onClick={close} aria-label="閉じる">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="guide-icon">{s.icon}</div>
        <div className="guide-step-label">STEP {step + 1} / {STEPS.length}</div>
        <h2 className="guide-title">{s.title}</h2>
        <p className="guide-body">{s.body}</p>

        <div className="guide-dots" aria-hidden="true">
          {STEPS.map((_, i) => (
            <span key={i} className={`guide-dot${i === step ? " active" : ""}`} />
          ))}
        </div>

        <div className="guide-actions">
          <button className="guide-skip" onClick={close}>
            {last ? "" : "スキップ"}
          </button>
          <div className="guide-nav">
            {step > 0 && (
              <button className="guide-btn ghost" onClick={() => setStep((n) => n - 1)}>戻る</button>
            )}
            {last ? (
              <button className="guide-btn primary" onClick={close}>はじめる</button>
            ) : (
              <button className="guide-btn primary" onClick={() => setStep((n) => n + 1)}>次へ</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;
