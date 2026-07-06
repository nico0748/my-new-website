/** /learn 教材の分野・章・レベルの定義とスタイル。
 *  ダーク・ターミナルテーマのパレット（CSS 変数）に準拠。
 *  記事メタは各 TSX に同居（src/content/learn/<domain>/<id>.tsx の `meta`）。
 *  分野・章を増やすときはここに追加する。 */

/** 分野（大分類 / domain）。URL は /learn/<domain>。 */
export type LearnDomain = "web" | "infra" | "security";

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
    label: "Web",
    accent: "#22b0a0",               // ティール
    cover: "/learn/covers/web.svg",
    description: "HTTP/DNS の基礎からフロントエンド・バックエンド・API 設計まで、Web の土台を体系立てて学びます。",
  },
  infra: {
    label: "インフラ",
    accent: "#e6a532",               // アンバー
    cover: "/learn/covers/infra.svg",
    description: "Linux・ネットワーク・クラウド・コンテナ・CI/CD。サーバー運用を支える基盤技術を扱います。",
  },
  security: {
    label: "セキュリティ",
    accent: "#f0637e",               // ピンク
    cover: "/learn/covers/security.svg",
    description: "Web セキュリティ・認証認可・暗号・脆弱性対応。安全なシステムを作るための考え方を学びます。",
  },
};

export const DOMAIN_ORDER: LearnDomain[] = ["web", "infra", "security"];

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
