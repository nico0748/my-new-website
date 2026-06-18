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
        {/* シアンの細点 */}
        <div className="flex items-center gap-2">
          <span className="h-px w-10" style={{ background: 'var(--accent)' }} />
          <span
            className="w-1 h-1 rounded-full"
            style={{ background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)' }}
          />
          <span className="h-px w-10" style={{ background: 'var(--accent)' }} />
        </div>
        <p
          className="text-sm"
          style={{
            color: 'var(--text-muted)',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.05em',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>$</span> echo &copy; {new Date().getFullYear()} NICOLABO -にこラボ-. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer2;
