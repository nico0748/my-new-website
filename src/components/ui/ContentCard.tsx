import React from 'react';

interface ContentCardProps {
  imageUrl: string;
  title?: string;
  description?: string;
  date?: string;
  onClick?: () => void;
  className?: string;
  imageHeight?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  imageUrl, 
  title, 
  description, 
  date, 
  onClick, 
  className = "",
  imageHeight = "h-40" // 160px height by default 
}) => {
  const cardClasses = `bg-[#e8dbc6] rounded-lg shadow-md overflow-hidden ${
    onClick ? 'cursor-pointer' : ''
  } ${className}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      <div className="overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title || 'Content'} 
          className={`w-full ${imageHeight} object-cover transition-transform duration-300 hover:scale-110`}
        />
      </div>
      {(title || description || date) && (
        <div className="p-4">
          {title && (
            // 下の行のclassNameに "truncate" を追加しました
            <h3 className="text-lg font-semibold mb-2 truncate">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-gray-600 mb-2">{description}</p>
          )}
          {date && (
            <p className="text-xs text-gray-500">{date}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ContentCard;