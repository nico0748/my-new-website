// 1. プロジェクト1件分のデータ型を定義
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string; // 画像パス (例: '/images/portfolio/project-a.jpg')
  tags: string[];
  liveUrl?: string; // 公開サイトのURL (任意)
  repoUrl?: string; // GitHubリポジトリのURL (任意)
}

// 2. 実際のプロジェクトデータを配列として作成
export const portfolioData: PortfolioItem[] = [
  {
    id: 'project-a',
    title: 'モダンコーポレートサイト',
    description: 'ViteとReactを使用し、Framer Motionによるアニメーションを導入した企業の公式サイトです。',
    thumbnail: '/images/portfolio/thumb1.jpg',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: '#',
    repoUrl: '#',
  },
  {
    id: 'project-b',
    title: 'データ可視化ダッシュボード',
    description: 'D3.jsと連携し、複雑なデータを直感的に理解できるダッシュボードを開発しました。',
    thumbnail: '/images/portfolio/thumb2.jpg',
    tags: ['React', 'TypeScript', 'D3.js', 'Styled Components'],
    liveUrl: '#',
  },
  {
    id: 'project-c',
    title: '個人ブログサイト',
    description: 'Next.jsのSSG機能を利用し、高速表示とSEOを両立した技術ブログを構築しました。',
    thumbnail: '/images/portfolio/thumb3.jpg',
    tags: ['Next.js', 'TypeScript', 'Markdown'],
    repoUrl: '#',
  },
  // ... 他のプロジェクトデータを追加
];