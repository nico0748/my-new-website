import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// --- Data and Type Imports ---
import { profileData } from './data/profileData/profileData.tsx';
import { works } from './data/worksData/worksData.tsx';
import { records } from './data/recordsData/recordsData.tsx';
import { recs} from './data/recsData/recsData.tsx';
import { events } from './data/eventsData/eventsData.tsx';
//Data関連はindex.tsでpropsの行っているため、新規で追加する場合はindex.tsも修正する必要あり

import type { Work } from './types';

// --- Page Components ---
import AllWatchedAnime from './pages/allWatchedAnime';
import AllToWatchAnime from './pages/alltoWatchAnime';
//import AllWatchingAnime from './pages/allWatchingAnime';
import AnimeDetail from './pages/animeDetail';
import PortfolioPage from './pages/portfolioPage.tsx';  

//ビルドした本番実行環境だと直接リンク指定で遷移できないので原因究明を急ぐ必要がある

// --- Feature and Layout Components ---
import Profile from './features/profile/Profile';
import Header from './components/layouts/header/Header';
import Hero from './features/hero/Hero';
import Works from './features/works/Works';
import Records from './features/records/Records';
import Recs from './features/recs/Recs';
import Events from './features/events/Events';
import Contact from './features/contact/Contact';
import Footer from './components/layouts/footer/Footer';


// =================================================================
// 1. ホームページコンポーネント (既存のAppコンポーネントの内容)
// =================================================================
const HomePage = () => {
  const [activeSection, setActiveSection] = useState<string>('profile');

  const scrollToSection = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const sections = ['profile', 'works', 'records', 'recs', 'events', 'contact'];
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: "-50% 0px -50% 0px" });

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  const showMessage = (msg: string): void => {
    const existingBox = document.getElementById('custom-message-box');
    if (existingBox) {
      existingBox.remove();
    }

    const messageBox = document.createElement('div');
    messageBox.id = 'custom-message-box';
    messageBox.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-gray-800 p-6 rounded-lg shadow-xl z-[100] text-center max-w-sm w-11/12';
    messageBox.innerHTML = `
      <p class="mb-4">${msg}</p>
      <button class="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">OK</button>
    `;
    document.body.appendChild(messageBox);
    
    const button = messageBox.querySelector('button');
    if (button) {
      button.onclick = () => {
        document.body.removeChild(messageBox);
      };
    }
  };
  
  const handleWorkClick = (work: Work): void => showMessage(`${work.title}の詳細ページへ遷移します。`);
  
  const handleRecordsClick = (serviceId: string): void => {
    const serviceMap: { [key: string]: string } = {
      'anime': 'Annictなどのアニメ視聴記録ページへ遷移します。',
      'music': 'Spotifyなどの音楽再生履歴ページへ遷移します。',
      'article': '関連する記事ページへ遷移します。',
      'programming': '競技プログラミングの記録ページへ遷移します。',
      'pilgrimage': 'アニメ聖地巡礼の記録ページへ遷移します。',
      'list': '記録一覧ページへ遷移します。',
    };
    showMessage(serviceMap[serviceId] || '詳細ページへ遷移します。');
  };

  const handleRecsClick = (serviceId: string): void => {
    const serviceMap: { [key: string]: string } = {
      'recs-anime': 'おすすめアニメの詳細ページへ遷移します。',
      'recs-music': 'おすすめ音楽の詳細ページへ遷移します。',
      'recs-book': 'おすすめ書籍の詳細ページへ遷移します。',
      'recs-tool': 'おすすめツールの詳細ページへ遷移します。',
      'recs-design': 'おすすめデザインの詳細ページへ遷移します。',
      'recs-travel': 'おすすめ旅行地の詳細ページへ遷移します。',
    };
    showMessage(serviceMap[serviceId] || 'おすすめコンテンツ一覧ページへ遷移します。');
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    showMessage('お問い合わせありがとうございます。内容を確認の上、返信いたします。');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="bg-[#f1e6d1] text-[#333] font-sans antialiased overflow-x-hidden min-h-screen">
      <Header activeSection={activeSection} scrollToSection={scrollToSection} />
      
      {/* ヘッダーの高さ分のスペーサーを追加 */}
      <div className="h-16 sm:h-20"></div>
      
      <main className="w-full max-w-full overflow-x-hidden px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <Hero />
          <Profile data={profileData} />
          <Works works={works} handleWorkClick={handleWorkClick} />
          <Records records={records} handleRecordsClick={handleRecordsClick} />
          <Recs recs={recs} handleRecsClick={handleRecsClick} />
          <Events events={events} />
          <Contact handleContactSubmit={handleContactSubmit} />
        </div>
      </main>

      <Footer />
    </div>
  );
}


// =================================================================
// 2. Appコンポーネント (ルーティング管理)
// =================================================================
export default function App() {
  return (
    <Routes>
      {/* ルートURL ("/") の場合は、既存のホームページを表示 */}
      <Route path="/" element={<HomePage />} />
      
      {/* "/portfolio" の場合は、ポートフォリオページを表示 */}
      <Route path="/portfolio" element={<PortfolioPage />} />
      
      {/* "/watched-anime" の場合は、視聴済みアニメ一覧ページを表示 */}
      <Route path="/watched-anime" element={<AllWatchedAnime />} />

      {/* "/to-watch-anime" の場合は、視聴予定アニメ一覧ページを表示 */}
      <Route path="/to-watch-anime" element={<AllToWatchAnime />} />

      {/* "/anime/:animeId" の場合は、アニメ詳細ページを表示 */}
      <Route path="/anime/:animeId" element={<AnimeDetail />} />
    </Routes>
  );
}
