import React from 'react';
import { useParams, Link as RouterLink, useSearchParams } from 'react-router-dom';
// 視聴済みと視聴予定の両方のデータをインポートします
import watchedAnimeData from '../data/recordsData/animeData/all_watched_anime.json';
import wannaWatchAnimeData from '../data/recordsData/animeData/all_wanna_watch_anime.json';

const AnimeDetail: React.FC = () => {
  // URLから :animeId パラメータを取得
  const { animeId } = useParams<{ animeId: string }>();
  // URLのクエリパラメータを取得するためのフック
  const [searchParams] = useSearchParams();
  // クエリパラメータ 'from' の値を取得。なければデフォルトで'/watched-anime'を設定
  const fromPath = searchParams.get('from') || '/watched-anime';

  // 両方のリストを結合して、全アニメデータから目的のアニメを探します
  const allAnimeData = [...watchedAnimeData, ...wannaWatchAnimeData];
  // 念のため、IDの重複を削除します
  const uniqueAnimeData = Array.from(new Map(allAnimeData.map(item => [item.id, item])).values());

  const anime = uniqueAnimeData.find(a => a.id === Number(animeId));

  // アニメデータが見つからない場合の表示
  if (!anime) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold">アニメが見つかりません</h1>
        {/* 動的なパスを使って「一覧に戻る」リンクを生成 */}
        <RouterLink to={fromPath} className="text-blue-500 hover:underline mt-4 inline-block">
          一覧に戻る
        </RouterLink>
      </div>
    );
  }

  // アニメデータが見つかった場合の表示
  return (
    <div className="container mx-auto p-8 bg-[#f1e6d1]">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <img
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
      </div>
    </div>
  );
};

export default AnimeDetail;