import React from 'react';

const Footer2: React.FC = () => {
  return (
    <footer className="bg-[#0B0C10] border-t border-gray-800 text-center py-8 mt-16">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} NICOLABO -にこラボ-. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer2;
