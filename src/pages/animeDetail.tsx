import React from 'react';
import { useParams, Link as RouterLink, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/ui/PageTransition';
// 視聴済みと視聴予定の両方のデータをインポートします - Deleted
// import watchedAnimeData from '../data/recordsData/animeData/all_watched_anime.json';
// import wannaWatchAnimeData from '../data/recordsData/animeData/all_wanna_watch_anime.json';
import { useState, useEffect } from 'react';
import { fetchSheetData } from '../lib/googleSheets';
import { mapAnimeData } from '../lib/dataMapper';
import type { AnimeItem } from '../lib/dataMapper';
import type { SheetRow } from '../lib/googleSheets';

const AnimeDetail: React.FC = () => {
  // URLから :animeId パラメータを取得
  const { animeId } = useParams<{ animeId: string }>();
  // URLのクエリパラメータを取得するためのフック
  const [searchParams] = useSearchParams();
  // クエリパラメータ 'from' の値を取得。なければデフォルトで'/watched-anime'を設定
  const fromPath = searchParams.get('from') || '/watched-anime';

  const [anime, setAnime] = useState<AnimeItem | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        setIsLoading(true);
        try {
            const [watched, toWatch, watching] = await Promise.all([
                fetchSheetData<SheetRow>("all-watched-anime"),
                fetchSheetData<SheetRow>("all-wanna-watch-anime"),
                fetchSheetData<SheetRow>("all-watching-anime")
            ]);

            const allData = [
                ...mapAnimeData(watched),
                ...mapAnimeData(toWatch),
                ...mapAnimeData(watching)
            ];

            // ID must be string comparison now as Sheet returns strings
            // Try explicit matching, assuming IDs are unique across lists or prioritized
            const found = allData.find(a => String(a.id) === String(animeId));
            setAnime(found);

        } catch (err) {
            console.error("Failed to fetch anime details", err);
        } finally {
            setIsLoading(false);
        }
    };
    loadData();
  }, [animeId]);

  if (isLoading) {
      return (
        <PageTransition>
          <div className="p-8 text-center text-gray-500">Loading...</div>
        </PageTransition>
      );
  }

  // アニメデータが見つからない場合の表示
  if (!anime) {
    return (
      <PageTransition>
        <div className="container mx-auto p-4 text-center">
          <h1 className="text-2xl font-bold">アニメが見つかりません</h1>
          {/* 動的なパスを使って「一覧に戻る」リンクを生成 */}
          <RouterLink to={fromPath} className="text-blue-500 hover:underline mt-4 inline-block">
            一覧に戻る
          </RouterLink>
        </div>
      </PageTransition>
    );
  }

  // アニメデータが見つかった場合の表示
  return (
    <PageTransition>
      <div className="container mx-auto p-8 bg-[#f1e6d1]">
        <motion.div 
          className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden"
          layoutId={`anime-card-${anime.id}`}
        >
          <motion.img
            src={anime.official_site_twitter_image_url || 'https://placehold.co/800x400/e8dbc6/333?text=No+Image'}
            alt={anime.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{anime.title}</h1>
            
            <div className="space-y-3">
              <p><strong>リリース時期:</strong> {anime.release_season || '情報なし'}</p>
              {anime.official_site_url && (
                <p><strong>公式サイト:</strong> 
                  <a 
                    href={anime.official_site_url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-500 hover:underline ml-2 break-all"
                  >
                    {anime.official_site_url}
                  </a>
                </p>
              )}
              <p><strong>作品ID:</strong> {anime.id}</p>
            </div>

            <div className="mt-8">
              {/* 動的なパスを使って「一覧に戻る」リンクを生成 */}
              <RouterLink to={fromPath} className="text-blue-500 hover:underline">
                &larr; 一覧に戻る
              </RouterLink>
            </div>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default AnimeDetail;