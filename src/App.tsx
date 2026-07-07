import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAnalytics } from './lib/analytics';

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
import LearnPage from './pages/LearnPage.tsx';
import LearnDomainPage from './pages/LearnDomainPage.tsx';
import LearnDetailPage from './pages/LearnDetailPage.tsx';

export default function App() {
  const location = useLocation();
  useAnalytics(); // GA4: ルート遷移ごとに page_view を送信（本番のみ）

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
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/learn/:domain" element={<LearnDomainPage />} />
        <Route path="/learn/:domain/:id" element={<LearnDetailPage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/skills/:category" element={<Navigate to="/skills" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
