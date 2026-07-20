/** 経験録（筆者の実務経験・体験の記録）のカテゴリ定義と型。
 *  教材（Learn）と同じく記事は TSX で src/content/experience/<id>.tsx に置く。
 *  ただし教材が「体系順のストック型」なのに対し、経験録は「日付順のフロー型」。 */

/** 経験録のカテゴリ。 */
export type ExperienceCategory =
  | "internship"
  | "project"
  | "study"
  | "career"
  | "other";

export interface ExperienceCategoryStyle {
  label: string;
  /** バッジの文字色 */
  color: string;
  /** バッジの背景色 */
  bg: string;
}

export const EXPERIENCE_CATEGORY_STYLES: Record<ExperienceCategory, ExperienceCategoryStyle> = {
  internship: { label: "インターン", color: "#b03a5b", bg: "#fbeaf0" },
  project: { label: "個人開発", color: "#0f6e56", bg: "#e1f5ee" },
  study: { label: "学習", color: "#185fa5", bg: "#e6f1fb" },
  career: { label: "キャリア", color: "#854f0b", bg: "#faeeda" },
  other: { label: "その他", color: "#5f5e5a", bg: "#f1efe8" },
};

/** 未知のカテゴリ文字列は other 扱いにして落とさない。 */
export const getExperienceCategoryStyle = (c: string): ExperienceCategoryStyle =>
  EXPERIENCE_CATEGORY_STYLES[c as ExperienceCategory] ?? EXPERIENCE_CATEGORY_STYLES.other;

/** 各記事 TSX が named export するメタ情報。 */
export interface ExperienceMeta {
  /** URL スラッグ（一意）。/nicotech/experience/<id> */
  id: string;
  title: string;
  description: string;
  category: ExperienceCategory | string;
  /** 公開日 YYYY-MM-DD（新しい順に並べる） */
  date: string;
  tags: string[];
  /** 目安の所要時間（分・任意） */
  minutes?: number;
}
