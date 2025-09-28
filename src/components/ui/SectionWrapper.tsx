import React from 'react';

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
  className = "" 
}) => {
  return (
    <section 
      id={id} 
      className={`py-20 md:py-32 min-h-screen flex items-center justify-center w-full max-w-full overflow-x-hidden ${className}`}
    >
      <div className="w-full max-w-5xl mx-auto px-4 flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center w-full">
          {title}
        </h2>
        <div className="w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </div>
    </section>
  );
};

export default SectionWrapper;