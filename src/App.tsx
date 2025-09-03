import { useState, useEffect } from 'react';

// --- Data Section (from data.js) ---
// サイトで表示するデータをここに集約します

// SVGアイコンデータ
const SvgIcons = {
  github: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.803 8.207 11.385.6.113.818-.261.818-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.542-1.355-1.325-1.716-1.325-1.716-1.09-.744.082-.729.082-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.835 2.809 1.305 3.492.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.124-3.179 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23.665 1.656.26 2.876.12 3.179.77.84 1.235 1.911 1.235 3.22 0 4.61-2.801 5.626-5.476 5.925.42.36.81 1.015.81 2.04 0 1.472-.014 2.65-.014 3.003 0 .318.219.695.825.578 4.771-1.581 8.202-6.082 8.202-11.385.001-6.627-5.372-12-11.999-12z" /></svg>
  ),
  xTwitter: (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="currentColor"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"/></svg>
  )
};

// プロフィールデータ
const profileData = {
  name: 'あなたの名前',
  title: '肩書きや簡単な紹介文',
  bio: 'ここに詳細な自己紹介やこれまでの経歴、スキルなどを記述します。どのような人物なのか、より具体的に伝えるためのスペースです。<br/><br/>趣味や興味のあること、将来の目標などを書くことで、見る人に親近感を持ってもらうことができます。',
  imageUrl: 'https://placehold.co/300x300/e8dbc6/333?text=Profile+Image',
  socialLinks: [
    { name: 'X (Twitter)', url: 1, icon: SvgIcons.xTwitter },
    { name: 'GitHub', url: '#', icon: SvgIcons.github },
    { name: 'Note', url: '#', icon: <span className="text-xl font-bold">Note</span> },
    { name: 'Qiita', url: '#', icon: <span className="text-xl font-bold">Qiita</span> }
  ]
};

// 作品データ
const works = [
  { id: 1, title: '作品タイトルA', imageUrl: 'https://placehold.co/800x450/b8d8be/333?text=Work+A' },
  { id: 2, title: '作品タイトルB', imageUrl: 'https://placehold.co/800x450/a3b18a/333?text=Work+B' },
  { id: 3, title: '作品タイトルC', imageUrl: 'https://placehold.co/800x450/cfe1b9/333?text=Work+C' },
  { id: 4, title: '作品タイトルD', imageUrl: 'https://placehold.co/800x450/94b49f/333?text=Work+D' },
  { id: 5, title: '作品タイトルE', imageUrl: 'https://placehold.co/800x450/609966/333?text=Work+E' },
];

// 記録データ
const records = [
  { name: 'アニメ', desc: '最近見たアニメや視聴記録はこちら', id: 'anime', imageUrl: 'https://placehold.co/600x400/8d8d8d/fff?text=Anime' },
  { name: 'ミュージック', desc: '最近聞いた音楽や再生履歴はこちら', id: 'music', imageUrl: 'https://placehold.co/600x400/9d9d9d/fff?text=Music' },
  { name: '記事', desc: '執筆した記事やブログはこちら', id: 'article', imageUrl: 'https://placehold.co/600x400/b8b8b8/fff?text=Article' },
  { name: '競プロ', desc: '競技プログラミングの記録はこちら', id: 'programming', imageUrl: 'https://placehold.co/600x400/d0d0d0/fff?text=Programming' },
  { name: '巡礼', desc: 'アニメ聖地巡礼の記録はこちら', id: 'pilgrimage', imageUrl: 'https://placehold.co/600x400/e8e8e8/333?text=Pilgrimage' },
  { name: '一覧へ', desc: 'すべての記録一覧はこちら', id: 'list', imageUrl: 'https://placehold.co/600x400/ffffff/333?text=List' },
];

// おすすめデータ
const recs = [
  { name: 'アニメ', desc: 'おすすめのアニメ作品はこちら', id: 'recs-anime', imageUrl: 'https://placehold.co/600x400/40e0d0/fff?text=Anime+Recs' },
  { name: '音楽', desc: 'おすすめの音楽プレイリストはこちら', id: 'recs-music', imageUrl: 'https://placehold.co/600x400/6a5acd/fff?text=Music+Recs' },
  { name: '書籍', desc: 'おすすめの書籍リストはこちら', id: 'recs-book', imageUrl: 'https://placehold.co/600x400/ffa500/fff?text=Book+Recs' },
  { name: 'ツール', desc: '愛用しているツールやサービスはこちら', id: 'recs-tool', imageUrl: 'https://placehold.co/600x400/ff6347/fff?text=Tool+Recs' },
  { name: 'デザイン', desc: 'インスピレーションを受けたWebサイトはこちら', id: 'recs-design', imageUrl: 'https://placehold.co/600x400/32cd32/fff?text=Design+Recs' },
  { name: '旅行', desc: 'おすすめの旅行先や旅の記録はこちら', id: 'recs-travel', imageUrl: 'https://placehold.co/600x400/87cefa/fff?text=Travel+Recs' },
];

