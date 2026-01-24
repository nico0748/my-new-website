import React from 'react';
import { motion } from 'framer-motion';
import type { AnimeItem } from '../../lib/dataMapper';

interface AnimeDetailModalProps {
  anime: AnimeItem;
  onClose: () => void;
}

const AnimeDetailModal: React.FC<AnimeDetailModalProps> = ({ anime, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Card Content */}
      <motion.div
        className="relative bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl z-10"
        layoutId={`anime-card-${anime.id}`}
      >
        <div className="relative">
          <motion.img
            src={anime.official_site_twitter_image_url || 'https://placehold.co/800x400/e8dbc6/333?text=No+Image'}
            alt={anime.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 md:p-8">
          <motion.h1 className="text-3xl font-bold mb-6 text-gray-800" layoutId={`anime-title-${anime.id}`}>
            {anime.title}
          </motion.h1>

          <div className="space-y-4">
            <p className="text-lg">
              <span className="font-semibold text-gray-700">リリース時期: </span>
              {anime.release_season || '情報なし'}
            </p>
            
            {anime.official_site_url && (
              <p className="text-lg">
                <span className="font-semibold text-gray-700">公式サイト: </span>
                <a
                  href={anime.official_site_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline break-all"
                >
                  {anime.official_site_url}
                </a>
              </p>
            )}
            
            <p className="text-sm text-gray-400">作品ID: {anime.id}</p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={onClose}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
            >
              ← 一覧に戻る
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimeDetailModal;
