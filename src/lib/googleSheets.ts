export interface SheetRow {
  [key: string]: string;
}

/**
 * シートの行を取得し、1 行目を見出しとしてオブジェクトの配列にする。
 *
 * Google Sheets API はブラウザから直接呼ばず、/api/sheets（Vercel Function、api/sheets.js）を通す。
 * API キーをブラウザに渡さないため（VITE_ 付きの環境変数に入れると JS に埋め込まれて公開される）。
 * 読めるシートは api/sheets.js の SHEETS にあるものだけなので、シートを足したらそちらにも足す。
 */
export const fetchSheetData = async <T>(sheetName: string): Promise<T[]> => {
  try {
    const response = await fetch(`/api/sheets?sheet=${encodeURIComponent(sheetName)}`);
    // JSON 以外は「無し」として扱う（関数の無い静的サーバーで配信すると index.html が返る）
    if (!response.ok || !response.headers.get("content-type")?.includes("application/json")) {
      throw new Error(`/api/sheets ${response.status}`);
    }
    const data = (await response.json()) as { values?: unknown } | null;

    const rows = data?.values;
    if (!Array.isArray(rows) || rows.length === 0) return [];

    const headers = rows[0];
    const rawData = rows.slice(1);

    return rawData.map((row: string[]) => {
      const item: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        const cleanHeader = header.trim();
        item[cleanHeader] = row[index] || '';
      });
      return item as unknown as T;
    });
  } catch (error) {
    console.error(`Failed to fetch ${sheetName}:`, error);
    return [];
  }
};
