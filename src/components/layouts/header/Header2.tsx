import React from 'react';
import type { HeaderProps2 } from '../../../types';

const KANSUJI = ['零', '壱', '弐', '参', '肆', '伍', '陸', '漆', '捌', '玖'];

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
        {/* Logo — 朱印風の○ + Portfolio */}
        <div className="flex items-center gap-2.5 select-none">
          <span
            className="inline-flex items-center justify-center"
            style={{
              width: '22px',
              height: '22px',
              background: 'var(--seal-red)',
              color: 'rgba(245, 237, 225, 0.95)',
              fontSize: '12px',
              fontWeight: 700,
              borderRadius: '2px',
              transform: 'rotate(-4deg)',
              fontFamily: "'Hina Mincho', 'Shippori Mincho B1', serif",
            }}
          >
            に
          </span>
          <span
            className="text-lg font-bold"
            style={{
              color: 'var(--accent)',
              letterSpacing: '0.08em',
              fontFamily: "'Hina Mincho', 'Shippori Mincho B1', serif",
            }}
          >
            Portfolio
          </span>
        </div>

        {/* Nav */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="flex gap-1 sm:gap-2">
            {navItems.map((item, i) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className="relative px-3 py-1.5 rounded text-sm capitalize transition-all duration-200 flex items-center gap-1.5"
                style={{
                  color: activeSection === item ? 'var(--accent)' : 'var(--text-secondary)',
                  background: activeSection === item ? 'var(--accent-bg)' : 'transparent',
                  letterSpacing: '0.1em',
                  fontFamily: "'Shippori Mincho B1', 'Noto Serif JP', serif",
                }}
              >
                <span
                  className="hidden sm:inline text-[12px]"
                  style={{
                    fontFamily: "'Hina Mincho', 'Shippori Mincho B1', serif",
                    opacity: 0.55,
                  }}
                >
                  {KANSUJI[i + 1] ?? String(i + 1)}
                </span>
                <span>{item}</span>
                {activeSection === item && (
                  <span
                    className="absolute bottom-0.5 left-3 right-3 h-px"
                    style={{ background: 'var(--accent)' }}
                  />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header2;
