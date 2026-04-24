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
      <div className="container mx-auto px-4">
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} NICOLABO -にこラボ-. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer2;
