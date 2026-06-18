import React from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  index?: number;
  label?: string;
  subtitle?: string;
}

const pad2 = (n: number) => String(n).padStart(2, '0');

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  title,
  children,
  className = "",
  index,
  label,
  subtitle,
}) => {
  const num = typeof index === 'number' ? pad2(index) : null;

  return (
    <section
      id={id}
      className={`relative py-10 md:py-14 flex items-center justify-center w-full max-w-full overflow-x-hidden ${className}`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center">
        {title && (
          <motion.div
            className="mb-8 md:mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {(num || label) && (
              <div
                className="flex items-center justify-center gap-3 mb-4 text-xs font-medium tracking-[0.2em]"
                style={{
                  color: 'var(--accent)',
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {num && (
                  <span
                    className="inline-flex items-center justify-center px-2 py-0.5"
                    style={{
                      background: 'var(--accent-bg)',
                      border: '1px solid var(--accent-border)',
                      color: 'var(--accent)',
                      fontSize: '12px',
                      fontWeight: 600,
                      borderRadius: '4px',
                    }}
                  >
                    {num}
                  </span>
                )}
                <span style={{ color: 'var(--text-muted)' }}>
                  <span style={{ color: 'var(--accent)' }}>~/</span>
                  {(label ?? id).toLowerCase()}
                  <span style={{ color: 'var(--text-secondary)' }}> ❯</span>
                </span>
              </div>
            )}
            <h2
              className="text-4xl md:text-6xl font-bold"
              style={{
                color: 'var(--text-primary)',
                letterSpacing: '0.02em',
                fontFamily: "'JetBrains Mono', 'Noto Sans JP', monospace",
              }}
            >
              {title}
              <span
                className="terminal-cursor ml-1"
                style={{ color: 'var(--accent)' }}
              >
                _
              </span>
            </h2>
            {/* セクションタイトル下のアクセント — シアンの下線 */}
            <div className="flex items-center justify-center gap-2 mt-5">
              <span className="w-16 h-px" style={{ background: 'var(--accent)' }} />
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }}
              />
              <span className="w-16 h-px" style={{ background: 'var(--accent)' }} />
            </div>
            {subtitle && (
              <p
                className="mt-5 text-sm sm:text-base max-w-2xl mx-auto leading-loose"
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}
              >
                {subtitle}
              </p>
            )}
          </motion.div>
        )}
        <div className="w-full max-w-full">
          {children}
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper;
