import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- Page Components ---
import AllWatchedAnime from './pages/allWatchedAnime';
import AllToWatchAnime from './pages/alltoWatchAnime';
import AllWatchingAnime from './pages/allWatchingAnime';
import PortfolioPage from './pages/portfolioPage.tsx';
import HobbyPage from './pages/hobbyPages.tsx';

//ビルドした本番実行環境だと直接リンク指定で遷移できないので原因究明を急ぐ必要がある

// =================================================================
// Appコンポーネント (ルーティング管理)
// =================================================================
export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        {/* ルートURL ("/") の場合は、ポートフォリオページを表示 */}
        <Route path="/" element={<PortfolioPage />} />
        
        {/* "/hobbys" の場合は、趣味ページ(元のホームページ)を表示 */}
        <Route path="/hobbys" element={<HobbyPage />} />
        
        {/* "/watched-anime" の場合は、視聴済みアニメ一覧ページを表示 */}
        <Route path="/watched-anime" element={<AllWatchedAnime />} />

        {/* "/to-watch-anime" の場合は、視聴予定アニメ一覧ページを表示 */}
        <Route path="/to-watch-anime" element={<AllToWatchAnime />} />

        {/* "/watching-anime" の場合は、視聴中アニメ一覧ページを表示 */}
        <Route path="/watching-anime" element={<AllWatchingAnime />} />
      </Routes>
    </AnimatePresence>
  );
}
