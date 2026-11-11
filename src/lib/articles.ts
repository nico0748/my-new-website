import { fetchSheetData } from "./googleSheets";
import type { SheetRow } from "./googleSheets";
import { mapArticleData } from "./dataMapper";
import type { ArticleItem } from "./dataMapper";

/** 記事を取得する Qiita のユーザー名。 */
export const QIITA_USER = "nico0748";
export const QIITA_PROFILE_URL = `https://qiita.com/${QIITA_USER}`;

interface QiitaItem {
  id: string;
  title: string;
  url: string;
  created_at: string;
  likes_count?: number;
  tags?: { name: string }[];
  private?: boolean;
}

/** Qiita API v2 から公開記事を取得（CORS 対応・未認証は 60req/h/IP）。 */
const fetchQiitaArticles = async (): Promise<ArticleItem[]> => {
  const res = await fetch(`https://qiita.com/api/v2/users/${QIITA_USER}/items?per_page=100`);
  if (!res.ok) throw new Error(`Qiita API: ${res.status}`);
  const items = (await res.json()) as QiitaItem[];
  return items
    .filter((i) => !i.private)
    .map((i) => ({
      id: `qiita-${i.id}`,
      title: i.title,
      url: i.url,
      platform: "Qiita",
      date: i.created_at.slice(0, 10),
      tags: (i.tags ?? []).map((t) => t.name),
      likes: i.likes_count,
    }));
};

/** 任意の「Articles」シート（Zenn / note など Qiita 以外の記事を手動で載せる用）。 */
const fetchSheetArticles = async (): Promise<ArticleItem[]> => {
  const rows = await fetchSheetData<SheetRow>("Articles");
  return mapArticleData(rows);
};

const CACHE_KEY = "nico:articles:v1";
const CACHE_TTL = 1000 * 60 * 30; // 30 分（Qiita の未認証レート制限対策）

const readCache = (): ArticleItem[] | null => {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { at, items } = JSON.parse(raw) as { at: number; items: ArticleItem[] };
    return Date.now() - at < CACHE_TTL ? items : null;
  } catch {
    return null;
  }
};

const writeCache = (items: ArticleItem[]) => {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), items }));
  } catch {
    // storage が使えない環境では何もしない
  }
};

/** Qiita + Articles シートを統合し、新しい順に返す。片方が失敗しても他方は表示する。 */
export const fetchArticles = async (): Promise<ArticleItem[]> => {
  const cached = readCache();
  if (cached) return cached;

  const [qiita, sheet] = await Promise.allSettled([fetchQiitaArticles(), fetchSheetArticles()]);
  const items = [
    ...(qiita.status === "fulfilled" ? qiita.value : []),
    ...(sheet.status === "fulfilled" ? sheet.value : []),
  ];
  const seen = new Set<string>();
  const merged = items
    .filter((a) => (seen.has(a.url) ? false : (seen.add(a.url), true)))
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  if (merged.length > 0) writeCache(merged);
  return merged;
};

/** "2026-10-19" → "2026年10月19日" */
export const formatJaDate = (date: string): string => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
  if (!m) return date;
  return `${m[1]}年${Number(m[2])}月${Number(m[3])}日`;
};
