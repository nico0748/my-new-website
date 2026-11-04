import { fetchSheetData } from "./googleSheets";
import type { SheetRow } from "./googleSheets";
import { mapOffHoursData } from "./dataMapper";
import type { OffHoursCategory, OffHoursItem } from "./dataMapper";

/** 趣味の記録（OFF-HOURS）を書くシートのタブ名。 */
export const OFF_HOURS_SHEET = "OffHours";

/** トップに並べる順番（同人作品は最後）。 */
export const OFF_HOURS_ORDER: OffHoursCategory[] = ["anime", "music", "event", "indie"];

export const OFF_HOURS_LABEL: Record<OffHoursCategory, string> = {
  anime: "アニメ",
  music: "音楽",
  event: "イベント",
  indie: "同人作品",
};

/**
 * OffHours シートの取得をアプリ全体で 1 回にまとめる。
 * トップの一番下のセクションなので、別ページから「戻る」で帰ってきたときに
 * 最初の描画から中身を出し、スクロール位置の復元が足りなくならないようにする。
 */
let cache: OffHoursItem[] | null = null;
let pending: Promise<OffHoursItem[]> | null = null;

export const getCachedOffHours = (): OffHoursItem[] | null => cache;

export const fetchOffHours = (): Promise<OffHoursItem[]> => {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = fetchSheetData<SheetRow>(OFF_HOURS_SHEET)
      .then((rows) => {
        cache = mapOffHoursData(rows);
        return cache;
      })
      .catch(() => {
        pending = null;
        return [];
      });
  }
  return pending;
};
