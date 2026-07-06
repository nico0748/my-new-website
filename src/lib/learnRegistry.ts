/** 教材記事の自動索引レジストリ。
 *  src/content/learn/<domain>/<id>.tsx を Vite の import.meta.glob で走査し、
 *  各ファイルの `export const meta`（一覧・並び順用）と default export（本文コンポーネント）を集約する。
 *
 *  記事を増やすときは content/learn 配下に TSX を1つ足すだけ。ここは編集不要。 */

import type { ComponentType } from "react";
import type { LearnDomain, LearnMeta } from "./learnCategories";
import { getSectionOrder } from "./learnCategories";

// メタは eager（一覧・分野ページで即使うため）
const metaModules = import.meta.glob<LearnMeta>("../content/learn/**/*.tsx", {
  eager: true,
  import: "meta",
});

// 本文コンポーネントは lazy（詳細ページで React.lazy に渡す）
type CompModule = { default: ComponentType };
const compModules = import.meta.glob<CompModule>("../content/learn/**/*.tsx");

export interface LearnEntry {
  meta: LearnMeta;
  /** React.lazy に渡せる loader */
  load: () => Promise<CompModule>;
}

const buildEntries = (): LearnEntry[] => {
  const entries: LearnEntry[] = [];
  for (const [path, meta] of Object.entries(metaModules)) {
    if (!meta || !meta.id) {
      // meta export が無いファイルはスキップ（開発時の警告）
      if (import.meta.env.DEV) console.warn(`[learn] meta export が見つかりません: ${path}`);
      continue;
    }
    const load = compModules[path];
    if (!load) continue;
    entries.push({ meta, load });
  }
  return entries;
};

/** 全記事エントリ（順序未整列）。 */
export const LEARN_ENTRIES: LearnEntry[] = buildEntries();

/** 体系順ソート: 章の順 → 章内 order → title。 */
const byCurriculum = (a: LearnMeta, b: LearnMeta): number => {
  const sa = getSectionOrder(a.domain, a.section);
  const sb = getSectionOrder(b.domain, b.section);
  if (sa !== sb) return sa - sb;
  if (a.order !== b.order) return a.order - b.order;
  return a.title.localeCompare(b.title, "ja");
};

/** 分野の記事を体系順で返す。 */
export const getEntriesByDomain = (domain: LearnDomain): LearnEntry[] =>
  LEARN_ENTRIES.filter((e) => e.meta.domain === domain).sort((x, y) =>
    byCurriculum(x.meta, y.meta)
  );

/** 分野内の記事を章キーでグルーピング（章は定義順、記事は体系順）。 */
export const getSectionedEntries = (
  domain: LearnDomain
): { section: string; entries: LearnEntry[] }[] => {
  const list = getEntriesByDomain(domain);
  const groups: { section: string; entries: LearnEntry[] }[] = [];
  for (const entry of list) {
    const last = groups[groups.length - 1];
    if (last && last.section === entry.meta.section) last.entries.push(entry);
    else groups.push({ section: entry.meta.section, entries: [entry] });
  }
  return groups;
};

/** 分野＋id で1件取得。 */
export const getEntry = (domain: string, id: string): LearnEntry | undefined =>
  LEARN_ENTRIES.find((e) => e.meta.domain === domain && e.meta.id === id);

/** 分野内の前後記事（体系順）。詳細ページのナビ用。 */
export const getAdjacent = (
  domain: LearnDomain,
  id: string
): { prev?: LearnMeta; next?: LearnMeta } => {
  const list = getEntriesByDomain(domain);
  const idx = list.findIndex((e) => e.meta.id === id);
  if (idx === -1) return {};
  return {
    prev: idx > 0 ? list[idx - 1].meta : undefined,
    next: idx < list.length - 1 ? list[idx + 1].meta : undefined,
  };
};

/** 分野ごとの記事数。トップの分野カード用。 */
export const getDomainCount = (domain: LearnDomain): number =>
  LEARN_ENTRIES.filter((e) => e.meta.domain === domain).length;
