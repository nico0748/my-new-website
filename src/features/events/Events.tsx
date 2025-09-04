import React, { useState } from 'react';
import type { EventsProps } from '../../types';

const Events: React.FC<EventsProps> = ({ events }) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // events配列が空の場合に`% 0`のエラーが発生するのを防ぎます
  const safeEventsLength = events.length || 1;
  const nextEvent = () => setCurrentEventIndex((prev) => (prev + 1) % safeEventsLength);
  const prevEvent = () => setCurrentEventIndex((prev) => (prev - 1 + safeEventsLength) % safeEventsLength);

  return (
    <section id="events" className="py-20 md:py-32 min-h-screen flex items-center">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Events</h2>
        <div className="relative">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentEventIndex * 100}%)` }}>
              {events.map((event) => (
                <div key={event.id} className="w-full flex-shrink-0 relative">
                  <img src={event.imageUrl} alt={`Event ${event.id}`} className="w-full h-auto aspect-video object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                    <p className="font-bold text-lg">{event.date}</p>
                    <p>{event.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={prevEvent} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow-md hover:bg-white/75 transition-colors text-2xl leading-none">‹</button>
          <button onClick={nextEvent} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow-md hover:bg-white/75 transition-colors text-2xl leading-none">›</button>
        </div>
      </div>
    </section>
  );
};

export default Events;
