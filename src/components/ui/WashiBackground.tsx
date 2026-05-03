import React from 'react';
import SeigaihaPattern from './SeigaihaPattern';

interface WashiBackgroundProps {
  children: React.ReactNode;
}

/** 和紙地（生成り）+ 繊維ノイズ + 極薄の青海波パターンの背景。
 *  旧 GraphPaperBackground と同じシグネチャで差し替え可能。 */
const WashiBackground: React.FC<WashiBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      {/* 和紙繊維ノイズ（feTurbulence） */}
      <svg
        aria-hidden
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'multiply', opacity: 0.5 }}
      >
        <filter id="washi-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed="3"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.55
                    0 0 0 0 0.45
                    0 0 0 0 0.33
                    0 0 0 0.06 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#washi-noise)" />
      </svg>

      {/* 青海波パターン（極薄） */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ color: 'var(--accent-fox)' }}
      >
        <SeigaihaPattern size={80} color="currentColor" opacity={0.04} />
      </div>

      {/* 朱色のヴィネット（端を仄かに） */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(155, 74, 58, 0.06) 100%)',
        }}
      />

      {/* コンテンツ */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default WashiBackground;
