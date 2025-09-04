import React, { useState } from 'react';
import type { WorksProps } from '../../types';

const Works: React.FC<WorksProps> = ({ works, handleWorkClick }) => {
  const [isCarouselView, setIsCarouselView] = useState(true);
  const [currentWorkIndex, setCurrentWorkIndex] = useState(0);

  // works.length が 0 の場合にエラーになるのを防ぐ
  const safeWorksLength = works.length || 1;
  const nextWork = () => setCurrentWorkIndex((prev) => (prev + 1) % safeWorksLength);
  const prevWork = () => setCurrentWorkIndex((prev) => (prev - 1 + safeWorksLength) % safeWorksLength);

  return (
    <section id="works" className="py-20 md:py-32 min-h-screen flex items-center">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <h2 className="text-4xl md:text-5xl font-bold">Works</h2>
          <button onClick={() => setIsCarouselView(!isCarouselView)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-300 transition-colors">
            {isCarouselView ? '一覧表示' : 'カルーセル'}
          </button>
        </div>
        {isCarouselView ? (
          <div className="relative">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentWorkIndex * 100}%)` }}>
                {works.map((work) => (
                  <div key={work.id} className="w-full flex-shrink-0 relative cursor-pointer group" onClick={() => handleWorkClick(work)}>
                    <img src={work.imageUrl} alt={work.title} className="w-full h-auto aspect-video object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                      <h3 className="text-xl font-bold">{work.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={prevWork} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow-md hover:bg-white/75 transition-colors text-2xl leading-none">‹</button>
            <button onClick={nextWork} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow-md hover:bg-white/75 transition-colors text-2xl leading-none">›</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {works.map((work) => (
              <div key={work.id} className="bg-[#e8dbc6] rounded-lg shadow-md overflow-hidden cursor-pointer group" onClick={() => handleWorkClick(work)}>
                <div className="overflow-hidden aspect-video">
                  <img src={work.imageUrl} alt={work.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="p-4"><h3 className="text-lg font-bold">{work.title}</h3></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Works;
