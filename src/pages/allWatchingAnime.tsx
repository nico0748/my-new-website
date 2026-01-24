import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CalendarDays, ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import ContentCard from '../components/ui/ContentCard';
import PageTransition from '../components/ui/PageTransition';
import AnimeDetailModal from '../components/ui/AnimeDetailModal';
import { fetchSheetData } from '../lib/googleSheets';
import { mapAnimeData } from '../lib/dataMapper';
import type { AnimeItem } from '../lib/dataMapper';
import type { SheetRow } from '../lib/googleSheets';

const AllWatchingAnime: React.FC = () => {
  const [sortedAnime, setSortedAnime] = useState<AnimeItem[]>([]);
  const [originalAnime, setOriginalAnime] = useState<AnimeItem[]>([]);
  const [sortType, setSortType] = useState('release-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnime, setSelectedAnime] = useState<AnimeItem | null>(null);

  useEffect(() => {
    const loadData = async () => {
        const rows = await fetchSheetData<SheetRow>("all-watching-anime");
        const data = mapAnimeData(rows);
        setOriginalAnime(data);
        setSortedAnime(data);
    };
    loadData();
  }, []);

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
      default: seasonValue = 0; break;
    }
    return year + seasonValue / 10;
  };

  useEffect(() => {
    const filteredData = originalAnime.filter(anime =>
      anime.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const sortedData = [...filteredData];

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
  }, [sortType, searchQuery, originalAnime]);

  const getButtonClass = (type: string) => {
    return `p-3 rounded-full transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 shadow-sm ${
      sortType === type
        ? 'bg-blue-600 text-white shadow-md'
        : 'bg-white/80 text-gray-600 hover:bg-white hover:text-blue-600'
    }`;
  };

  return (
    <>
      <PageTransition>
        <div className="container mx-auto p-4 md:p-8 bg-[#f1e6d1] min-h-screen">
          <h1 className="text-5xl md:text-7xl font-bold text-center mb-12 text-[#4a3b32] drop-shadow-sm font-rounded tracking-wide">
            視聴中アニメ一覧
          </h1>
          
          <div className="mb-8 max-w-lg mx-auto">
            <input
              type="text"
              placeholder="アニメのタイトルを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-3 rounded-full border border-gray-300 bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition shadow-sm placeholder-gray-500"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setSortType('release-desc')}
              className={getButtonClass('release-desc')}
              title="リリース時期順"
            >
              <CalendarDays className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSortType('title-asc')}
              className={getButtonClass('title-asc')}
              title="タイトル (昇順)"
            >
              <ArrowDownAZ className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSortType('title-desc')}
              className={getButtonClass('title-desc')}
              title="タイトル (降順)"
            >
              <ArrowUpAZ className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedAnime.map((anime) => (
              <div key={anime.id} onClick={() => setSelectedAnime(anime)}>
                <ContentCard
                  imageUrl={anime.official_site_twitter_image_url || 'https://placehold.co/600x400/e8dbc6/333?text=No+Image'}
                  title={anime.title}
                  description={anime.release_season}
                  layoutId={`anime-card-${anime.id}`}
                />
              </div>
            ))}
          </div>
        </div>
      </PageTransition>

      <AnimatePresence>
        {selectedAnime && (
          <AnimeDetailModal 
            anime={selectedAnime} 
            onClose={() => setSelectedAnime(null)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default AllWatchingAnime;
