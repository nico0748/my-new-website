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

const KANSUJI = ['零', '壱', '弐', '参', '肆', '伍', '陸', '漆', '捌', '玖'];
const toKansuji = (n: number) => (n >= 0 && n < KANSUJI.length ? KANSUJI[n] : String(n));

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  title,
  children,
  className = "",
  index,
  label,
  subtitle,
}) => {
  const kansuji = typeof index === 'number' ? toKansuji(index) : null;

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
            {(kansuji || label) && (
              <div
                className="flex items-center justify-center gap-3 mb-4 text-xs font-medium tracking-[0.3em] uppercase"
                style={{
                  color: 'var(--accent)',
                  fontFamily: "'Hina Mincho', 'Shippori Mincho B1', serif",
                }}
              >
                {kansuji && (
                  <span
                    className="inline-flex items-center justify-center"
                    style={{
                      width: '28px',
                      height: '28px',
                      background: 'var(--seal-red)',
                      color: 'rgba(245, 237, 225, 0.95)',
                      fontSize: '15px',
                      fontWeight: 700,
                      transform: 'rotate(-4deg)',
                      letterSpacing: 0,
                      borderRadius: '2px',
                      fontFamily: "'Hina Mincho', 'Shippori Mincho B1', serif",
                    }}
                  >
                    {kansuji}
                  </span>
                )}
                <span
                  className="h-px w-10"
                  style={{ background: 'var(--accent-border)' }}
                />
                <span style={{ letterSpacing: '0.4em' }}>{label ?? id}</span>
              </div>
            )}
            <h2
              className="text-4xl md:text-6xl font-bold"
              style={{
                color: 'var(--text-primary)',
                letterSpacing: '0.04em',
                fontFamily: "'Hina Mincho', 'Shippori Mincho B1', serif",
              }}
            >
              {title}
            </h2>
            {/* セクションタイトル下のアクセント — 細い墨線 + 朱の点 */}
            <div className="flex items-center justify-center gap-2 mt-5">
              <span className="w-12 h-px" style={{ background: 'var(--text-muted)' }} />
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--seal-red)' }}
              />
              <span className="w-12 h-px" style={{ background: 'var(--text-muted)' }} />
            </div>
            {subtitle && (
              <p
                className="mt-5 text-sm sm:text-base max-w-2xl mx-auto leading-loose"
                style={{
                  color: 'var(--text-secondary)',
                  fontFamily: "'Shippori Mincho B1', 'Noto Serif JP', serif",
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
