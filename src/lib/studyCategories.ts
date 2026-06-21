/** Study カテゴリの表示ラベル・アクセント色・絵文字。
 *  ダーク・ターミナルテーマのパレットに準拠。未知カテゴリは other にフォールバック。
 *  新しいカテゴリを増やすときはここに追加する。 */

export interface StudyCategoryStyle {
  label: string;
  color: string;
  emoji: string;
}

const CATEGORY_STYLES: Record<string, StudyCategoryStyle> = {
  language:  { label: "言語",       color: "#00e5cc", emoji: "📝" }, // シアン（メインアクセント）
  framework: { label: "FW/ライブラリ", color: "#5c9dff", emoji: "🧱" }, // ブルー
  cs:        { label: "CS基礎",     color: "#a78bfa", emoji: "🧠" }, // パープル
  security:  { label: "セキュリティ", color: "#ff5c8a", emoji: "🛡️" }, // マゼンタ
  infra:     { label: "インフラ",   color: "#ffb454", emoji: "☁️" }, // アンバー
  book:      { label: "書籍",       color: "#5ad17e", emoji: "📚" }, // グリーン
  other:     { label: "Other",      color: "#8a96a3", emoji: "📌" }, // グレー
};

/** カテゴリ文字列から表示スタイルを返す。未知なら other スタイル＋原文ラベル。 */
export const getStudyCategoryStyle = (category: string): StudyCategoryStyle => {
  const key = category.trim().toLowerCase();
  if (CATEGORY_STYLES[key]) return CATEGORY_STYLES[key];
  return { ...CATEGORY_STYLES.other, label: category || CATEGORY_STYLES.other.label };
};
