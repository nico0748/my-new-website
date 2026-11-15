// Vercel Function: SNS のクローラー（Discord / X / Slack など）にだけ、ページごとのプレビュー用 HTML を返す。
//   vercel.json の rewrites で、User-Agent がクローラーのときだけ /projects/:id などをここへ回す（人には今まで通り SPA）。
//   GET /api/embed?page=project&id=secowl / ?page=projects / articles / skills / anime
//
// クローラーは JS を実行しないため、SPA のままだとどのページもトップの OGP になる。ここで index.html の
// title / description / og:* を差し替え、Discord 向けの Component Embed（api/_lib/embed.js）を入れて返す。
// 作品の情報は Projects シートから読む（api/sheets.js と同じ環境変数。読めなければ作品一覧の内容で返す）。

import { SITE, SITE_NAME, applyMeta, setComponentEmbed, projectEmbed, pageEmbed, absUrl, clip } from "./_lib/embed.js";

const PAGES = {
  projects: { kicker: "Works", title: "Works", description: "これまでに作ったアプリケーションやサイトの一覧です。", path: "/projects" },
  articles: { kicker: "Articles", title: "Articles", description: "Qiita などに書いた技術記事の一覧です。", path: "/articles" },
  skills: { kicker: "Skills", title: "Skills", description: "使っている技術スタックをカテゴリごとにまとめています。", path: "/skills" },
  anime: { kicker: "Off-hours", title: "アニメの記録", description: "お気に入り・見てる・見た・見たいアニメの記録です（Annict の視聴記録より）。", path: "/anime" },
};

/** 作品 id として受け付ける形（シートの id は英小文字・数字・ハイフン） */
const ID_RE = /^[a-z0-9][a-z0-9_-]{0,63}$/i;

/** 本物の index.html（ビルドの成果物）。読めなければ最小限の HTML を作る */
async function loadBaseHtml(req) {
  const host = req.headers?.["x-forwarded-host"] || req.headers?.host;
  if (host) {
    try {
      const proto = req.headers?.["x-forwarded-proto"] || "https";
      const r = await fetch(`${proto}://${host}/index.html`, { signal: AbortSignal.timeout(3000) });
      const html = r.ok ? await r.text() : "";
      if (html.includes("</head>")) return html;
    } catch {
      /* 下の最小限の HTML にする */
    }
  }
  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <title>${SITE_NAME}</title>
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="alternate" type="application/json+oembed" href="${SITE}/oembed.json" />
  </head>
  <body></body>
</html>`;
}

/** Projects シートから 1 作品を読む。見つからない・読めないときは null */
async function loadProject(id) {
  const key = process.env.GOOGLE_SHEETS_API_KEY || process.env.VITE_GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.SPREADSHEET_ID || process.env.VITE_SPREADSHEET_ID;
  if (!key || !sheetId) return null;
  try {
    const r = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/Projects`,
      { headers: { "X-Goog-Api-Key": key }, signal: AbortSignal.timeout(5000) }
    );
    if (!r.ok) throw new Error(`values ${r.status}`);
    const [head = [], ...rows] = (await r.json())?.values ?? [];
    const row = rows.find((cells) => cells[head.indexOf("id")] === id);
    if (!row) return null;
    const get = (k) => (head.indexOf(k) >= 0 ? String(row[head.indexOf(k)] ?? "").trim() : "");
    const list = (k) => get(k).split(",").map((t) => t.trim()).filter(Boolean);
    return {
      id,
      title: get("title") || id,
      description: get("description"),
      thumbnail: get("thumbnail"),
      images: list("images"),
      tags: list("tags"),
      liveUrl: get("liveUrl"),
      repoUrl: get("repoUrl"),
      period: get("period"),
    };
  } catch (e) {
    console.error("[embed]", e instanceof Error ? `${e.name}: ${e.message}` : e);
    return null;
  }
}

export default async function handler(req, res) {
  const page = typeof req.query?.page === "string" ? req.query.page : "";
  const id = typeof req.query?.id === "string" ? req.query.id : "";

  let meta;
  let embed;
  const project = page === "project" && ID_RE.test(id) ? await loadProject(id) : null;
  if (project) {
    const url = `${SITE}/projects/${encodeURIComponent(project.id)}`;
    const description = clip(project.description, 160) || PAGES.projects.description;
    const image = absUrl(project.thumbnail);
    meta = {
      title: `${project.title} | ${SITE_NAME}`,
      description,
      url,
      type: "article",
      ...(image ? { image: { url: image, alt: project.title } } : {}),
    };
    embed = projectEmbed(project);
  } else {
    // 作品が見つからないときは作品一覧として返す
    const p = PAGES[page] ?? PAGES.projects;
    const url = `${SITE}${p.path}`;
    meta = { title: `${p.title} | ${SITE_NAME}`, description: p.description, url };
    embed = pageEmbed({ ...p, url });
  }

  const html = setComponentEmbed(applyMeta(await loadBaseHtml(req), meta), embed);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  // シートを直してから 1 時間ほどで反映。Discord 側も 30 分ほどキャッシュする
  res.setHeader("Cache-Control", project || page !== "project" ? "public, s-maxage=3600, stale-while-revalidate=86400" : "public, s-maxage=300");
  res.status(200).send(html);
}