// イベントデータ
const events = [
  { id: 1, text: '東京のWebサイトデザインイベントに参加しました！最新のトレンドを学び、とても刺激を受けました。', imageUrl: 'https://placehold.co/800x450/c7a4ff/333?text=Event+A', date: '2024.08.20' },
  { id: 2, text: '「新海誠の世界」展に行ってきました。美しい背景美術に感動。いつか自分もこんな作品を作ってみたいです。', imageUrl: 'https://placehold.co/800x450/ff99c8/333?text=Event+B', date: '2024.08.15' },
  { id: 3, text: '初めての技術書典に参加！たくさんの技術同人誌を購入しました。週末に読むのが楽しみです。', imageUrl: 'https://placehold.co/800x450/a3e4d7/333?text=Event+C', date: '2024.08.10' },
  { id: 4, text: '夏コミケ参戦！猛暑の中でしたが、たくさんのクリエイターの熱気に触れられました。', imageUrl: 'https://placehold.co/800x450/ffc3a0/333?text=Event+D', date: '2024.08.05' },
];


// --- Component Section (from components.jsx) ---
// 各セクションのコンポーネントをここに定義します。

// 1. コンポーネントが受け取るPropsの型を定義するinterfaceを作成します
interface HeaderProps {
  activeSection: string;
  scrollToSection: (id: string) => void;
}

// 2. 作成したinterfaceをコンポーネントに適用します
const Header: React.FC<HeaderProps> = ({ activeSection, scrollToSection }) => {
  const navItems = ['profile', 'works', 'records', 'recs', 'events', 'contact'];
  
  return (
    <header className="sticky top-0 z-50 bg-[#f1e6d1]/80 backdrop-blur-sm shadow-md py-4 px-4 sm:px-8 md:px-16 flex justify-center">
      <nav className="flex flex-wrap justify-center space-x-4 md:space-x-8">
        {navItems.map(item => (
          <button 
            key={item}
            onClick={() => scrollToSection(item)} 
            className={`capitalize text-sm md:text-lg font-bold transition-colors duration-300 ${activeSection === item ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'}`}
          >
            {item}
          </button>
        ))}
      </nav>
    </header>
  );
};

// Hero Component
function Hero() {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-center px-4">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4">NICOLABO -にこラボ-</h1>
      <p className="text-lg sm:text-xl md:text-2xl">あなたの活動をサポートする個人サイトです。</p>
    </section>
  );
}

// Profile Component

// =================================================================
// 1. 型定義
// =================================================================

// まず、ネストされている `link` オブジェクトの型を定義します
interface SocialLink {
  name: string;
  url: string;
  icon: React.ReactNode; // SVGやJSX要素など、Reactが描画できるものすべてを表す型
}

// 次に、`SocialLink` の配列を含む `data` オブジェクト全体の型を定義します
interface ProfileData {
  imageUrl: string;
  name: string;
  title: string;
  bio: string;
  socialLinks: SocialLink[]; // SocialLink型のオブジェクトが複数入る配列
}

// 最後に、Profileコンポーネントが受け取るPropsの型を定義します
interface ProfileProps {
  data: ProfileData;
}


// =================================================================
// 2. コンポーネント
// =================================================================

