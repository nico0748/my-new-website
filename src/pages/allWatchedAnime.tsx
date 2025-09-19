import React from 'react';
import { Link } from 'react-router-dom';
import ContentCard from '../components/ui/ContentCard'; // ContentCardのパスを適切に設定してください
import animeData from '../data/recordsData/animeData/all_watched_anime.json'; // JSONデータのパスを適切に設定してください


const AllWatchedAnime: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">視聴済みアニメ一覧</h1>
      
      {/* アニメデータをグリッドレイアウトで表示 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {animeData.map((anime) => (
          // Linkコンポーネントでカード全体をラップし、クリックで詳細ページに飛ぶようにする
          <Link to={`/anime/${anime.id}`} key={anime.id}>
            <ContentCard
              imageUrl={anime.official_site_twitter_image_url || 'https://via.placeholder.com/300x160'} // 画像がない場合の代替画像
              title={anime.title}
              description={anime.release_season}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllWatchedAnime;