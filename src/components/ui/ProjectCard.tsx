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
      className="bg-[#1F2833] border border-gray-800 rounded-xl shadow-md overflow-hidden p-0 m-3 group hover:shadow-lg hover:border-blue-900/50 transition-all duration-300"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }} // ついでにホバーアニメーションも追加
    >      
      <div className="relative overflow-hidden h-56">
        <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-6 relative">
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.map(tag => (
            <span key={tag} className="bg-blue-900/30 text-blue-300 border border-blue-900/50 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-blue-400 transition-colors">{item.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
        
        {/* リンクがあれば表示 */}
        <div className="mt-6 flex items-center gap-4">
          {item.liveUrl && (
            <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline text-sm font-medium">
              サイトを見る
            </a>
          )}
          {item.repoUrl && (
            <a href={item.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-300 hover:underline text-sm font-medium">
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;