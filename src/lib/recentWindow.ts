/** 日次で増える記事フィード（Topics 等）を「直近ウィンドウ」と「過去分」に分割するユーティリティ。
 *
 *  - 既定は「直近 days 日」を最新扱い、それより前は archived（過去分）へ。
 *  - 同期が無い日でも一覧が空にならないよう、直近が minRecent 未満なら
 *    日付に関わらず「最新 minRecent 件」を recent として底上げする（保険）。
 *  - 入力は日付降順（新しい順）である前提（mapTopicData / mapStudyData は sort 済み）。
 */

export interface Dated {
  date: string; // "YYYY-MM-DD"（空文字は未日付として扱う）
}

export interface RecentSplit<T> {
  recent: T[];   // 直近ウィンドウ（既定表示対象）
  archived: T[]; // それより古い過去分
  cutoff: string; // 実際に使った基準日 "YYYY-MM-DD"
}

export interface RecentWindowOptions {
  days?: number;      // 直近ウィンドウの日数（既定 14）
  minRecent?: number; // 最低表示件数の保険（既定 12）
  now?: Date;         // 基準日（テスト用に注入可・既定は実行時の現在）
}

const toYMD = (d: Date): string => {
  // ローカルタイムの YYYY-MM-DD（JST 運用を想定）
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export function splitByRecency<T extends Dated>(
  items: T[],
  { days = 14, minRecent = 12, now = new Date() }: RecentWindowOptions = {}
): RecentSplit<T> {
  const cut = new Date(now);
  cut.setDate(cut.getDate() - (days - 1)); // 当日を含めて days 日
  const cutoff = toYMD(cut);

  // 日付でウィンドウ内/外に振り分け（未日付は過去分扱い）
  let recent = items.filter((i) => i.date && i.date >= cutoff);

  // 保険: ウィンドウ内が少なすぎる（同期が無い日など）→ 最新 minRecent 件を採用
  if (recent.length < minRecent) {
    recent = items.slice(0, Math.min(minRecent, items.length));
  }

  const recentSet = new Set(recent);
  const archived = items.filter((i) => !recentSet.has(i));

  return { recent, archived, cutoff };
}
