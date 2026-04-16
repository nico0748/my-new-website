import React from 'react';

interface CornerMarksProps {
  color?: string;
  size?: number;
  offset?: number;
  strokeWidth?: number;
}

const CornerMarks: React.FC<CornerMarksProps> = ({
  color = 'rgba(37, 99, 235, 0.45)',
  size = 10,
  offset = -5,
  strokeWidth = 1.25,
}) => {
  const positions = [
    { top: offset, left: offset },
    { top: offset, right: offset },
    { bottom: offset, left: offset },
    { bottom: offset, right: offset },
  ] as const;

  return (
    <>
      {positions.map((pos, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute pointer-events-none"
          style={pos}
        >
          <line
            x1={size / 2}
            y1="0"
            x2={size / 2}
            y2={size}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          <line
            x1="0"
            y1={size / 2}
            x2={size}
            y2={size / 2}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        </svg>
      ))}
    </>
  );
};

export default CornerMarks;
