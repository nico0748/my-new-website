import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- Page Components ---
import AllWatchedAnime from './pages/allWatchedAnime';
import AllToWatchAnime from './pages/alltoWatchAnime';
import AllWatchingAnime from './pages/allWatchingAnime';
import PortfolioPage from './pages/portfolioPage.tsx';
import HobbyPage from './pages/hobbyPages.tsx';
import ProjectDetailPage from './pages/ProjectDetailPage.tsx';

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/hobbys" element={<HobbyPage />} />
        <Route path="/watched-anime" element={<AllWatchedAnime />} />
        <Route path="/to-watch-anime" element={<AllToWatchAnime />} />
        <Route path="/watching-anime" element={<AllWatchingAnime />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
      </Routes>
    </AnimatePresence>
  );
}
