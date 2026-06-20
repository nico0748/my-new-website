import React from 'react';
import NetworkSphere from './NetworkSphere';

interface TerminalBackgroundProps {
  children: React.ReactNode;
}

/** 漆黒地 + 極薄シアングリッド + 微グロー + 走査線の背景。
 *  旧 WashiBackground と同じシグネチャで差し替え可能（ページルートを必ずこれでラップする）。 */
const TerminalBackground: React.FC<TerminalBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* グリッド（極薄シアンの方眼） */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          maskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 30%, transparent 85%)',
        }}
      />

      {/* 球体ネットワーク網（回転するワイヤーフレーム球） */}
      <NetworkSphere />

      {/* シアングロー（上部に仄かに） */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0, 229, 204, 0.10), transparent 70%)',
        }}
      />

      {/* 走査線（scanline 極薄） */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.18) 0px, rgba(0, 0, 0, 0.18) 1px, transparent 1px, transparent 3px)',
          opacity: 0.35,
          mixBlendMode: 'multiply',
        }}
      />

      {/* コンテンツ */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default TerminalBackground;
