/** /learn 教材の分野・章・レベルの定義とスタイル。
 *  ダーク・ターミナルテーマのパレット（CSS 変数）に準拠。
 *  記事メタは各 TSX に同居（src/content/learn/<domain>/<id>.tsx の `meta`）。
 *  分野・章を増やすときはここに追加する。 */

/** 分野（大分類 / domain）。URL は /nicotech/<domain>。
 *  基礎コース（*）／応用コース（*-adv）／実践コース（プロジェクト型）。 */
export type LearnDomain =
  | "web" | "infra" | "security" | "mobile" | "dev" | "ai" | "kyopro" | "stack" | "claude-code" | "it-terms"
  | "web-adv" | "infra-adv" | "security-adv" | "mobile-adv" | "dev-adv" | "ai-adv"
  | "react-practice" | "angular-practice" | "api-practice" | "rag-practice"
  | "vuln-research" | "ai-agent-practice" | "devsecops-practice";

/** 難易度（体系順の補助）。 */
export type LearnLevel = "intro" | "basic" | "practice";

/** 各記事 TSX が named export するメタ情報。 */
export interface LearnMeta {
  /** URL スラッグ（分野内で一意）。/learn/<domain>/<id> */
  id: string;
  title: string;
  description: string;
  domain: LearnDomain;
  /** 章キー（DOMAIN_SECTIONS[domain] のいずれか） */
  section: string;
  /** 章内の並び順（体系順。小さいほど先） */
  order: number;
  level: LearnLevel;
  tags: string[];
  /** 最終更新日 YYYY-MM-DD（任意・表示のみ） */
  updated?: string;
  /** 目安の所要時間（分・任意）。カード/詳細に「約N分」で表示 */
  minutes?: number;
}

export interface DomainStyle {
  /** コース名（UI 表示） */
  label: string;
  /** アクセント色（hex, Progate 系パレット） */
  accent: string;
  /** カバー画像パス（public/learn/covers/<domain>.svg）。⚠️ 絵文字は使わない方針 */
  cover: string;
  description: string;
}

