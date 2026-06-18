import React from 'react';
import type { HeaderProps2 } from '../../../types';

const Header2: React.FC<HeaderProps2> = ({ activeSection, scrollToSection }) => {
  const navItems = ['profile', 'topics', 'projects', 'skills', 'timeline'];

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
        {/* Logo — プロンプトグリフ + portfolio */}
        <div
          className="flex items-center gap-2 select-none"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          <span
            className="inline-flex items-center justify-center font-bold"
            style={{
              width: '24px',
              height: '24px',
              background: 'var(--accent-bg)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent)',
              fontSize: '13px',
              borderRadius: '4px',
            }}
          >
            {'>'}_
          </span>
          <span
            className="text-base sm:text-lg font-bold"
            style={{
              color: 'var(--text-primary)',
              letterSpacing: '0.02em',
            }}
          >
            <span style={{ color: 'var(--accent)' }}>~/</span>portfolio
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
                  letterSpacing: '0.08em',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                <span
                  className="hidden sm:inline text-[12px]"
                  style={{
                    color: 'var(--accent)',
                    opacity: 0.7,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
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
