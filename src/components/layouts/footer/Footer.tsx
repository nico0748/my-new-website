import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#e8dbc6] text-center py-8 mt-16">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-gray-600">&copy; {new Date().getFullYear()} NICOLABO -にこラボ-. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
