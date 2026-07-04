/** Topics カテゴリの表示ラベル・アクセント色・絵文字。
 *  ダーク・ターミナルテーマのパレットに準拠。未知カテゴリは other にフォールバック。 */

export interface TopicCategoryStyle {
  label: string;
  color: string;
  emoji: string;
}

const CATEGORY_STYLES: Record<string, TopicCategoryStyle> = {
  news:  { label: "News",   color: "#00e5cc", emoji: "📰" }, // シアン（メインアクセント）
  cve:   { label: "CVE",    color: "#ff5c8a", emoji: "🛡️" }, // マゼンタ
  vuln:  { label: "脆弱性", color: "#ffb454", emoji: "⚠️" }, // アンバー
  daily: { label: "1日1題", color: "#5ad17e", emoji: "🧩" }, // グリーン
  it:    { label: "IT",     color: "#5c9dff", emoji: "💻" }, // ブルー
  frontend: { label: "Frontend", color: "#00e5cc", emoji: "🎨" }, // シアン
  backend:  { label: "Backend",  color: "#ffb454", emoji: "⚙️" }, // アンバー
  ai:       { label: "AI",       color: "#a78bfa", emoji: "🤖" }, // パープル
  other: { label: "Other",  color: "#8a96a3", emoji: "📌" }, // グレー
};

/** カテゴリ文字列から表示スタイルを返す。未知なら other スタイル＋原文ラベル。 */
export const getTopicCategoryStyle = (category: string): TopicCategoryStyle => {
  const key = category.trim().toLowerCase();
  if (CATEGORY_STYLES[key]) return CATEGORY_STYLES[key];
  return { ...CATEGORY_STYLES.other, label: category || CATEGORY_STYLES.other.label };
};
