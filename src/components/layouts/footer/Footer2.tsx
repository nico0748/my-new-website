import React from 'react';

const Footer2: React.FC = () => {
  return (
    <footer
      className="text-center py-10 mt-20"
      style={{
        borderTop: '1px solid rgba(99, 152, 219, 0.2)',
        background: 'rgba(244, 246, 251, 0.6)',
      }}
    >
      <div className="container mx-auto px-4">
        <p className="text-sm" style={{ color: '#94a3b8' }}>
          &copy; {new Date().getFullYear()} NICOLABO -にこラボ-. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer2;
