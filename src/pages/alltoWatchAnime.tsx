import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContentCard from '../components/ui/ContentCard';
// 視聴予定のデータをインポート
import wannaWatchAnimeData from '../data/recordsData/animeData/all_wanna_watch_anime.json';

interface Anime {
  id: number;
  title: string;
  official_site_url: string;
  release_season: string;
  twitter_avatar_url: string | null;
  official_site_twitter_image_url: string | null;
}

const AllWannaWatchAnime: React.FC = () => {
  const [sortedAnime, setSortedAnime] = useState<Anime[]>([]);
  const [sortType, setSortType] = useState('release-desc');
  const [searchQuery, setSearchQuery] = useState('');

  const getSeasonValue = (season: string): number => {
    if (!season || typeof season !== 'string') return 0;
    const year = parseInt(season.substring(0, 4), 10);
    const seasonName = season.substring(5);
    let seasonValue = 0;
    switch (seasonName) {
      case '冬': seasonValue = 1; break;
      case '春': seasonValue = 2; break;
      case '夏': seasonValue = 3; break;
      case '秋': seasonValue = 4; break;
    }
    return year + seasonValue / 10;
  };

  useEffect(() => {
    const filteredData = wannaWatchAnimeData.filter(anime =>
      anime.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const sortedData = [...filteredData] as Anime[];

    switch (sortType) {
      case 'title-asc':
        sortedData.sort((a, b) => a.title.localeCompare(b.title, 'ja'));
        break;
      case 'title-desc':
        sortedData.sort((a, b) => b.title.localeCompare(a.title, 'ja'));
        break;
      case 'release-desc':
      default:
        sortedData.sort((a, b) => getSeasonValue(b.release_season) - getSeasonValue(a.release_season));
        break;
    }
    setSortedAnime(sortedData);
  }, [sortType, searchQuery]);

  const getButtonClass = (type: string) => {
    return `px-4 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${
      sortType === type ? 'bg-[#007acc] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
    }`;
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-[#f1e6d1] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-[#333]">視聴予定アニメ一覧</h1>
      <div className="mb-8 max-w-lg mx-auto">
        <input
          type="text"
          placeholder="アニメのタイトルを検索..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm"
        />
      </div>
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button onClick={() => setSortType('release-desc')} className={getButtonClass('release-desc')}>リリース時期順</button>
        <button onClick={() => setSortType('title-asc')} className={getButtonClass('title-asc')}>タイトル (昇順)</button>
        <button onClick={() => setSortType('title-desc')} className={getButtonClass('title-desc')}>タイトル (降順)</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedAnime.map((anime) => (
          // ★ 変更点: Linkに `?from=/to-watch-anime` を追加
          <Link to={`/anime/${anime.id}?from=/to-watch-anime`} key={anime.id}>
            <ContentCard
              imageUrl={anime.official_site_twitter_image_url || 'https://placehold.co/600x400/e8dbc6/333?text=No+Image'}
              title={anime.title}
              description={anime.release_season}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllWannaWatchAnime;