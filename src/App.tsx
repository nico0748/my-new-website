import { Routes, Route } from 'react-router-dom';

// --- Page Components ---
import AllWatchedAnime from './pages/allWatchedAnime';
import AllToWatchAnime from './pages/alltoWatchAnime';
//import AllWatchingAnime from './pages/allWatchingAnime';
import AnimeDetail from './pages/animeDetail';
import PortfolioPage from './pages/portfolioPage.tsx';
import HobbyPage from './pages/hobbyPages.tsx';

//ビルドした本番実行環境だと直接リンク指定で遷移できないので原因究明を急ぐ必要がある

// =================================================================
// Appコンポーネント (ルーティング管理)
// =================================================================
export default function App() {
  return (
    <Routes>
      {/* ルートURL ("/") の場合は、ポートフォリオページを表示 */}
      <Route path="/" element={<PortfolioPage />} />
      
      {/* "/hobbys" の場合は、趣味ページ(元のホームページ)を表示 */}
      <Route path="/hobbys" element={<HobbyPage />} />
      
      {/* "/watched-anime" の場合は、視聴済みアニメ一覧ページを表示 */}
      <Route path="/watched-anime" element={<AllWatchedAnime />} />

      {/* "/to-watch-anime" の場合は、視聴予定アニメ一覧ページを表示 */}
      <Route path="/to-watch-anime" element={<AllToWatchAnime />} />

      {/* "/anime/:animeId" の場合は、アニメ詳細ページを表示 */}
      <Route path="/anime/:animeId" element={<AnimeDetail />} />
    </Routes>
  );
}
