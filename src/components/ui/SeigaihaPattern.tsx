import React from 'react';

interface SeigaihaPatternProps {
  size?: number;
  color?: string;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

const SeigaihaPattern: React.FC<SeigaihaPatternProps> = ({
  size = 60,
  color = 'currentColor',
  opacity = 0.06,
  className = '',
  style,
}) => {
  const patternId = React.useId();
  return (
    <svg
      aria-hidden
      className={className}
      style={{ ...style, opacity }}
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width={size}
          height={size / 2}
          patternUnits="userSpaceOnUse"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 0.5}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size / 2) * 0.66}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={(size / 2) * 0.33}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
          <circle
            cx={0}
            cy={0}
            r={size / 2 - 0.5}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
          <circle
            cx={0}
            cy={0}
            r={(size / 2) * 0.66}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
          <circle
            cx={0}
            cy={0}
            r={(size / 2) * 0.33}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
          <circle
            cx={size}
            cy={0}
            r={size / 2 - 0.5}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
          <circle
            cx={size}
            cy={0}
            r={(size / 2) * 0.66}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
          <circle
            cx={size}
            cy={0}
            r={(size / 2) * 0.33}
            fill="none"
            stroke={color}
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

export default SeigaihaPattern;