/** コース（＝分野）スタイル。⚠️ 絵文字は使わずカバー画像で表現する。 */
export const DOMAIN_STYLES: Record<LearnDomain, DomainStyle> = {
  web: {
    label: "Web基礎",
    accent: "#22b0a0",               // ティール
    cover: "/learn/covers/web.svg",
    description: "HTTP/DNS の基礎からフロントエンド・バックエンド・API 設計まで、Web の土台を体系立てて学びます。",
  },
  infra: {
    label: "インフラ基礎",
    accent: "#e6a532",               // アンバー
    cover: "/learn/covers/infra.svg",
    description: "Linux・ネットワーク・クラウド・コンテナ・CI/CD。サーバー運用を支える基盤技術を扱います。",
  },
  security: {
    label: "セキュリティ基礎",
    accent: "#f0637e",               // ピンク
    cover: "/learn/covers/security.svg",
    description: "Web セキュリティ・認証認可・暗号・脆弱性対応。安全なシステムを作るための考え方を学びます。",
  },
  mobile: {
    label: "モバイル基礎",
    accent: "#3b82f6",               // ブルー
    cover: "/learn/covers/mobile.svg",
    description: "iOS・Android・クロスプラットフォーム。スマホアプリ開発の基礎を体系立てて学びます。",
  },
  dev: {
    label: "開発基礎",
    accent: "#8b5cf6",               // バイオレット
    cover: "/learn/covers/dev.svg",
    description: "Git・エディタ・テスト・設計・チーム開発。開発を支える基礎スキルとプラクティス。",
  },
  ai: {
    label: "AI基礎",
    accent: "#f97316",               // オレンジ
    cover: "/learn/covers/ai.svg",
    description: "機械学習・ディープラーニング・LLM/生成AI。AI を理解し使いこなすための基礎。",
  },
  kyopro: {
    label: "競技プログラミング",
    accent: "#7c3aed",               // バイオレット
    cover: "/learn/covers/kyopro.svg",
    description: "Python での入出力から、探索・グラフ・最短経路・DP まで。競プロ/paiza の典型アルゴリズムを実装とともに体系的に。",
  },
  stack: {
    label: "技術スタック一覧",
    accent: "#4f46e5",               // インディゴ
    cover: "/learn/covers/stack.svg",
    description: "Web・モバイル・デスクトップ・拡張機能から、フロント/バック/DB/コンテナ/クラウドまで。分野ごとに代表的な技術スタックを俯瞰し、何を選べばよいかの地図にします。",
  },
  "claude-code": {
    label: "Claude Code基礎",
    accent: "#d97757",               // クレイ（Anthropic 系）
    cover: "/learn/covers/claude-code.svg",
    description: "ターミナルで動くエージェント型 AI コーディングアシスタント Claude Code。仕組み・環境構築・実践ワークフローまでを段階的に学びます。",
  },
  "it-terms": {
    label: "IT用語解説",
    accent: "#10b981",               // エメラルド
    cover: "/learn/covers/it-terms.svg",
    description: "「APIを叩く」「プロセスをキルする」などの現場の言い回しから、開発・Web・ネットワーク・インフラ・データ・セキュリティの基本用語まで。分からない言葉を引くための IT 用語辞典。",
  },

  // ── 応用コース（濃色サムネ）。基礎を終えた人向けの実践編。 ──
  "web-adv": {
    label: "Web応用",
    accent: "#0f6e56",               // 濃ティール
    cover: "/learn/covers/web-advanced.svg",
    description: "大規模フロントエンド設計・状態管理・パフォーマンス・リアルタイム通信・テスト。実務レベルの Web 開発へ。",
  },
  "infra-adv": {
    label: "インフラ応用",
    accent: "#b47a12",               // 濃アンバー
    cover: "/learn/covers/infra-advanced.svg",
    description: "IaC・Kubernetes 運用・可観測性・SRE・コスト最適化。本番インフラを設計・運用する力を養います。",
  },
  "security-adv": {
    label: "セキュリティ応用",
    accent: "#c23a55",               // 濃ピンク
    cover: "/learn/covers/security-advanced.svg",
    description: "ペネトレーションテスト・アプリセキュリティ・クラウドセキュリティ・実践暗号・高度なインシデント対応。",
  },
  "mobile-adv": {
    label: "モバイル応用",
    accent: "#2a9e5a",               // 濃グリーン
    cover: "/learn/covers/mobile-advanced.svg",
    description: "ネイティブ実践・クロスプラットフォーム最適化・パフォーマンス・ストア配信と運用。",
  },
  "dev-adv": {
    label: "開発応用",
    accent: "#1e78b8",               // 濃ブルー
    cover: "/learn/covers/dev-advanced.svg",
    description: "アーキテクチャ設計・CI/CD・リファクタリング・チーム開発。プロダクトを継続的に届ける実践。",
  },
  "ai-adv": {
    label: "AI応用",
    accent: "#6435c4",               // 濃バイオレット
    cover: "/learn/covers/ai-advanced.svg",
    description: "機械学習の実践・LLM アプリ開発・RAG・MLOps。AI をプロダクトに組み込む応用力を身につけます。",
  },

  // ── 実践コース（プロジェクト型・特定テーマを手を動かして作る） ──
  "react-practice": {
    label: "React実践開発",
    accent: "#0e7490",               // ディープシアン
    cover: "/learn/covers/react-practice.svg",
    description: "設計・コンポーネント分割・状態管理・データ取得・テスト・デプロイまで、React で実アプリを作り切る実践コース。",
  },
  "angular-practice": {
    label: "Angular実践開発",
    accent: "#b3122f",               // Angular レッド
    cover: "/learn/covers/angular-practice.svg",
    description: "コンポーネント・DI・RxJS・フォーム・HTTP・テストまで、Angular で本格的な SPA を構築する実践コース。",
  },
  "api-practice": {
    label: "API実践開発",
    accent: "#00add8",               // Go シアン
    cover: "/learn/covers/api-practice.svg",
    description: "Go の net/http と database/sql で、キャラクターデータを返す REST API をゼロから実装。DB 構築・エンドポイント・検索・テスト・PostgreSQL 移行まで作り切る実践コース。",
  },
  "rag-practice": {
    label: "RAG実践開発",
    accent: "#4338ca",               // インディゴ
    cover: "/learn/covers/rag-practice.svg",
    description: "埋め込み・ベクトルDB・検索・再ランキング・生成・評価まで、RAG（検索拡張生成）を実装・運用する実践コース。",
  },
  "vuln-research": {
    label: "脆弱性調査実践",
    accent: "#9d174d",               // クリムゾン
    cover: "/learn/covers/vuln-research.svg",
    description: "許可された範囲で行う偵察・Web 脆弱性の調査・PoC 検証・報告・責任ある開示まで、脆弱性リサーチの実践。",
  },
  "ai-agent-practice": {
    label: "AIエージェント開発実践",
    accent: "#6d28d9",               // バイオレット
    cover: "/learn/covers/ai-agent-practice.svg",
    description: "LangChain / LangGraph を使い、ツール・メモリ・グラフでAIエージェントを設計・構築・評価する実践コース。",
  },
  "devsecops-practice": {
    label: "DevSecOps実践",
    accent: "#15803d",               // グリーン
    cover: "/learn/covers/devsecops-practice.svg",
    description: "CI/CD にセキュリティを組み込む実践。SAST/DAST・サプライチェーン・IaC セキュリティ・ランタイム監視まで。",
  },
};

