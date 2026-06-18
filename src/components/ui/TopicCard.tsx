import React from 'react';
import type { TopicItem } from '../../lib/dataMapper';
import { getTopicCategoryStyle } from '../../lib/topicCategories';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CornerMarks from './CornerMarks';

interface Props {
  item: TopicItem;
}

const cardVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

const TopicCard: React.FC<Props> = ({ item }) => {
  const navigate = useNavigate();
  const cat = getTopicCategoryStyle(item.category);

  const handleClick = () => {
    navigate(`/topics/${item.id}`);
  };

  return (
    <motion.div
      className="relative rounded-2xl cursor-pointer group overflow-hidden flex flex-col"
      style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        border: '1px solid var(--card-border)',
        boxShadow: `0 4px 20px var(--card-shadow)`,
      }}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{
        y: -6,
        boxShadow: '0 20px 40px var(--hover-card-shadow)',
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={handleClick}
    >
      <CornerMarks />

      {/* カテゴリ色のヘッダ帯 */}
      <div
        className="h-1.5 w-full"
        style={{ background: cat.color, boxShadow: `0 0 12px ${cat.color}` }}
      />

      {/* コンテンツ */}
      <div className="p-5 flex flex-col flex-1">
        {/* カテゴリバッジ + 日付 */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded"
            style={{
              background: `${cat.color}1a`,
              color: cat.color,
              border: `1px solid ${cat.color}55`,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            <span aria-hidden>{cat.emoji}</span>
            {cat.label}
          </span>
          {item.date && (
            <span
              className="text-xs"
              style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}
            >
              {item.date}
            </span>
          )}
        </div>

        {/* タイトル */}
        <h3
          className="text-lg font-bold mb-2 tracking-tight transition-colors duration-200"
          style={{ color: 'var(--text-primary)' }}
        >
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed line-clamp-3 flex-1" style={{ color: 'var(--text-secondary)' }}>
          {item.description}
        </p>

        {/* タグ */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  background: 'var(--tag-bg)',
                  color: 'var(--tag-color)',
                  border: '1px solid var(--tag-border)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TopicCard;
