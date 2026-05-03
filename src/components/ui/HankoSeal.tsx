import React from 'react';

interface HankoSealProps {
  /** 印面に刻む文字（1〜2文字推奨） */
  text?: string;
  size?: number;
  color?: string;
  rotation?: number;
  className?: string;
  style?: React.CSSProperties;
}

/** 落款（朱印）風の装飾 SVG。タイトル横やセクション区切りに置く。 */
const HankoSeal: React.FC<HankoSealProps> = ({
  text = '弍',
  size = 36,
  color = 'var(--seal-red)',
  rotation = -6,
  className = '',
  style,
}) => {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 60 60"
      className={className}
      style={{
        transform: `rotate(${rotation}deg)`,
        ...style,
      }}
    >
      {/* 外枠（朱色の四角印） */}
      <rect
        x="3"
        y="3"
        width="54"
        height="54"
        rx="2"
        fill={color}
        stroke={color}
        strokeWidth="1"
      />
      {/* 内側の余白を擦れ感で表現 */}
      <rect
        x="6"
        y="6"
        width="48"
        height="48"
        rx="1"
        fill="none"
        stroke="rgba(245, 237, 225, 0.85)"
        strokeWidth="0.8"
      />
      {/* 文字 */}
      <text
        x="30"
        y="40"
        textAnchor="middle"
        fontFamily="'Hina Mincho', 'Shippori Mincho B1', serif"
        fontSize={text.length > 1 ? '20' : '32'}
        fontWeight="700"
        fill="rgba(245, 237, 225, 0.95)"
        style={{ letterSpacing: '-0.04em' }}
      >
        {text}
      </text>
      {/* 擦れノイズ（控えめ） */}
      <rect x="3" y="3" width="54" height="3" fill="rgba(245,237,225,0.18)" />
      <rect x="3" y="54" width="54" height="3" fill="rgba(245,237,225,0.12)" />
    </svg>
  );
};

export default HankoSeal;
