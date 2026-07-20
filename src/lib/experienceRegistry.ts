/** 経験録記事の自動索引レジストリ。
 *  src/content/experience/<id>.tsx を Vite の import.meta.glob で走査し、
 *  各ファイルの `export const meta` と default export（本文コンポーネント）を集約する。
 *
 *  記事を増やすときは content/experience 配下に TSX を1つ足すだけ。ここは編集不要。 */

import type { ComponentType } from "react";
import type { ExperienceMeta } from "./experienceCategories";

// メタは eager（一覧で即使うため）
const metaModules = import.meta.glob<ExperienceMeta>("../content/experience/**/*.tsx", {
  eager: true,
  import: "meta",
});

// 本文コンポーネントは lazy（詳細ページで React.lazy に渡す）
type CompModule = { default: ComponentType };
const compModules = import.meta.glob<CompModule>("../content/experience/**/*.tsx");

export interface ExperienceEntry {
  meta: ExperienceMeta;
  /** React.lazy に渡せる loader */
  load: () => Promise<CompModule>;
}

const buildEntries = (): ExperienceEntry[] => {
  const entries: ExperienceEntry[] = [];
  for (const [path, meta] of Object.entries(metaModules)) {
    if (!meta || !meta.id) {
      if (import.meta.env.DEV) console.warn(`[experience] meta export が見つかりません: ${path}`);
      continue;
    }
    const load = compModules[path];
    if (!load) continue;
    entries.push({ meta, load });
  }
  // 新しい順（フロー型）。同日は title 昇順で安定させる
  return entries.sort((a, b) => {
    if (a.meta.date !== b.meta.date) return a.meta.date < b.meta.date ? 1 : -1;
    return a.meta.title.localeCompare(b.meta.title, "ja");
  });
};

/** 全記事エントリ（新しい順）。 */
export const EXPERIENCE_ENTRIES: ExperienceEntry[] = buildEntries();

/** id で1件取得。 */
export const getExperienceEntry = (id: string): ExperienceEntry | undefined =>
  EXPERIENCE_ENTRIES.find((e) => e.meta.id === id);

/** 前後記事（新しい順の並びに沿う）。詳細ページのナビ用。 */
export const getExperienceAdjacent = (
  id: string
): { prev?: ExperienceMeta; next?: ExperienceMeta } => {
  const idx = EXPERIENCE_ENTRIES.findIndex((e) => e.meta.id === id);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? EXPERIENCE_ENTRIES[idx - 1].meta : undefined,
    next: idx < EXPERIENCE_ENTRIES.length - 1 ? EXPERIENCE_ENTRIES[idx + 1].meta : undefined,
  };
};
