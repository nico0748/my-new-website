import React from 'react';

interface SiteBackgroundProps {
  children: React.ReactNode;
}

/** サイト共通の背景。落ち着いた黒一色に、上部へごく僅かな明るさを乗せるだけのミニマルな地。
 *  ページルートを必ずこれでラップする（ポートフォリオ側。Learn は独自スタイル）。 */
const SiteBackground: React.FC<SiteBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px]"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, var(--bg-glow), transparent 70%)' }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SiteBackground;