export const DOMAIN_ORDER: LearnDomain[] = [
  "web", "infra", "security", "mobile", "dev", "claude-code", "it-terms", "ai", "kyopro", "stack",
  "web-adv", "infra-adv", "security-adv", "mobile-adv", "dev-adv", "ai-adv",
  "react-practice", "angular-practice", "api-practice", "rag-practice",
  "vuln-research", "ai-agent-practice", "devsecops-practice",
];

/** 実践コース（プロジェクト型）の一覧。 */
export const PRACTICE_DOMAINS: LearnDomain[] = [
  "react-practice", "angular-practice", "api-practice", "rag-practice",
  "vuln-research", "ai-agent-practice", "devsecops-practice",
];

/** 本番サイト（nico-labo748.dev）で公開するコース。
 *  ここに無いコースは本番では一覧・検索・直リンクすべて非表示になる。
 *  ⚠️ dev サーバーと Vercel の Preview では全コースが見える（執筆中の確認用）。
 *  コースが完成したらこの配列に追加して develop → main へリリースする。 */
export const PUBLISHED_DOMAINS: LearnDomain[] = [
  "web", "security", "it-terms", "dev", "react-practice",
];

/** 本番ドメインかどうか（Preview の *.vercel.app / localhost は false）。 */
const PROD_HOSTS = ["www.nico-labo748.dev", "nico-labo748.dev"];
export const isPublicSite = (): boolean =>
  typeof window !== "undefined" && PROD_HOSTS.includes(window.location.hostname);

/** そのコースを表示してよいか。本番では公開リストのみ、それ以外は全部見せる。 */
export const isDomainVisible = (d: LearnDomain): boolean =>
  !isPublicSite() || PUBLISHED_DOMAINS.includes(d);

/** 表示対象のコース一覧（体系順）。 */
export const getVisibleDomains = (): LearnDomain[] => DOMAIN_ORDER.filter(isDomainVisible);

export interface SectionDef {
  key: string;
  label: string;
  /** MECE 上位グループ（任意）。同一 group の章はまとめて見出し表示される。 */
  group?: string;
}

