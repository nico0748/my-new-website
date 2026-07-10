/** /learn 教材の分野・章・レベルの定義とスタイル。
 *  ダーク・ターミナルテーマのパレット（CSS 変数）に準拠。
 *  記事メタは各 TSX に同居（src/content/learn/<domain>/<id>.tsx の `meta`）。
 *  分野・章を増やすときはここに追加する。 */

/** 分野（大分類 / domain）。URL は /nicotech/<domain>。
 *  基礎コース（*）／応用コース（*-adv）／実践コース（プロジェクト型）。 */
export type LearnDomain =
  | "web" | "infra" | "security" | "mobile" | "dev" | "cs" | "ai" | "stack"
  | "web-adv" | "infra-adv" | "security-adv" | "mobile-adv" | "dev-adv" | "cs-adv" | "ai-adv"
  | "react-practice" | "angular-practice" | "rag-practice"
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
  cs: {
    label: "CS基礎",
    accent: "#0ea5e9",               // スカイ
    cover: "/learn/covers/cs.svg",
    description: "アルゴリズム・OS・ネットワーク・データベース・計算理論。情報科学の土台を体系的に。",
  },
  ai: {
    label: "AI基礎",
    accent: "#f97316",               // オレンジ
    cover: "/learn/covers/ai.svg",
    description: "機械学習・ディープラーニング・LLM/生成AI。AI を理解し使いこなすための基礎。",
  },
  stack: {
    label: "技術スタック一覧",
    accent: "#4f46e5",               // インディゴ
    cover: "/learn/covers/stack.svg",
    description: "Web・モバイル・デスクトップ・拡張機能から、フロント/バック/DB/コンテナ/クラウドまで。分野ごとに代表的な技術スタックを俯瞰し、何を選べばよいかの地図にします。",
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
  "cs-adv": {
    label: "CS応用",
    accent: "#4c5a70",               // 濃グレーブルー
    cover: "/learn/covers/cs-advanced.svg",
    description: "高度なアルゴリズム・分散システム・コンパイラ・DB 内部。情報科学を一段深く掘り下げます。",
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
  "web", "infra", "security", "mobile", "dev", "cs", "ai", "stack",
  "web-adv", "infra-adv", "security-adv", "mobile-adv", "dev-adv", "cs-adv", "ai-adv",
  "react-practice", "angular-practice", "rag-practice",
  "vuln-research", "ai-agent-practice", "devsecops-practice",
];

/** 実践コース（プロジェクト型）の一覧。 */
export const PRACTICE_DOMAINS: LearnDomain[] = [
  "react-practice", "angular-practice", "rag-practice",
  "vuln-research", "ai-agent-practice", "devsecops-practice",
];

export interface SectionDef {
  key: string;
  label: string;
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
    { key: "claude-code", label: "Claude Code" },
    { key: "editor-git", label: "エディタ / Git" },
    { key: "testing", label: "テスト" },
    { key: "practices", label: "設計・プラクティス" },
  ],
  cs: [
    { key: "algorithms", label: "アルゴリズムとデータ構造" },
    { key: "os", label: "オペレーティングシステム" },
    { key: "network-cs", label: "ネットワーク" },
    { key: "database", label: "データベース" },
    { key: "theory", label: "計算理論" },
  ],
  ai: [
    { key: "ai-basics", label: "AI / 機械学習の基礎" },
    { key: "deep-learning", label: "ディープラーニング" },
    { key: "llm", label: "LLM・生成AI" },
    { key: "ai-practice", label: "実践・応用" },
  ],
  stack: [
    { key: "web-app", label: "Web アプリケーション開発" },
    { key: "mobile-app", label: "モバイルアプリケーション開発" },
    { key: "desktop-app", label: "デスクトップアプリ開発" },
    { key: "extension", label: "拡張機能開発" },
    { key: "frontend", label: "フロントエンド" },
    { key: "backend", label: "バックエンド" },
    { key: "database", label: "データベース" },
    { key: "container", label: "Docker / コンテナ" },
    { key: "cloud", label: "クラウド" },
    { key: "ai-agent", label: "AIエージェント開発" },
    { key: "machine-learning", label: "機械学習" },
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
  "cs-adv": [
    { key: "advanced-algorithms", label: "高度なアルゴリズム" },
    { key: "distributed-systems", label: "分散システム" },
    { key: "compilers", label: "コンパイラ" },
    { key: "db-internals", label: "データベース内部" },
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

/** 章キー → 章の並び順（未定義章は末尾）。 */
export const getSectionOrder = (domain: LearnDomain, sectionKey: string): number => {
  const idx = DOMAIN_SECTIONS[domain]?.findIndex((s) => s.key === sectionKey) ?? -1;
  return idx === -1 ? Number.MAX_SAFE_INTEGER : idx;
};

export const getLevelStyle = (level: LearnLevel): LevelStyle =>
  LEVEL_STYLES[level] ?? LEVEL_STYLES.basic;
