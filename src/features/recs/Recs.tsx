import React from 'react';
import type { RecsProps } from '../../types';
import GridSection from '../../components/ui/GridSection';

const Recs: React.FC<RecsProps> = ({ recs, handleRecsClick }) => {
    return <GridSection id="recs" title="Recs" items={recs} onItemClick={handleRecsClick} />;
};

export default Recs;
