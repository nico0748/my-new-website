import React, { useState } from 'react';
import type { EventsProps } from '../../types';
import SectionWrapper from '../../components/ui/SectionWrapper';
import CarouselNavigation from '../../components/ui/CarouselNavigation';
import ContentCard from '../../components/ui/ContentCard';

const Events: React.FC<EventsProps> = ({ events }) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const safeEventsLength = events.length || 1;
  const nextEvent = () => setCurrentEventIndex((prev) => (prev + 1) % safeEventsLength);
  const prevEvent = () => setCurrentEventIndex((prev) => (prev - 1 + safeEventsLength) % safeEventsLength);

  return (
    <SectionWrapper id="events" title="Events">
      <div className="relative">
        {events.length > 0 && (
          <>
            <ContentCard
              imageUrl={events[currentEventIndex].imageUrl}
              title={events[currentEventIndex].text}
              date={events[currentEventIndex].date}
              className="mx-auto max-w-2xl"
              imageHeight="h-64 md:h-80 lg:h-96"
            />
            <CarouselNavigation
              onPrev={prevEvent}
              onNext={nextEvent}
              currentIndex={currentEventIndex}
              totalItems={events.length}
            />
          </>
        )}
      </div>
    </SectionWrapper>
  );
};

export default Events;
