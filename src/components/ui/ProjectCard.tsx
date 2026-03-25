import React from 'react';
import type { PortfolioItem } from '../../lib/dataMapper';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Props {
  item: PortfolioItem;
}

const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const ProjectCard: React.FC<Props> = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/projects/${item.id}`);
  };

  return (
    <motion.div
      className="rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid rgba(99, 152, 219, 0.2)',
        boxShadow: '0 4px 20px rgba(37, 99, 235, 0.07)',
      }}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{
        y: -6,
        boxShadow: '0 20px 40px rgba(37, 99, 235, 0.15)',
        borderColor: 'rgba(37, 99, 235, 0.4)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={handleClick}
    >
      {/* サムネイル */}
      <div className="relative overflow-hidden h-48">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4"
          style={{ background: 'linear-gradient(to top, rgba(37,99,235,0.5) 0%, transparent 100%)' }}
        >
          <span className="text-white text-sm font-semibold">詳細を見る →</span>
        </div>
      </div>

      {/* コンテンツ */}
      <div className="p-5">
        {/* タグ */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.tags.map((tag: string) => (
            <span
              key={tag}
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
              style={{
                background: 'rgba(37, 99, 235, 0.08)',
                color: '#2563eb',
                border: '1px solid rgba(37, 99, 235, 0.15)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* タイトル */}
        <h3
          className="text-lg font-bold mb-2 tracking-tight transition-colors duration-200 group-hover:text-blue-600"
          style={{ color: '#1e293b' }}
        >
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed line-clamp-2" style={{ color: '#64748b' }}>
          {item.description}
        </p>

        {/* リンク */}
        <div className="mt-4 flex items-center gap-4">
          {item.liveUrl && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold hover:underline transition-colors duration-200"
              style={{ color: '#2563eb' }}
              onClick={(e) => e.stopPropagation()}
            >
              サイトを見る ↗
            </a>
          )}
          {item.repoUrl && (
            <a
              href={item.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:underline transition-colors duration-200"
              style={{ color: '#94a3b8' }}
              onClick={(e) => e.stopPropagation()}
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
