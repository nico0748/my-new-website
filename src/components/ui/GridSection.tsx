import React from 'react';
import type { GridSectionProps } from '../../types';
import SectionWrapper from './SectionWrapper';
import ContentCard from './ContentCard';

const GridSection: React.FC<GridSectionProps> = ({ id, title, items, onItemClick }) => {
  return (
    <SectionWrapper id={id} title={title}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(item => (
          <ContentCard
            key={item.id}
            imageUrl={item.imageUrl}
            title={item.name}
            description={item.desc}
            onClick={() => onItemClick(item.id)}
          />
        ))}
      </div>
    </SectionWrapper>
  );
};

export default GridSection;
