import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ContentCard from '../components/ui/ContentCard';
import animeData from '../data/recordsData/animeData/all_watched_anime.json';

// アニメデータの型を定義します
interface Anime {
  id: number;
  title: string;
  official_site_url: string;
  release_season: string;
  twitter_avatar_url: string | null;
  official_site_twitter_image_url: string | null;
}

const AllWatchedAnime: React.FC = () => {
  // 並び替えられたアニメのリストを保持するState
  const [sortedAnime, setSortedAnime] = useState<Anime[]>([]);
  // 現在の並び替え種別を保持するState (デフォルトはリリース時期順)
  const [sortType, setSortType] = useState('release-desc');

  // "2017年春"のような文字列をソート可能な数値に変換するヘルパー関数
  const getSeasonValue = (season: string): number => {
    // seasonがnullやundefined、または文字列でない場合にエラーを防ぐためのチェックを追加
    if (!season || typeof season !== 'string') {
      return 0; // 不正なデータは最古として扱う
    }
    
    const year = parseInt(season.substring(0, 4), 10);
    const seasonName = season.substring(5);
    let seasonValue = 0;
    switch (seasonName) {
      case '春': seasonValue = 1; break;
      case '夏': seasonValue = 2; break;
      case '秋': seasonValue = 3; break;
      case '冬': seasonValue = 4; break;
      default: seasonValue = 0;
    }
    // 年と季節を組み合わせて、2017.1 (2017年春) のような数値を作成します
    return year + seasonValue / 10;
  };

  // sortTypeが変更されたときに並び替え処理を実行します
  useEffect(() => {
    const sortedData = [...animeData] as Anime[]; // 元データをコピーして使用

    switch (sortType) {
      case 'title-asc':
        // タイトル昇順 (ロケールを'ja'に指定して日本語順にソート)
        sortedData.sort((a, b) => a.title.localeCompare(b.title, 'ja'));
        break;
      case 'title-desc':
        // タイトル降順
        sortedData.sort((a, b) => b.title.localeCompare(a.title, 'ja'));
        break;
      case 'release-desc':
      default:
        // リリース時期の降順 (新しい順)
        sortedData.sort((a, b) => getSeasonValue(b.release_season) - getSeasonValue(a.release_season));
        break;
    }
    setSortedAnime(sortedData);
  }, [sortType]);

  // 並び替えボタンのスタイルを動的に変更するための関数
  const getButtonClass = (type: string) => {
    return `px-4 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 ${
      sortType === type
        ? 'bg-[#007acc] text-white'
        : 'bg-white text-gray-700 hover:bg-gray-100'
    }`;
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-[#f1e6d1] min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#333]">視聴済みアニメ一覧</h1>

      {/* 並び替えボタン */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        <button
          onClick={() => setSortType('release-desc')}
          className={getButtonClass('release-desc')}
        >
          リリース時期順
        </button>
        <button
          onClick={() => setSortType('title-asc')}
          className={getButtonClass('title-asc')}
        >
          タイトル (昇順)
        </button>
        <button
          onClick={() => setSortType('title-desc')}
          className={getButtonClass('title-desc')}
        >
          タイトル (降順)
        </button>
      </div>
      
      {/* アニメカードのグリッド表示 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedAnime.map((anime) => (
          <Link to={`/anime/${anime.id}`} key={anime.id}>
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

export default AllWatchedAnime;

