// Vite のプラグイン: npm run dev / npm run preview でも /api/sheets を動かす（本番は Vercel Function の api/sheets.js）。
// 同じ関数をそのまま呼ぶので、キーは Node 側（.env.local）だけにあり、ブラウザには渡らない。
// ほかの /api/*（github・spotify・ogp）はローカルでは動かないまま（無くても画面は出る）。
import { loadEnv } from "vite";
import handler from "../../api/sheets.js";

const ENV_NAMES = ["GOOGLE_SHEETS_API_KEY", "SPREADSHEET_ID", "VITE_GOOGLE_SHEETS_API_KEY", "VITE_SPREADSHEET_ID"];

export const localSheetsApi = (mode) => {
  const middleware = async (req, res) => {
    try {
      // VITE_ の付かない変数は Vite が読み込まないので、関数が読めるようにここで process.env に入れる
      const env = loadEnv(mode, process.cwd(), "");
      for (const name of ENV_NAMES) {
        if (env[name]) process.env[name] ??= env[name];
      }
      const query = Object.fromEntries(new URL(req.url ?? "/", "http://localhost").searchParams);
      // Vercel の res.status().json() に合わせた最小限の橋渡し
      const bridge = {
        setHeader: (name, value) => res.setHeader(name, value),
        status(code) {
          res.statusCode = code;
          return bridge;
        },
        json(body) {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(body));
        },
      };
      await handler({ method: req.method, query }, bridge);
    } catch (e) {
      console.error("[sheets]", e);
      res.statusCode = 500;
      res.end();
    }
  };
  return {
    name: "local-sheets-api",
    configureServer: (server) => void server.middlewares.use("/api/sheets", middleware),
    configurePreviewServer: (server) => void server.middlewares.use("/api/sheets", middleware),
  };
};
