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
      className="bg-[#e8dbc6] rounded-2xl shadow-lg overflow-hidden"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }} // ついでにホバーアニメーションも追加
    >      
      <img src={item.thumbnail} alt={item.title} className="w-full h-56 object-cover " />
      <div className="p-6 bg-[#e8dbc6]">
        <div className="flex flex-wrap gap-2 mb-4">
          {item.tags.map(tag => (
            <span key={tag} className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-bold mb-2">{item.title}</h3>
        <p className="text-gray-700 text-base">{item.description}</p>
        
        {/* リンクがあれば表示 */}
        <div className="mt-6 flex items-center gap-4">
          {item.liveUrl && (
            <a href={item.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              サイトを見る
            </a>
          )}
          {item.repoUrl && (
            <a href={item.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:underline">
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;