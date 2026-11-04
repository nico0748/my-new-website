import { Route, Navigate } from 'react-router-dom';
import { LearnRedirect, RootLayout } from './components/layouts/RootLayout';

// --- Page Components ---
import PortfolioPage from './pages/portfolioPage.tsx';
import ProjectDetailPage from './pages/ProjectDetailPage.tsx';
import ProjectsPage from './pages/ProjectsPage.tsx';
import SkillsPage from './pages/SkillsPage.tsx';
import ArticlesPage from './pages/ArticlesPage.tsx';
import AnimePage from './pages/AnimePage.tsx';
import LearnPage from './pages/LearnPage.tsx';
import LearnDomainPage from './pages/LearnDomainPage.tsx';
import LearnDetailPage from './pages/LearnDetailPage.tsx';
import ExperiencePage from './pages/ExperiencePage.tsx';
import ExperienceDetailPage from './pages/ExperienceDetailPage.tsx';

/**
 * ルート定義。main.tsx の createBrowserRouter（data router）に渡す。
 * <Link viewTransition> による一覧 → 詳細の共有要素モーフは data router でしか効かないため、
 * <Routes> ではなくこの形で持つ。
 */
export const appRoutes = (
  <Route element={<RootLayout />}>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        {/* 廃止: Topics はトップへ、旧 Study は Articles へ（ブックマーク互換） */}
        <Route path="/topics/*" element={<Navigate to="/" replace />} />
        <Route path="/study/*" element={<Navigate to="/articles" replace />} />
        <Route path="/anime" element={<AnimePage />} />
        {/* 廃止: 旧 Hobby はトップの Off-hours へ、旧アニメ一覧 3 ページは /anime の各タブへ */}
        <Route path="/hobbys" element={<Navigate to="/" replace />} />
        <Route path="/watched-anime" element={<Navigate to="/anime?tab=watched" replace />} />
        <Route path="/to-watch-anime" element={<Navigate to="/anime?tab=wanna" replace />} />
        <Route path="/watching-anime" element={<Navigate to="/anime?tab=watching" replace />} />
        <Route path="/nicotech" element={<LearnPage />} />
        {/* 経験録は :domain より先に置き、静的セグメントを優先させる */}
        <Route path="/nicotech/experience" element={<ExperiencePage />} />
        <Route path="/nicotech/experience/:id" element={<ExperienceDetailPage />} />
        <Route path="/nicotech/:domain" element={<LearnDomainPage />} />
        <Route path="/nicotech/:domain/:id" element={<LearnDetailPage />} />
        {/* 旧 /learn/* は /nicotech/* へリダイレクト（ブックマーク互換） */}
        <Route path="/learn/*" element={<LearnRedirect />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/skills/:category" element={<Navigate to="/skills" replace />} />
  </Route>
);
