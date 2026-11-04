import { fetchSheetData } from "./googleSheets";
import type { SheetRow } from "./googleSheets";
import { mapAnimeWorks } from "./dataMapper";
import type { AnimeWork } from "./dataMapper";

/**
 * アニメの視聴記録（Annict から 6 時間ごとに同期しているシート）。
 * 「見てる」と「見た」をまとめ、放送クールの新しい順に並べる。取得はアプリ全体で 1 回（モジュール内キャッシュ）。
 */
const WATCHING_SHEET = "all-watching-anime";
const WATCHED_SHEET = "all-watched-anime";

let cache: AnimeWork[] | null = null;
let pending: Promise<AnimeWork[]> | null = null;

export const getCachedAnime = (): AnimeWork[] | null => cache;

export const fetchAnime = (): Promise<AnimeWork[]> => {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = Promise.all([fetchSheetData<SheetRow>(WATCHING_SHEET), fetchSheetData<SheetRow>(WATCHED_SHEET)])
      .then(([watching, watched]) => {
        cache = mapAnimeWorks(watching, watched);
        return cache;
      })
      .catch(() => {
        pending = null;
        return [];
      });
  }
  return pending;
};
