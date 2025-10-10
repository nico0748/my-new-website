import Header from '../components/layouts/header/Header'; // 既存のヘッダーを流用
import Footer from '../components/layouts/footer/Footer'; // 既存のフッターを流用
import Profile from '../features/profile/Profile';

// データインポート
import { portfolioData } from '../data/portfolioData/portfolioData'; 
import { profileData } from '../data/profileData/profileData.tsx';

// UIコンポーネント
import ProjectCard from '../components/ui/ProjectCard'; 
import SectionWrapper from '../components/ui/SectionWrapper';

//ライブラリインポート
import { motion } from 'framer-motion'; // ★ 1. motionをインポート


const PortfolioPage = () => {
  return (
    <div className="bg-[#f1e6d1] text-[#333] font-sans antialiased overflow-x-hidden min-h-screen">
      {/* 既存のヘッダー・フッターを使い回すことで、サイト全体の一貫性を保ちます */}
      <Header activeSection="portfolio" scrollToSection={() => {}} /> {/* propsは適宜調整 */}
      
      {/* ヘッダーの高さ分のスペーサー */}
      <div className="h-16 sm:h-20"></div>
        <main className="container mx-auto py-12 px-4 w-full max-w-full overflow-x-hidden">
            <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 20 }} // 初期状態
                animate={{ opacity: 1, y: 0 }}   // アニメーション後の状態
                transition={{ duration: 0.8 }}   // アニメーションの時間
            >
                <Profile data={profileData} />
            </motion.div>
            <SectionWrapper id="projects" title="Projects">    
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {portfolioData.map(item => (
                    <ProjectCard key={item.id} item={item} />
                ))}
                </div>
            </SectionWrapper>
        </main>
      <Footer />
    </div>
  );
};

export default PortfolioPage;