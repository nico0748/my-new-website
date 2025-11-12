import React from 'react';
import type { HeaderProps2 } from '../../../types';

const Header2: React.FC<HeaderProps2> = ({ activeSection, scrollToSection }) => {
  const navItems = ['profile', 'projects', 'skills', 'timeline'];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#f1e6d1]/90 backdrop-blur-sm shadow-md py-4 px-4 sm:px-8 md:px-16 w-full max-w-full overflow-x-hidden">
      <div className="flex justify-center w-full max-w-full">
        <nav className="flex flex-wrap justify-center gap-2 sm:gap-4 md:gap-8 max-w-full">
          {navItems.map(item => (
            <button 
              key={item}
              onClick={() => scrollToSection(item)} 
              className={`capitalize text-sm md:text-lg font-bold transition-colors duration-300 px-2 py-1 whitespace-nowrap ${activeSection === item ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header2;