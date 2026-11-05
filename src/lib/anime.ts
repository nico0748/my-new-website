import { fetchSheetData } from "./googleSheets";
import type { SheetRow } from "./googleSheets";
import { mapAnimeRows, parseSeason, sortAnime } from "./dataMapper";
import type { AnimeSeasonKey, AnimeStatus, AnimeWork } from "./dataMapper";

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

/** 一覧ページのタブ。お気に入りは「見てる」「見た」でチェックを付けた作品。 */
export type AnimeTab = AnimeStatus | "favorite";

export const ANIME_TABS: readonly AnimeTab[] = ["favorite", ...ANIME_STATUSES];

export const ANIME_TAB_LABEL: Record<AnimeTab, string> = { favorite: "お気に入り", ...ANIME_STATUS_LABEL };

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

/** 「見てる」と「見た」をまとめて放送クールの新しい順に（同じ作品は「見てる」を優先）。 */
const mergeSeen = (watching: AnimeWork[], watched: AnimeWork[]): AnimeWork[] => {
  const ids = new Set(watching.map((w) => w.id));
  return sortAnime([...watching, ...watched.filter((w) => !ids.has(w.id))]);
};

/** お気に入り（「見てる」「見た」のシートで isFavorite にチェックを付けた作品）。放送クールの新しい順。 */
export const pickFavorites = (watching: AnimeWork[], watched: AnimeWork[]): AnimeWork[] =>
  mergeSeen(watching, watched).filter((w) => w.favorite);

/**
 * トップの OFF-HOURS に出すアニメ。お気に入りが 1 件でもあればお気に入りだけ、
 * 無ければ「見てる」「見た」を放送クールの新しい順に。
 */
export interface TopAnime {
  works: AnimeWork[];
  favorites: boolean;
}

const toTopAnime = (watching: AnimeWork[], watched: AnimeWork[]): TopAnime => {
  const seen = mergeSeen(watching, watched);
  const favorites = seen.filter((w) => w.favorite);
  return favorites.length > 0 ? { works: favorites, favorites: true } : { works: seen, favorites: false };
};

export const getCachedTopAnime = (): TopAnime | null => {
  const watching = getCachedAnimeList("watching");
  const watched = getCachedAnimeList("watched");
  return watching && watched ? toTopAnime(watching, watched) : null;
};

export const fetchTopAnime = (): Promise<TopAnime> =>
  Promise.all([fetchAnimeList("watching"), fetchAnimeList("watched")]).then(([a, b]) => toTopAnime(a, b));

/** 一覧のカードとポップアップで一致させる view-transition-name。 */
export const animeVtName = (part: "img" | "title", id: string) => `anime-${part}-${String(id).replace(/[^\w-]/g, "-")}`;

/** 作品のポップアップを開く URL（閉じたときに出すタブ。既定はその作品の状態のタブ）。 */
export const animeHref = (w: Pick<AnimeWork, "id" | "status">, tab: AnimeTab = w.status) =>
  `/anime?tab=${tab}&id=${encodeURIComponent(w.id)}`;

export const annictWorkUrl = (id: string) => `https://annict.com/works/${encodeURIComponent(id)}`;

export const isAnimeStatus = (v: string | null): v is AnimeStatus =>
  v === "watching" || v === "watched" || v === "wanna";

export const isAnimeTab = (v: string | null): v is AnimeTab => v === "favorite" || isAnimeStatus(v);

// --- 放送時期の絞り込み（一覧ページの ?season=） ---------------------------------

/** 年だけ（その年のすべての季節）か、年と季節。 */
export interface SeasonFilter {
  year: number;
  season?: AnimeSeasonKey;
}

/** ?season= の値: "2024-winter"（年と季節。Annict の season_name と同じ書き方）か "2024"（年だけ）。 */
export const parseSeasonParam = (v: string | null): SeasonFilter | null => {
  const m = /^(\d{4})(?:-(winter|spring|summer|autumn))?$/.exec(v ?? "");
  if (!m) return null;
  return m[2] ? { year: Number(m[1]), season: m[2] as AnimeSeasonKey } : { year: Number(m[1]) };
};

export const toSeasonParam = (f: SeasonFilter | null): string | null =>
  f ? (f.season ? `${f.year}-${f.season}` : String(f.year)) : null;

export const matchesSeason = (w: AnimeWork, f: SeasonFilter | null): boolean => {
  if (!f) return true;
  const p = parseSeason(w.season);
  return !!p && p.year === f.year && (!f.season || p.season === f.season);
};
