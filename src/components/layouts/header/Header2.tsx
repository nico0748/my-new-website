import React from 'react';
import type { HeaderProps2 } from '../../../types';
import ThemeToggle from '../../ui/ThemeToggle';

const Header2: React.FC<HeaderProps2> = ({ activeSection, scrollToSection }) => {
  const navItems = ['profile', 'projects', 'skills', 'timeline'];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 w-full max-w-full overflow-x-hidden"
      style={{
        background: 'var(--header-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        boxShadow: '0 1px 24px var(--accent-shadow)',
      }}
    >
      <div className="flex items-center justify-between px-6 sm:px-12 md:px-20 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2 select-none">
          <span
            className="text-xs font-semibold tracking-[0.3em]"
            style={{
              color: 'var(--accent)',
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              opacity: 0.65,
            }}
          >
            //
          </span>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: 'var(--accent)', letterSpacing: '-0.02em' }}
          >
            Portfolio
          </span>
        </div>

        {/* Nav + Theme Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="flex gap-1 sm:gap-2">
            {navItems.map((item, i) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="relative px-3 py-1.5 rounded-lg text-sm font-medium capitalize tracking-wide transition-all duration-200 flex items-center gap-1.5"
                style={{
                  color: activeSection === item ? 'var(--accent)' : 'var(--text-secondary)',
                  background: activeSection === item ? 'var(--accent-bg)' : 'transparent',
                }}
              >
                <span
                  className="hidden sm:inline text-[10px] font-semibold tracking-widest"
                  style={{
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    opacity: 0.55,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>{item}</span>
                {activeSection === item && (
                  <span
                    className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
              </button>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header2;
