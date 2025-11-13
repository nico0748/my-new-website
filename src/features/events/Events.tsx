import React, { useState } from 'react';
import type { EventsProps } from '../../types';
import SectionWrapper from '../../components/ui/SectionWrapper';
import ViewToggleButton from '../../components/ui/ViewToggleButton';
import CarouselNavigation from '../../components/ui/CarouselNavigation';
import ContentCard from '../../components/ui/ContentCard';

const Events: React.FC<EventsProps> = ({ events, handleEventClick }) => {
  const [isCarouselView, setIsCarouselView] = useState(true);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const safeEventsLength = events.length || 1;
  const nextEvent = () => setCurrentEventIndex((prev) => (prev + 1) % safeEventsLength);
  const prevEvent = () => setCurrentEventIndex((prev) => (prev - 1 + safeEventsLength) % safeEventsLength);

  return (
    <SectionWrapper id="events" title="Events">
      <div className="w-full max-w-full overflow-x-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 md:mb-12 gap-4 px-2">
          <div className="sm:ml-auto">
            <ViewToggleButton 
              isCarouselView={isCarouselView} 
              onToggle={() => setIsCarouselView(!isCarouselView)} 
            />
          </div>
        </div>

        {isCarouselView ? (
          <div className="relative w-full max-w-full overflow-x-hidden">
            {events.length > 0 && (
              <>
                <div className="w-full max-w-4xl mx-auto px-2">
                  <ContentCard
                    imageUrl={events[currentEventIndex].imageUrl}
                    title={events[currentEventIndex].text}
                    onClick={() => handleEventClick(events[currentEventIndex])}
                    className="w-full max-w-full"
                    imageHeight="h-48 sm:h-64 md:h-80 lg:h-96"
                  />
                </div>
                <div className = "max-w-4xl mx-auto ">
                  <CarouselNavigation
                    onPrev={prevEvent}
                    onNext={nextEvent}
                    currentIndex={currentEventIndex}
                    totalItems={events.length}
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full max-w-full overflow-x-hidden px-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {events.map(event => (
                <ContentCard
                  key={event.id}
                  imageUrl={event.imageUrl}
                  title={event.text}
                  onClick={() => handleEventClick(event)}
                  className="w-full max-w-full"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionWrapper>
  );
};

export default Events;