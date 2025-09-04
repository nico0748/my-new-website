import React from 'react';
import type { GridSectionProps } from '../../types';

const GridSection: React.FC<GridSectionProps> = ({ id, title, items, onItemClick }) => {
    return (
        <section id={id} className="py-20 md:py-32 min-h-screen flex items-center">
            <div className="max-w-4xl mx-auto w-full">
                <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">{title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                    {items.map((item) => (
                        <div key={item.id} className="relative rounded-lg shadow-md overflow-hidden cursor-pointer group h-64" onClick={() => onItemClick(item.id)}>
                            <img src={item.imageUrl} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="relative z-10 p-4 flex flex-col items-center justify-center text-center text-white bg-black/60 h-full transition-colors group-hover:bg-black/70">
                                <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                                <p className="text-base">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GridSection;
