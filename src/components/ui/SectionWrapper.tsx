import React from 'react';

interface SectionWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/** 趣味ページ等で使う汎用セクション。小さな見出し + 広めの余白だけで区切る。 */
const SectionWrapper: React.FC<SectionWrapperProps> = ({ id, title, children, className = '' }) => (
  <section id={id} className={`w-full max-w-5xl mx-auto px-6 py-20 scroll-mt-20 ${className}`}>
    {title && (
      <h2
        className="text-[13px] font-medium uppercase tracking-[0.18em] mb-10"
        style={{ color: 'var(--text-muted)' }}
      >
        {title}
      </h2>
    )}
    {children}
  </section>
);

export default SectionWrapper;
