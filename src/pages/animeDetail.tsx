import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import animeData from '../data/recordsData/animeData/all_watched_anime.json';

const AnimeDetail: React.FC = () => {
  // URLから :animeId パラメータを取得
  const { animeId } = useParams<{ animeId: string }>();

  // URLのIDと一致するアニメデータを検索
  // useParamsから取得するIDは文字列なので、数値に変換して比較
  const anime = animeData.find(a => a.id === Number(animeId));

  // アニメデータが見つからない場合の表示
  if (!anime) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold">アニメが見つかりません</h1>
        <RouterLink to="/watched-anime" className="text-blue-500 hover:underline mt-4 inline-block">
          一覧に戻る
        </RouterLink>
      </div>
    );
  }

  // アニメデータが見つかった場合の表示
  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={anime.official_site_twitter_image_url || 'https://via.placeholder.com/800x400'}
          alt={anime.title}
          className="w-full h-64 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{anime.title}</h1>
          
          <div className="space-y-3">
            <p><strong>リリース時期:</strong> {anime.release_season}</p>
            <p><strong>公式サイト:</strong> 
              <a 
                href={anime.official_site_url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline ml-2"
              >
                {anime.official_site_url}
              </a>
            </p>
            <p><strong>作品ID:</strong> {anime.id}</p>
            {/* twitter_avatar_urlなど、他の情報も同様に追加できます */}
          </div>

          <div className="mt-8">
            <RouterLink to="/watched-anime" className="text-blue-500 hover:underline">
              &larr; 一覧に戻る
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimeDetail;