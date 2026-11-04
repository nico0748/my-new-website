import { fetchSheetData } from "./googleSheets";
import type { SheetRow } from "./googleSheets";
import { mapAnimeRows, sortAnime } from "./dataMapper";
import type { AnimeStatus, AnimeWork } from "./dataMapper";

/**
 * アニメの視聴記録（Annict から 6 時間ごとに同期しているシート）。
 * 状態（見てる / 見た / 見たい）ごとに 1 枚のシートがあり、取得はシートごとにアプリ全体で 1 回（モジュール内キャッシュ）。
 * 一覧ページのポップアップがトップから来たときにも最初の描画で出せるようにするため（View Transition のモーフに必要）。
 */
export const ANIME_STATUSES: readonly AnimeStatus[] = ["watching", "watched", "wanna"];

export const ANIME_STATUS_LABEL: Record<AnimeStatus, string> = {
  watching: "見てる",
  watched: "見た",
  wanna: "見たい",
};

const SHEET: Record<AnimeStatus, string> = {
  watching: "all-watching-anime",
  watched: "all-watched-anime",
  wanna: "all-wanna-watch-anime",
};

const cache: Partial<Record<AnimeStatus, AnimeWork[]>> = {};
const pending: Partial<Record<AnimeStatus, Promise<AnimeWork[]>>> = {};

export const getCachedAnimeList = (status: AnimeStatus): AnimeWork[] | null => cache[status] ?? null;

export const fetchAnimeList = (status: AnimeStatus): Promise<AnimeWork[]> => {
  const hit = cache[status];
  if (hit) return Promise.resolve(hit);
  pending[status] ??= fetchSheetData<SheetRow>(SHEET[status])
    .then((rows) => (cache[status] = mapAnimeRows(rows, status)))
    .catch(() => {
      delete pending[status];
      return [];
    });
  return pending[status];
};

/** トップの OFF-HOURS 用: 「見てる」と「見た」をまとめて放送クールの新しい順に（同じ作品は「見てる」を優先）。 */
const mergeSeen = (watching: AnimeWork[], watched: AnimeWork[]): AnimeWork[] => {
  const ids = new Set(watching.map((w) => w.id));
  return sortAnime([...watching, ...watched.filter((w) => !ids.has(w.id))]);
};

export const getCachedAnime = (): AnimeWork[] | null => {
  const watching = getCachedAnimeList("watching");
  const watched = getCachedAnimeList("watched");
  return watching && watched ? mergeSeen(watching, watched) : null;
};

export const fetchAnime = (): Promise<AnimeWork[]> =>
  Promise.all([fetchAnimeList("watching"), fetchAnimeList("watched")]).then(([a, b]) => mergeSeen(a, b));

/** 一覧のカードとポップアップで一致させる view-transition-name。 */
export const animeVtName = (part: "img" | "title", id: string) =>
  `anime-${part}-${String(id).replace(/[^\w-]/g, "-")}`;

/** 作品のポップアップを開く URL。 */
export const animeHref = (w: Pick<AnimeWork, "id" | "status">) => `/anime?tab=${w.status}&id=${encodeURIComponent(w.id)}`;

export const annictWorkUrl = (id: string) => `https://annict.com/works/${encodeURIComponent(id)}`;

export const isAnimeStatus = (v: string | null): v is AnimeStatus =>
  v === "watching" || v === "watched" || v === "wanna";
