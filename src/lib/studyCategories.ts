/** Study カテゴリの表示ラベル・アクセント色・アイコン。
 *  ダーク・ターミナルテーマのパレットに準拠。未知カテゴリは other にフォールバック。
 *  新しいカテゴリを増やすときはここに追加する。
 *  ⚠️ 絵文字は使わない。記号は CategoryIcon のピクトグラムで表す。 */

import type { CategoryIconName } from "../components/ui/CategoryIcon";

export interface StudyCategoryStyle {
  label: string;
  color: string;
  icon: CategoryIconName;
}

const CATEGORY_STYLES: Record<string, StudyCategoryStyle> = {
  language:  { label: "言語",          color: "#00e5cc", icon: "pencil" }, // シアン
  framework: { label: "FW/ライブラリ", color: "#5c9dff", icon: "blocks" }, // ブルー
  cs:        { label: "CS基礎",        color: "#a78bfa", icon: "brain" },  // パープル
  security:  { label: "セキュリティ",  color: "#ff5c8a", icon: "shield" }, // マゼンタ
  infra:     { label: "インフラ",      color: "#ffb454", icon: "cloud" },  // アンバー
  book:      { label: "書籍",          color: "#5ad17e", icon: "book" },   // グリーン
  other:     { label: "Other",         color: "#8a96a3", icon: "pin" },    // グレー
};

/** カテゴリ文字列から表示スタイルを返す。未知なら other スタイル＋原文ラベル。 */
export const getStudyCategoryStyle = (category: string): StudyCategoryStyle => {
  const key = category.trim().toLowerCase();
  if (CATEGORY_STYLES[key]) return CATEGORY_STYLES[key];
  return { ...CATEGORY_STYLES.other, label: category || CATEGORY_STYLES.other.label };
};
