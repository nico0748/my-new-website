import React from 'react';
import type { HeaderProps2 } from '../../../types';

const Header2: React.FC<HeaderProps2> = ({ activeSection, scrollToSection }) => {
  const navItems = ['profile', 'projects', 'skills', 'timeline'];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-md shadow-lg border-b border-white/10 py-4 px-4 sm:px-8 md:px-16 w-full max-w-full overflow-x-hidden">
      <div className="flex justify-center w-full max-w-full">
        <nav className="flex flex-wrap justify-center gap-4 sm:gap-8 md:gap-12 max-w-full">
          {navItems.map(item => (
            <button 
              key={item}
              onClick={() => scrollToSection(item)} 
              className={`capitalize text-sm md:text-base font-medium tracking-wider transition-all duration-300 px-2 py-1 whitespace-nowrap relative group ${activeSection === item ? 'text-[#d4af37]' : 'text-gray-300 hover:text-white'}`}
            >
              {item}
              <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#d4af37] transform origin-left transition-transform duration-300 ${activeSection === item ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header2;