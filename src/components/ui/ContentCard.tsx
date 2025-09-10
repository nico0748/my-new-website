import React from 'react';

interface ContentCardProps {
  imageUrl: string;
  title?: string;
  description?: string;
  date?: string;
  onClick?: () => void;
  className?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  imageUrl, 
  title, 
  description, 
  date, 
  onClick, 
  className = "" 
}) => {
  const cardClasses = `bg-[#e8dbc6] rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 ${
    onClick ? 'cursor-pointer' : ''
  } ${className}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      <img 
        src={imageUrl} 
        alt={title || 'Content'} 
        className="w-full h-48 object-cover" 
      />
      {(title || description || date) && (
        <div className="p-4">
          {title && (
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
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