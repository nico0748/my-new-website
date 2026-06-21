import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- Page Components ---
import AllWatchedAnime from './pages/allWatchedAnime';
import AllToWatchAnime from './pages/alltoWatchAnime';
import AllWatchingAnime from './pages/allWatchingAnime';
import PortfolioPage from './pages/portfolioPage.tsx';
import HobbyPage from './pages/hobbyPages.tsx';
import ProjectDetailPage from './pages/ProjectDetailPage.tsx';
import ProjectsPage from './pages/ProjectsPage.tsx';
import SkillsPage from './pages/SkillsPage.tsx';
import TopicsPage from './pages/TopicsPage.tsx';
import TopicDetailPage from './pages/TopicDetailPage.tsx';
import StudyPage from './pages/StudyPage.tsx';
import StudyDetailPage from './pages/StudyDetailPage.tsx';

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
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/topics/:id" element={<TopicDetailPage />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/study/:id" element={<StudyDetailPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/skills/:category" element={<Navigate to="/skills" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
