import React from 'react';
import type { HeaderProps } from '../../../types';

const Header: React.FC<HeaderProps> = ({ activeSection, scrollToSection }) => {
  const navItems = ['profile', 'works', 'records', 'recs', 'events', 'contact'];
  
  return (
    <header className="sticky top-0 z-50 bg-[#f1e6d1]/80 backdrop-blur-sm shadow-md py-4 px-4 sm:px-8 md:px-16 flex justify-center">
      <nav className="flex flex-wrap justify-center space-x-4 md:space-x-8">
        {navItems.map(item => (
          <button 
            key={item}
            onClick={() => scrollToSection(item)} 
            className={`capitalize text-sm md:text-lg font-bold transition-colors duration-300 ${activeSection === item ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
