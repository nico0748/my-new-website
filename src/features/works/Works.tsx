import React, { useState } from 'react';
import type { WorksProps } from '../../types';
import SectionWrapper from '../../components/ui/SectionWrapper';
import ViewToggleButton from '../../components/ui/ViewToggleButton';
import CarouselNavigation from '../../components/ui/CarouselNavigation';
import ContentCard from '../../components/ui/ContentCard';

const Works: React.FC<WorksProps> = ({ works, handleWorkClick }) => {
  const [isCarouselView, setIsCarouselView] = useState(true);
  const [currentWorkIndex, setCurrentWorkIndex] = useState(0);

  const safeWorksLength = works.length || 1;
  const nextWork = () => setCurrentWorkIndex((prev) => (prev + 1) % safeWorksLength);
  const prevWork = () => setCurrentWorkIndex((prev) => (prev - 1 + safeWorksLength) % safeWorksLength);

  return (
    <SectionWrapper id="works" title="Works">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
        <div className="sm:ml-auto">
          <ViewToggleButton 
            isCarouselView={isCarouselView} 
            onToggle={() => setIsCarouselView(!isCarouselView)} 
          />
        </div>
      </div>

      {isCarouselView ? (
        <div className="relative">
          {works.length > 0 && (
            <>
              <ContentCard
                imageUrl={works[currentWorkIndex].imageUrl}
                title={works[currentWorkIndex].title}
                onClick={() => handleWorkClick(works[currentWorkIndex])}
                className="mx-auto max-w-2xl"
                imageHeight="h-64 md:h-80 lg:h-96"
              />
              <CarouselNavigation
                onPrev={prevWork}
                onNext={nextWork}
                currentIndex={currentWorkIndex}
                totalItems={works.length}
              />
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map(work => (
            <ContentCard
              key={work.id}
              imageUrl={work.imageUrl}
              title={work.title}
              onClick={() => handleWorkClick(work)}
            />
          ))}
        </div>
      )}
    </SectionWrapper>
  );
};

export default Works;