const Profile: React.FC<ProfileProps> = ({ data }) => {
  return (
    <section id="profile" className="py-20 md:py-32 min-h-screen flex items-center">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Profile</h2>
        <div className="flex flex-col md:flex-row gap-8 items-stretch">
          {/* 左のボックス */}
          <div className="md:w-1/3 w-full bg-[#e8dbc6] p-6 rounded-lg shadow-md flex flex-col">
            <img src={data.imageUrl} alt={data.name} className="w-full h-auto aspect-square object-cover rounded-md mb-4" />
            <h3 className="text-2xl font-bold mb-2 text-center">{data.name}</h3>
            <p className="text-base text-gray-700 text-center">{data.title}</p>
            <div className="flex justify-center space-x-4 mt-auto pt-4">
              {/* `data.socialLinks`が`SocialLink[]`型なので、
                TypeScriptは自動的に`link`変数が`SocialLink`型であると推論します。
                これにより、`link.url`や`link.icon`などのプロパティを安全に呼び出せます。
              */}
              {data.socialLinks.map(link => (
                <a key={link.name} href={link.url} aria-label={link.name} className="text-gray-600 hover:text-blue-500 transition-colors">
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          {/* 右のボックス */}
          <div className="md:w-2/3 w-full bg-[#e8dbc6] p-6 md:p-8 rounded-lg shadow-md">
            <p className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: data.bio }}></p>
          </div>
        </div>
      </div>
    </section>
  );
};

// Works Component
function Works({ works, handleWorkClick }) {
  const [isCarouselView, setIsCarouselView] = useState(true);
  const [currentWorkIndex, setCurrentWorkIndex] = useState(0);

  const nextWork = () => setCurrentWorkIndex((prev) => (prev + 1) % works.length);
  const prevWork = () => setCurrentWorkIndex((prev) => (prev - 1 + works.length) % works.length);

  return (
    <section id="works" className="py-20 md:py-32 min-h-screen flex items-center">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
          <h2 className="text-4xl md:text-5xl font-bold">Works</h2>
          <button onClick={() => setIsCarouselView(!isCarouselView)} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md hover:bg-gray-300 transition-colors">
            {isCarouselView ? '一覧表示' : 'カルーセル'}
          </button>
        </div>
        {isCarouselView ? (
          <div className="relative">
            <div className="overflow-hidden rounded-lg shadow-lg">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentWorkIndex * 100}%)` }}>
                {works.map((work) => (
                  <div key={work.id} className="w-full flex-shrink-0 relative cursor-pointer group" onClick={() => handleWorkClick(work)}>
                    <img src={work.imageUrl} alt={work.title} className="w-full h-auto aspect-video object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                      <h3 className="text-xl font-bold">{work.title}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={prevWork} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow-md hover:bg-white/75 transition-colors text-2xl leading-none">‹</button>
            <button onClick={nextWork} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow-md hover:bg-white/75 transition-colors text-2xl leading-none">›</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {works.map((work) => (
              <div key={work.id} className="bg-[#e8dbc6] rounded-lg shadow-md overflow-hidden cursor-pointer group" onClick={() => handleWorkClick(work)}>
                <div className="overflow-hidden aspect-video">
                  <img src={work.imageUrl} alt={work.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                </div>
                <div className="p-4"><h3 className="text-lg font-bold">{work.title}</h3></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Generic Grid Section Component
// =================================================================
// 1. 型定義
// =================================================================

// まず、`items`配列の中の一つ一つのオブジェクトの型を定義します
// このコンポーネントが表示するカードの「設計図」です
interface GridItem {
  id: string;
  name: string;
  desc: string;
  imageUrl: string;
}

// 次に、GridSectionコンポーネント自体が受け取るPropsの型を定義します
interface GridSectionProps {
  id: string;
  title: string;
  items: GridItem[]; // GridItem型のオブジェクトが複数入る配列
  onItemClick: (id: string) => void; // string型のidを引数に取り、何も返さない関数
}


// =================================================================
// 2. コンポーネント
// =================================================================

const GridSection: React.FC<GridSectionProps> = ({ id, title, items, onItemClick }) => {
    return (
        <section id={id} className="py-20 md:py-32 min-h-screen flex items-center">
            <div className="max-w-4xl mx-auto w-full">
                <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">{title}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                    {/* `items`が`GridItem[]`型なので、
                      TypeScriptは自動的に`item`変数が`GridItem`型であると推論します。
                      これにより、`item.name`などのプロパティを安全に利用できます。
                    */}
                    {items.map((item) => (
                        <div key={item.id} className="relative rounded-lg shadow-md overflow-hidden cursor-pointer group h-64" onClick={() => onItemClick(item.id)}>
                            <img src={item.imageUrl} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                            <div className="relative z-10 p-4 flex flex-col items-center justify-center text-center text-white bg-black/60 h-full transition-colors group-hover:bg-black/70">
                                <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                                <p className="text-base">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Records Component
function Records({ records, handleRecordsClick }) {
    return <GridSection id="records" title="Records" items={records} onItemClick={handleRecordsClick} />;
}

// Recs Component
function Recs({ recs, handleRecsClick }) {
    return <GridSection id="recs" title="Recs" items={recs} onItemClick={handleRecsClick} />;
}

// Events Component
function Events({ events }) {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const nextEvent = () => setCurrentEventIndex((prev) => (prev + 1) % events.length);
  const prevEvent = () => setCurrentEventIndex((prev) => (prev - 1 + events.length) % events.length);

  return (
    <section id="events" className="py-20 md:py-32 min-h-screen flex items-center">
      <div className="max-w-5xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Events</h2>
        <div className="relative">
          <div className="overflow-hidden rounded-lg shadow-lg">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentEventIndex * 100}%)` }}>
              {events.map((event) => (
                <div key={event.id} className="w-full flex-shrink-0 relative">
                  <img src={event.imageUrl} alt={`Event ${event.id}`} className="w-full h-auto aspect-video object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                    <p className="font-bold text-lg">{event.date}</p>
                    <p>{event.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={prevEvent} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow-md hover:bg-white/75 transition-colors text-2xl leading-none">‹</button>
          <button onClick={nextEvent} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full shadow-md hover:bg-white/75 transition-colors text-2xl leading-none">›</button>
        </div>
      </div>
    </section>
  );
}

// Contact Component
function Contact({ handleContactSubmit }) {
  return (
    <section id="contact" className="py-20 md:py-32 min-h-screen flex items-center">
      <div className="max-w-2xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Contact</h2>
        <div className="bg-[#e8dbc6] p-6 md:p-8 rounded-lg shadow-md">
          <form onSubmit={handleContactSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-700 text-lg font-bold mb-2">お名前</label>
              <input type="text" id="name" name="name" required className="w-full px-4 py-2 border bg-[#f1e6d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
            </div>
            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 text-lg font-bold mb-2">メールアドレス</label>
              <input type="email" id="email" name="email" required className="w-full px-4 py-2 border bg-[#f1e6d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow" />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-700 text-lg font-bold mb-2">お問い合わせ内容</label>
              <textarea id="message" name="message" rows="5" required className="w-full px-4 py-2 border bg-[#f1e6d1] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"></textarea>
            </div>
            <div className="text-center">
              <button type="submit" className="bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400">
                送信する
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-[#e8dbc6] text-center py-8 mt-16">
      <div className="container mx-auto px-4 md:px-8">
        <p className="text-gray-600">&copy; {new Date().getFullYear()} NICOLABO -にこラボ-. All Rights Reserved.</p>
      </div>
    </footer>
  );
}


// --- Main App Component ---
export default function App() {
  const [activeSection, setActiveSection] = useState('profile');

  const scrollToSection = (id) => {
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

  const showMessage = (msg) => {
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
    messageBox.querySelector('button').onclick = () => {
      document.body.removeChild(messageBox);
    };
  };
  
  const handleWorkClick = (work) => showMessage(`${work.title}の詳細ページへ遷移します。`);
  
  const handleRecordsClick = (serviceId) => {
    const serviceMap = {
      'anime': 'Annictなどのアニメ視聴記録ページへ遷移します。',
      'music': 'Spotifyなどの音楽再生履歴ページへ遷移します。',
      'article': '関連する記事ページへ遷移します。',
      'programming': '競技プログラミングの記録ページへ遷移します。',
      'pilgrimage': 'アニメ聖地巡礼の記録ページへ遷移します。',
      'list': '記録一覧ページへ遷移します。',
    };
    showMessage(serviceMap[serviceId] || '詳細ページへ遷移します。');
  };

  const handleRecsClick = (serviceId) => {
    const serviceMap = {
      'recs-anime': 'おすすめアニメの詳細ページへ遷移します。',
      'recs-music': 'おすすめ音楽の詳細ページへ遷移します。',
      'recs-book': 'おすすめ書籍の詳細ページへ遷移します。',
      'recs-tool': 'おすすめツールの詳細ページへ遷移します。',
      'recs-design': 'おすすめデザインの詳細ページへ遷移します。',
      'recs-travel': 'おすすめ旅行地の詳細ページへ遷移します。',
    };
    showMessage(serviceMap[serviceId] || 'おすすめコンテンツ一覧ページへ遷移します。');
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    showMessage('お問い合わせありがとうございます。内容を確認の上、返信いたします。');
    e.target.reset();
  };

  return (
    <div className="bg-[#f1e6d1] text-[#333] font-sans antialiased">
      <Header activeSection={activeSection} scrollToSection={scrollToSection} />
      
      <main className="container mx-auto px-4 md:px-8">
        <Hero />
        <Profile data={profileData} />
        <Works works={works} handleWorkClick={handleWorkClick} />
        <Records records={records} handleRecordsClick={handleRecordsClick} />
        <Recs recs={recs} handleRecsClick={handleRecsClick} />
        <Events events={events} />
        <Contact handleContactSubmit={handleContactSubmit} />
      </main>

      <Footer />
    </div>
  );
}
