// Vercel Function: Google Sheets の 1 シート分の行を返す。
//   GET /api/sheets?sheet=Projects  →  { "values": [["id", "title", ...], ["paperlens", ...], ...] }
//
// - API キーはサーバーの外に出さない。以前はブラウザから Sheets API を直接呼んでいたので、キーが JS と通信の URL に
//   そのまま出ていた（VITE_ 付きの環境変数はビルド時に JS へ埋め込まれる）
// - 読めるシートは下の SHEETS だけ。サイトで使っていないシート（旧形式の控えなど）は、この関数からは読めない
// - 応答は values（1 行目が見出しの 2 次元配列）だけに絞る。Google の応答やエラーをそのまま返さない
// - CDN に 1 分キャッシュし、Google へのリクエストはシートごと・リージョンごとに 1 分 1 回程度に抑える
// 設定手順は SetupGuide.md。環境変数が無ければ空の配列を返す。

const BASE_URL = "https://sheets.googleapis.com/v4/spreadsheets";

/** サイトが読むシート。シートを足したらここにも足す（無いものは 400）。 */
const SHEETS = new Set([
  "Profile",
  "Projects",
  "Skills",
  "Timeline",
  "Articles",
  "OffHours",
  "all-watching-anime",
  "all-watched-anime",
  "all-wanna-watch-anime",
]);

const EMPTY = { values: [] };

const send = (res, status, body, cache) => {
  res.setHeader("Cache-Control", cache);
  res.status(status).json(body);
};

/**
 * キーとスプレッドシート ID。VITE_ 付きの名前は移行のあいだだけ読む
 * （関数の中で読む分には JS に埋め込まれないが、名前を残すとまたブラウザ側で使いかねないので、移し終えたら消す）。
 */
const readEnv = () => {
  const { GOOGLE_SHEETS_API_KEY, SPREADSHEET_ID, VITE_GOOGLE_SHEETS_API_KEY, VITE_SPREADSHEET_ID } = process.env;
  if (!GOOGLE_SHEETS_API_KEY && VITE_GOOGLE_SHEETS_API_KEY) {
    console.warn("[sheets] VITE_GOOGLE_SHEETS_API_KEY を使っています。GOOGLE_SHEETS_API_KEY に移してください。");
  }
  return {
    key: GOOGLE_SHEETS_API_KEY || VITE_GOOGLE_SHEETS_API_KEY,
    id: SPREADSHEET_ID || VITE_SPREADSHEET_ID,
  };
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, EMPTY, "no-store");
  }
  // sheet 以外のクエリを付けてキャッシュを外し、Google へ連打させることを防ぐ
  const query = req.query ?? {};
  const sheet = query.sheet;
  if (Object.keys(query).length !== 1 || typeof sheet !== "string" || !SHEETS.has(sheet)) {
    return send(res, 400, EMPTY, "public, s-maxage=86400");
  }

  const { key, id } = readEnv();
  if (!key || !id) return send(res, 200, EMPTY, "public, s-maxage=300");

  try {
    // キーは URL ではなくヘッダーで渡す（URL はログやエラーメッセージに残りやすい）
    const r = await fetch(`${BASE_URL}/${encodeURIComponent(id)}/values/${encodeURIComponent(sheet)}`, {
      headers: { "X-Goog-Api-Key": key },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) {
      const reason = (await r.json().catch(() => null))?.error?.status;
      throw new Error(`values ${r.status}${reason ? ` ${reason}` : ""}`);
    }
    const json = await r.json();
    const values = Array.isArray(json?.values) ? json.values : [];
    return send(res, 200, { values }, "public, s-maxage=60, stale-if-error=86400");
  } catch (e) {
    console.error("[sheets]", sheet, e instanceof Error ? `${e.name}: ${e.message}` : e);
    return send(res, 502, EMPTY, "no-store");
  }
}
