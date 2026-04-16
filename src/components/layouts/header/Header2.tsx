import React from 'react';
import type { HeaderProps2 } from '../../../types';

const Header2: React.FC<HeaderProps2> = ({ activeSection, scrollToSection }) => {
  const navItems = ['profile', 'projects', 'skills', 'timeline'];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full max-w-full overflow-x-hidden"
      style={{
        background: 'rgba(244, 246, 251, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(99, 152, 219, 0.2)',
        boxShadow: '0 1px 24px rgba(37, 99, 235, 0.06)',
      }}
    >
      <div className="flex items-center justify-between px-6 sm:px-12 md:px-20 py-4">
        {/* Logo */}
        <span
          className="text-lg font-bold tracking-tight select-none"
          style={{ color: '#2563eb', letterSpacing: '-0.02em' }}
        >
          Portfolio
        </span>

        {/* Nav */}
        <nav className="flex gap-1 sm:gap-2">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item)}
              className="relative px-3 py-1.5 rounded-lg text-sm font-medium capitalize tracking-wide transition-all duration-200"
              style={{
                color: activeSection === item ? '#2563eb' : '#64748b',
                background: activeSection === item ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
              }}
            >
              {item}
              {activeSection === item && (
                <span
                  className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full"
                  style={{ background: '#2563eb' }}
                />
              )}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header2;
