import React from 'react';

interface ViewToggleButtonProps {
  isCarouselView: boolean;
  onToggle: () => void;
  carouselLabel?: string;
  gridLabel?: string;
}

const ViewToggleButton: React.FC<ViewToggleButtonProps> = ({ 
  isCarouselView, 
  onToggle, 
  carouselLabel = "カルーセル表示", 
  gridLabel = "グリッド表示" 
}) => {
  return (
    <button
      onClick={onToggle}
      className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      {isCarouselView ? gridLabel : carouselLabel}
    </button>
  );
};

export default ViewToggleButton;