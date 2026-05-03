import React from 'react';

const Footer2: React.FC = () => {
  return (
    <footer
      className="text-center py-10 mt-20"
      style={{
        borderTop: '1px solid var(--border-color)',
        background: 'var(--footer-bg)',
      }}
    >
      <div className="container mx-auto px-4 flex flex-col items-center gap-3">
        {/* 朱の細点 */}
        <div className="flex items-center gap-2">
          <span className="h-px w-10" style={{ background: 'var(--text-muted)' }} />
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: 'var(--seal-red)' }}
          />
          <span className="h-px w-10" style={{ background: 'var(--text-muted)' }} />
        </div>
        <p
          className="text-sm"
          style={{
            color: 'var(--text-muted)',
            fontFamily: "'Shippori Mincho B1', 'Noto Serif JP', serif",
            letterSpacing: '0.1em',
          }}
        >
          &copy; {new Date().getFullYear()} NICOLABO -にこラボ-. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer2;
