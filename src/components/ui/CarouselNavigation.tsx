import React from 'react';

interface CarouselNavigationProps {
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  totalItems: number;
  prevLabel?: string;
  nextLabel?: string;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({ 
  onPrev, 
  onNext, 
  currentIndex, 
  totalItems, 
  prevLabel = "←", 
  nextLabel = "→" 
}) => {
  return (
    <div className="flex justify-between items-center mt-6">
      <button
        onClick={onPrev}
        className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        {prevLabel}
      </button>
      <span className="text-gray-600">
        {currentIndex + 1} / {totalItems}
      </span>
      <button
        onClick={onNext}
        className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        {nextLabel}
      </button>
    </div>
  );
};

export default CarouselNavigation;