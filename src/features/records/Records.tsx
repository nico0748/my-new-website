import React from 'react';
import type { RecordsProps } from '../../types';
import GridSection from '../../components/ui/GridSection';

const Records: React.FC<RecordsProps> = ({ records, handleRecordsClick }) => {
    return <GridSection id="records" title="Records" items={records} onItemClick={handleRecordsClick} />;
};

export default Records;