/** 章（中分類 / section）。配列順がそのまま表示順。 */
export const DOMAIN_SECTIONS: Record<LearnDomain, SectionDef[]> = {
  web: [
    { key: "web-basics", label: "Web/HTTP の基礎" },
    { key: "frontend", label: "フロントエンド" },
    { key: "backend", label: "バックエンド" },
    { key: "api", label: "API 設計" },
    { key: "dev-tools", label: "開発ツール" },
  ],
  infra: [
    { key: "linux", label: "Linux 基礎" },
    { key: "network", label: "ネットワーク" },
    { key: "cloud", label: "クラウド" },
    { key: "container", label: "コンテナ / K8s" },
    { key: "cicd", label: "CI/CD・運用" },
  ],
  security: [
    { key: "sec-basics", label: "基礎概念" },
    { key: "web-sec", label: "Web セキュリティ" },
    { key: "crypto", label: "暗号" },
    { key: "auth", label: "認証 / 認可" },
    { key: "incident", label: "脆弱性管理・インシデント対応" },
  ],
  mobile: [
    { key: "mobile-basics", label: "モバイル開発の基礎" },
    { key: "ios", label: "iOS" },
    { key: "android", label: "Android" },
    { key: "cross-platform", label: "クロスプラットフォーム" },
  ],
  dev: [
    { key: "dev-basics", label: "開発の基礎" },
    { key: "editor-git", label: "エディタ / Git" },
    { key: "testing", label: "テスト" },
    { key: "practices", label: "設計・プラクティス" },
  ],
  "claude-code": [
    { key: "intro", label: "導入" },
    { key: "setup", label: "セットアップ・基本操作" },
    { key: "context", label: "コンテキスト管理" },
    { key: "extend", label: "拡張機能" },
    { key: "advanced", label: "応用ワークフロー" },
  ],
  "it-terms": [
    { key: "intro", label: "はじめに・基本のキ" },
    { key: "jargon", label: "現場の言い回し・スラング" },
    { key: "dev", label: "開発・プログラミング用語" },
    { key: "frontend", label: "フロントエンド・UI用語" },
    { key: "web-net", label: "Web・ネットワーク用語" },
    { key: "infra", label: "インフラ・クラウド・仮想化用語" },
    { key: "data", label: "データ・データベース用語" },
    { key: "algorithm", label: "アルゴリズム・データ構造用語" },
    { key: "ai", label: "AI・機械学習・エージェント用語" },
    { key: "security", label: "セキュリティ用語" },
  ],
  ai: [
    { key: "ai-basics", label: "AI / 機械学習の基礎" },
    { key: "deep-learning", label: "ディープラーニング" },
    { key: "llm", label: "LLM・生成AI" },
    { key: "ai-practice", label: "実践・応用" },
  ],
  kyopro: [
    { key: "cheatsheet", label: "Python / paiza チートシート" },
    { key: "search-basics", label: "探索・データ構造・数論" },
    { key: "graph", label: "グラフ" },
    { key: "shortest-path", label: "最短経路" },
    { key: "dp-flow", label: "DP・フロー" },
  ],
  // MECE で6グループに整理（分類軸を「何を作る→構成層→組み込む機能→データ/AI→動かす基盤→開発運用」に統一）
  stack: [
    // 1. 何を作るか（アプリの形態）
    { key: "web-app", label: "Web アプリ", group: "1. 何を作るか（アプリの形態）" },
    { key: "mobile-app", label: "モバイルアプリ", group: "1. 何を作るか（アプリの形態）" },
    { key: "desktop-app", label: "デスクトップアプリ", group: "1. 何を作るか（アプリの形態）" },
    { key: "extension", label: "拡張機能", group: "1. 何を作るか（アプリの形態）" },
    { key: "game", label: "ゲーム", group: "1. 何を作るか（アプリの形態）" },
    // 2. アプリを構成する層
    { key: "frontend", label: "フロントエンド", group: "2. アプリを構成する層" },
    { key: "backend", label: "バックエンド", group: "2. アプリを構成する層" },
    { key: "database", label: "データベース", group: "2. アプリを構成する層" },
    // 3. 組み込む機能（横断的関心事）
    { key: "auth", label: "認証・認可", group: "3. 組み込む機能" },
    { key: "payment", label: "決済", group: "3. 組み込む機能" },
    { key: "messaging", label: "メッセージング / リアルタイム", group: "3. 組み込む機能" },
    { key: "graphics", label: "3D / グラフィックス", group: "3. 組み込む機能" },
    // 4. データ・AI
    { key: "data-analytics", label: "データ分析 / データ基盤", group: "4. データ・AI" },
    { key: "machine-learning", label: "機械学習", group: "4. データ・AI" },
    { key: "ai-agent", label: "AI エージェント開発", group: "4. データ・AI" },
    // 5. 動かす基盤（インフラ / 実行環境）
    { key: "container", label: "コンテナ（Docker）", group: "5. 動かす基盤" },
    { key: "cloud", label: "クラウド（AWS / Azure / GCP）", group: "5. 動かす基盤" },
    { key: "hosting", label: "ホスティング（Vercel / Render 等）", group: "5. 動かす基盤" },
    { key: "baas-cms", label: "BaaS / ヘッドレス CMS", group: "5. 動かす基盤" },
    // 6. 開発・運用を支える
    { key: "devtools", label: "開発ツール / バージョン管理", group: "6. 開発・運用を支える" },
    { key: "testing", label: "テスト", group: "6. 開発・運用を支える" },
    { key: "cicd", label: "CI/CD・IaC", group: "6. 開発・運用を支える" },
    { key: "observability", label: "監視・可観測性", group: "6. 開発・運用を支える" },
  ],

  // ── 応用コースの章（実践編） ──
  "web-adv": [
    { key: "fe-architecture", label: "大規模フロントエンド設計" },
    { key: "state-management", label: "状態管理" },
    { key: "web-performance", label: "パフォーマンス最適化" },
    { key: "realtime", label: "リアルタイム通信" },
    { key: "fe-testing", label: "フロントエンドのテスト" },
  ],
  "infra-adv": [
    { key: "iac", label: "IaC（Terraform 等）" },
    { key: "k8s-ops", label: "Kubernetes 運用" },
    { key: "observability", label: "監視・可観測性" },
    { key: "sre", label: "SRE・信頼性" },
    { key: "cost-opt", label: "コスト最適化" },
  ],
  "security-adv": [
    { key: "pentest", label: "ペネトレーションテスト" },
    { key: "appsec", label: "アプリケーションセキュリティ" },
    { key: "cloud-sec", label: "クラウドセキュリティ" },
    { key: "crypto-practice", label: "実践暗号" },
    { key: "incident-adv", label: "高度なインシデント対応" },
  ],
  "mobile-adv": [
    { key: "native-adv", label: "ネイティブ実践" },
    { key: "cross-adv", label: "クロスプラットフォーム実践" },
    { key: "mobile-perf", label: "パフォーマンス" },
    { key: "release-ops", label: "配信・運用" },
  ],
  "dev-adv": [
    { key: "architecture", label: "アーキテクチャ設計" },
    { key: "cicd-adv", label: "CI/CD" },
    { key: "refactoring", label: "リファクタリング" },
    { key: "team-dev", label: "チーム開発" },
  ],
  "ai-adv": [
    { key: "ml-practice", label: "機械学習の実践" },
    { key: "llm-app", label: "LLM アプリ開発" },
    { key: "rag", label: "RAG・検索拡張" },
    { key: "mlops", label: "MLOps" },
  ],

  // ── 実践コース（プロジェクト型）の章 ──
  "react-practice": [
    { key: "setup", label: "環境構築とプロジェクト設計" },
    { key: "components", label: "コンポーネント設計" },
    { key: "state-routing", label: "状態管理とルーティング" },
    { key: "data-fetching", label: "データ取得と API 連携" },
    { key: "testing-deploy", label: "テストとデプロイ" },
  ],
  "angular-practice": [
    { key: "setup", label: "環境構築とプロジェクト設計" },
    { key: "components-di", label: "コンポーネントと DI" },
    { key: "routing", label: "ルーティング" },
    { key: "rxjs-state", label: "RxJS と状態管理" },
    { key: "forms-http", label: "フォームと HTTP" },
    { key: "testing-deploy", label: "テストとデプロイ" },
  ],
  "api-practice": [
    { key: "setup", label: "環境構築とプロジェクト設計" },
    { key: "database", label: "データベース構築" },
    { key: "server", label: "HTTP サーバと DB 接続" },
    { key: "endpoints", label: "API エンドポイント実装" },
    { key: "quality", label: "品質・運用・デプロイ" },
  ],
  "rag-practice": [
    { key: "rag-basics", label: "RAG の仕組み" },
    { key: "embeddings", label: "埋め込みとベクトルDB" },
    { key: "retrieval", label: "検索と再ランキング" },
    { key: "generation", label: "生成と評価" },
    { key: "rag-ops", label: "運用・改善" },
  ],
  "vuln-research": [
    { key: "recon", label: "偵察・情報収集" },
    { key: "web-vuln-hunt", label: "Web 脆弱性の調査" },
    { key: "poc", label: "PoC 検証" },
    { key: "reporting", label: "報告・トリアージ" },
    { key: "disclosure", label: "責任ある開示" },
  ],
  "ai-agent-practice": [
    { key: "agent-basics", label: "エージェントの基礎" },
    { key: "langchain", label: "LangChain" },
    { key: "langgraph", label: "LangGraph" },
    { key: "tools-memory", label: "ツールとメモリ" },
    { key: "agent-ops", label: "評価・運用" },
  ],
  "devsecops-practice": [
    { key: "secure-pipeline", label: "セキュアな CI/CD パイプライン" },
    { key: "sast-dast", label: "SAST / DAST" },
    { key: "supply-chain", label: "サプライチェーンセキュリティ" },
    { key: "iac-security", label: "IaC セキュリティ" },
    { key: "runtime", label: "ランタイム監視" },
  ],
};

