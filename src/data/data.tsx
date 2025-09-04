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
export const profileData = {
  name: 'あなたの名前',
  title: '肩書きや簡単な紹介文',
  bio: 'ここに詳細な自己紹介やこれまでの経歴、スキルなどを記述します。どのような人物なのか、より具体的に伝えるためのスペースです。<br/><br/>趣味や興味のあること、将来の目標などを書くことで、見る人に親近感を持ってもらうことができます。',
  imageUrl: 'https://placehold.co/300x300/e8dbc6/333?text=Profile+Image',
  socialLinks: [
    { name: 'X (Twitter)', url: '#', icon: SvgIcons.xTwitter },
    { name: 'GitHub', url: '#', icon: SvgIcons.github },
    { name: 'Note', url: '#', icon: <span className="text-xl font-bold">Note</span> },
    { name: 'Qiita', url: '#', icon: <span className="text-xl font-bold">Qiita</span> }
  ]
};

// 作品データ
export const works = [
  { id: 1, title: '作品タイトルA', imageUrl: 'https://placehold.co/800x450/b8d8be/333?text=Work+A' },
  { id: 2, title: '作品タイトルB', imageUrl: 'https://placehold.co/800x450/a3b18a/333?text=Work+B' },
  { id: 3, title: '作品タイトルC', imageUrl: 'https://placehold.co/800x450/cfe1b9/333?text=Work+C' },
  { id: 4, title: '作品タイトルD', imageUrl: 'https://placehold.co/800x450/94b49f/333?text=Work+D' },
  { id: 5, title: '作品タイトルE', imageUrl: 'https://placehold.co/800x450/609966/333?text=Work+E' },
];

// 記録データ
export const records = [
  { name: 'アニメ', desc: '最近見たアニメや視聴記録はこちら', id: 'anime', imageUrl: 'https://placehold.co/600x400/8d8d8d/fff?text=Anime' },
  { name: 'ミュージック', desc: '最近聞いた音楽や再生履歴はこちら', id: 'music', imageUrl: 'https://placehold.co/600x400/9d9d9d/fff?text=Music' },
  { name: '記事', desc: '執筆した記事やブログはこちら', id: 'article', imageUrl: 'https://placehold.co/600x400/b8b8b8/fff?text=Article' },
  { name: '競プロ', desc: '競技プログラミングの記録はこちら', id: 'programming', imageUrl: 'https://placehold.co/600x400/d0d0d0/fff?text=Programming' },
  { name: '巡礼', desc: 'アニメ聖地巡礼の記録はこちら', id: 'pilgrimage', imageUrl: 'https://placehold.co/600x400/e8e8e8/333?text=Pilgrimage' },
  { name: '一覧へ', desc: 'すべての記録一覧はこちら', id: 'list', imageUrl: 'https://placehold.co/600x400/ffffff/333?text=List' },
];

// おすすめデータ
export const recs = [
  { name: 'アニメ', desc: 'おすすめのアニメ作品はこちら', id: 'recs-anime', imageUrl: 'https://placehold.co/600x400/40e0d0/fff?text=Anime+Recs' },
  { name: '音楽', desc: 'おすすめの音楽プレイリストはこちら', id: 'recs-music', imageUrl: 'https://placehold.co/600x400/6a5acd/fff?text=Music+Recs' },
  { name: '書籍', desc: 'おすすめの書籍リストはこちら', id: 'recs-book', imageUrl: 'https://placehold.co/600x400/ffa500/fff?text=Book+Recs' },
  { name: 'ツール', desc: '愛用しているツールやサービスはこちら', id: 'recs-tool', imageUrl: 'https://placehold.co/600x400/ff6347/fff?text=Tool+Recs' },
  { name: 'デザイン', desc: 'インスピレーションを受けたWebサイトはこちら', id: 'recs-design', imageUrl: 'https://placehold.co/600x400/32cd32/fff?text=Design+Recs' },
  { name: '旅行', desc: 'おすすめの旅行先や旅の記録はこちら', id: 'recs-travel', imageUrl: 'https://placehold.co/600x400/87cefa/fff?text=Travel+Recs' },
];

// イベントデータ
export const events = [
  { id: 1, text: '東京のWebサイトデザインイベントに参加しました！最新のトレンドを学び、とても刺激を受けました。', imageUrl: 'https://placehold.co/800x450/c7a4ff/333?text=Event+A', date: '2024.08.20' },
  { id: 2, text: '「新海誠の世界」展に行ってきました。美しい背景美術に感動。いつか自分もこんな作品を作ってみたいです。', imageUrl: 'https://placehold.co/800x450/ff99c8/333?text=Event+B', date: '2024.08.15' },
  { id: 3, text: '初めての技術書典に参加！たくさんの技術同人誌を購入しました。週末に読むのが楽しみです。', imageUrl: 'https://placehold.co/800x450/a3e4d7/333?text=Event+C', date: '2024.08.10' },
  { id: 4, text: '夏コミケ参戦！猛暑の中でしたが、たくさんのクリエイターの熱気に触れられました。', imageUrl: 'https://placehold.co/800x450/ffc3a0/333?text=Event+D', date: '2024.08.05' },
];
