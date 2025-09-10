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
      className={`py-20 md:py-32 min-h-screen flex items-center ${className}`}
    >
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
};

export default SectionWrapper;