export interface LevelStyle {
  label: string;
  color: string;
}

export const LEVEL_STYLES: Record<LearnLevel, LevelStyle> = {
  intro: { label: "入門", color: "#5ad17e" },   // グリーン
  basic: { label: "基礎", color: "#5c9dff" },    // ブルー
  practice: { label: "実践", color: "#ff5c8a" }, // マゼンタ
};

/** 分野キーが有効か。 */
export const isLearnDomain = (v: string | undefined): v is LearnDomain =>
  !!v && (DOMAIN_ORDER as string[]).includes(v);

/** 応用コース（*-adv）かどうか。 */
export const isAdvancedDomain = (d: LearnDomain): boolean => d.endsWith("-adv");

/** 実践コース（プロジェクト型）かどうか。 */
export const isPracticeDomain = (d: LearnDomain): boolean =>
  (PRACTICE_DOMAINS as string[]).includes(d);

/** 章キー → ラベル（未知はキーをそのまま返す）。 */
export const getSectionLabel = (domain: LearnDomain, sectionKey: string): string =>
  DOMAIN_SECTIONS[domain]?.find((s) => s.key === sectionKey)?.label ?? sectionKey;

/** 章キー → MECE 上位グループ名（未設定は undefined）。 */
export const getSectionGroup = (domain: LearnDomain, sectionKey: string): string | undefined =>
  DOMAIN_SECTIONS[domain]?.find((s) => s.key === sectionKey)?.group;

/** 章キー → 章の並び順（未定義章は末尾）。 */
export const getSectionOrder = (domain: LearnDomain, sectionKey: string): number => {
  const idx = DOMAIN_SECTIONS[domain]?.findIndex((s) => s.key === sectionKey) ?? -1;
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
};

export const getLevelStyle = (level: LearnLevel): LevelStyle =>
  LEVEL_STYLES[level] ?? LEVEL_STYLES.basic;
