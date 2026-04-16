import React from 'react';
import { motion } from 'framer-motion';

interface SectionWrapperProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({
  id,
  title,
  children,
  className = "",
}) => {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 min-h-[50vh] flex items-center justify-center w-full max-w-full overflow-x-hidden ${className}`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 flex flex-col items-center">
        {title && (
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="text-4xl md:text-6xl font-bold tracking-tight"
              style={{ color: '#1e293b', letterSpacing: '-0.03em' }}
            >
              {title}
            </h2>
            {/* セクションタイトル下のアクセントライン */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="w-8 h-0.5 rounded-full" style={{ background: '#2563eb' }} />
              <span className="w-2 h-2 rounded-full" style={{ background: '#2563eb' }} />
              <span className="w-8 h-0.5 rounded-full" style={{ background: '#2563eb' }} />
            </div>
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
