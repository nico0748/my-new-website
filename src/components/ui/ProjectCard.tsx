import React from 'react';
import type { PortfolioItem } from '../../data/portfolioData/portfolioData'; // Step1で作成した型をインポート

import { motion } from 'framer-motion'; // ★ 1. motionをインポート

// コンポーネントが受け取るpropsの型を定義
interface Props {
  item: PortfolioItem;
}

// アニメーションの定義
const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.8
    }
  },
};
const ProjectCard: React.FC<Props> = ({ item }) => {
  return (
    // rounded-lg[-sm, -md, -lg, -xl, -2xl, -3xl]: 角を丸くする, shadow-lg: 大きな影をつける, overflow-hidden: はみ出た部分を隠す
    // whileHover: ホバー時のアニメーション設定
    // scale: 拡大率, transition: アニメーションの詳細設定
    <motion.div 
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl shadow-xl overflow-hidden p-0 m-3 group hover:border-[#d4af37]/50 transition-colors duration-300"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }} // ついでにホバーアニメーションも追加
    >      
      <div className="relative overflow-hidden h-56">
        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
      </div>
      <div className="p-6 relative">
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.map(tag => (
            <span key={tag} className="bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/30 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-[#d4af37] transition-colors">{item.title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
        
        {/* リンクがあれば表示 */}
        <div className="mt-6 flex items-center gap-4">
          {item.liveUrl && (
            <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline text-sm font-medium">
              サイトを見る
            </a>
          )}
          {item.repoUrl && (
            <a href={item.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200 hover:underline text-sm font-medium">
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;