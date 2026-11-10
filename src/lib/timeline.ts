import { fetchSheetData } from "./googleSheets";
import type { SheetRow } from "./googleSheets";
import { mapTimelineData } from "./dataMapper";
import type { TimelineItem, TimelineLink } from "./dataMapper";

/**
 * Timeline シートの取得をアプリ全体で 1 回にまとめる（モジュール内キャッシュ）。
 * 作品ページなどから「戻る」でトップに戻ったとき、TIMELINE とそのポップアップ（?timeline=）を
 * 最初の描画から出すため（後から出ると、スクロール位置の復元やポップアップの表示が遅れる）。
 */
let cache: TimelineItem[] | null = null;
let pending: Promise<TimelineItem[]> | null = null;

export const getCachedTimeline = (): TimelineItem[] | null => cache;

export const fetchTimeline = (): Promise<TimelineItem[]> => {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = fetchSheetData<SheetRow>("Timeline")
      .then((rows) => {
        cache = mapTimelineData(rows);
        return cache;
      })
      .catch(() => {
        pending = null;
        return [];
      });
  }
  return pending;
};

export const TIMELINE_TYPE_LABEL: Record<TimelineItem["type"], string> = {
  education: "学歴",
  work: "仕事",
  project: "制作",
  certification: "受賞・資格",
  other: "その他",
};

/** "2025-04" → "2025.04"、"2025" → "2025" */
const ym = (v: string) => v.replace("-", ".");

/** 期間の表示: "2025.04 – 2025.07" / "2025.10 – 現在" / "2024.10" */
export const formatPeriod = (start: string, end?: string): string => {
  if (!end) return ym(start);
  return `${ym(start)} – ${end === "present" ? "現在" : ym(end)}`;
};

const monthIndex = (v: string): number | null => {
  const m = /^(\d{4})-(\d{2})$/.exec(v);
  return m ? Number(m[1]) * 12 + Number(m[2]) - 1 : null;
};

/**
 * 期間の長さ（始まりと終わりの月を両方数える）: "4 か月" / "1 年 2 か月"。
 * 単発・年だけの項目・終わりが始まりより前のものは undefined。継続中は今月までで数える。
 */
export const formatDuration = (start: string, end?: string, now = new Date()): string | undefined => {
  if (!end) return undefined;
  const s = monthIndex(start);
  const e = end === "present" ? now.getFullYear() * 12 + now.getMonth() : monthIndex(end);
  if (s === null || e === null || e < s) return undefined;
  const months = e - s + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y > 0 ? `${y} 年` : "", m > 0 ? `${m} か月` : ""].filter(Boolean).join(" ");
};

/** リンクの表示名（ラベルが無ければホスト名、サイト内パスはそのまま）。 */
export const linkLabel = (link: TimelineLink): string => {
  if (link.label) return link.label;
  if (link.url.startsWith("/")) return link.url;
  try {
    return new URL(link.url).hostname.replace(/^www\./, "");
  } catch {
    return link.url;
  }
};

/** 項目のタイトル ↔ ポップアップの見出しで一致させる view-transition-name（id は日本語でもよいので数値にする）。 */
export const timelineVtName = (id: string) => {
  let h = 5381;
  for (const ch of id) h = ((h << 5) + h + ch.codePointAt(0)!) >>> 0;
  return `timeline-title-${h.toString(36)}`;
};

/** ポップアップに出すものがあるか（タイトルだけの項目は押せないままにする）。 */
export const hasTimelineDetail = (it: TimelineItem) =>
  !!(it.description || it.detail || it.org || it.href || it.links.length > 0 || it.tags.length > 0);

/** ポップアップの URL パラメータ名（トップの ?id=real と並べて使うので id は避ける）。 */
export const TIMELINE_PARAM = "timeline";
