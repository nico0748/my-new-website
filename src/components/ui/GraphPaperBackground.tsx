import React from 'react';

interface GraphPaperBackgroundProps {
  children: React.ReactNode;
}

const GraphPaperBackground: React.FC<GraphPaperBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen" style={{ backgroundColor: '#f4f6fb' }}>
      {/* 方眼紙パターン */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 152, 219, 0.18) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 152, 219, 0.18) 1px, transparent 1px),
            linear-gradient(rgba(99, 152, 219, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 152, 219, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 40px 40px, 8px 8px, 8px 8px',
          backgroundPosition: '-1px -1px, -1px -1px, -1px -1px, -1px -1px',
        }}
      />
      {/* コンテンツ */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GraphPaperBackground;
