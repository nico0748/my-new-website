import { fetchSheetData } from "./googleSheets";
import type { SheetRow } from "./googleSheets";
import { mapPortfolioData } from "./dataMapper";
import type { PortfolioItem } from "./dataMapper";

/**
 * Projects シートの取得をアプリ全体で 1 回にまとめる。
 *
 * 一覧 → 詳細の遷移で、詳細ページが「読み込み中」を挟まずに同じ画像とタイトルを
 * 描画できるようにするため（View Transition は遷移直後の DOM で共有要素を探すので、
 * 非同期で後から出てきた要素はモーフの対象にならない）。
 */
let cache: PortfolioItem[] | null = null;
let pending: Promise<PortfolioItem[]> | null = null;

export const getCachedProjects = (): PortfolioItem[] | null => cache;

export const fetchProjects = (): Promise<PortfolioItem[]> => {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = fetchSheetData<SheetRow>("Projects")
      .then((rows) => {
        cache = rows.length > 0 ? mapPortfolioData(rows) : [];
        return cache;
      })
      .catch(() => {
        pending = null;
        return [];
      });
  }
  return pending;
};

/** 一覧カードと詳細ページで一致させる view-transition-name。 */
export const projectVtName = (part: "img" | "title", id: string) =>
  `project-${part}-${String(id).replace(/[^\w-]/g, "-")}`;
