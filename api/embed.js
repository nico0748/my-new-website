// Vercel Function: SNS のクローラー（Discord / X / Slack など）にだけ、ページごとのプレビュー用 HTML を返す。
//   vercel.json の rewrites で、User-Agent がクローラーのときだけ /projects/:id などをここへ回す（人には今まで通り SPA）。
//   GET /api/embed?page=top / ?page=project&id=secowl / ?page=projects / articles / skills / anime
//   トップ（/）は静的な index.html が rewrites より優先されるので、middleware.js がクローラーのときだけここへ回す。
//
// クローラーは JS を実行しないため、SPA のままだとどのページもトップの OGP になる。ここで index.html の
// title / description / og:* を差し替え、Discord 向けの Component Embed（api/_lib/embed.js）を入れて返す。
// 作品の情報は Projects シートから読む（api/sheets.js と同じ環境変数。読めなければ作品一覧の内容で返す）。

import {
  SITE, SITE_NAME, DEFAULT_DESCRIPTION, applyMeta, setComponentEmbed, projectEmbed, pageEmbed, richTopEmbed, absUrl, clip,
} from "./_lib/embed.js";

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

/** シートを読んで、1 行目を見出しにしたオブジェクトの配列にする。読めなければ空配列 */
async function readSheet(name) {
  const key = process.env.GOOGLE_SHEETS_API_KEY || process.env.VITE_GOOGLE_SHEETS_API_KEY;
  const sheetId = process.env.SPREADSHEET_ID || process.env.VITE_SPREADSHEET_ID;
  if (!key || !sheetId) return [];
  try {
    const r = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${encodeURIComponent(name)}`,
      { headers: { "X-Goog-Api-Key": key }, signal: AbortSignal.timeout(5000) }
    );
    if (!r.ok) throw new Error(`values ${r.status}`);
    const [head = [], ...rows] = (await r.json())?.values ?? [];
    return rows.map((cells) => Object.fromEntries(head.map((h, i) => [String(h).trim(), String(cells[i] ?? "").trim()])));
  } catch (e) {
    console.error("[embed]", name, e instanceof Error ? `${e.name}: ${e.message}` : e);
    return [];
  }
}

const list = (v) => (v || "").split(",").map((t) => t.trim()).filter(Boolean);

const toProject = (row) => ({
  id: row.id,
  title: row.title || row.id,
  description: row.description,
  thumbnail: row.thumbnail,
  images: list(row.images),
  tags: list(row.tags),
  liveUrl: row.liveUrl,
  repoUrl: row.repoUrl,
  period: row.period,
});

/** Projects シートから 1 作品を読む。見つからない・読めないときは null */
async function loadProject(id) {
  const row = (await readSheet("Projects")).find((r) => r.id === id);
  return row ? toProject(row) : null;
}

const originOf = (req) => {
  const host = req.headers?.["x-forwarded-host"] || req.headers?.host;
  return host ? `${req.headers?.["x-forwarded-proto"] || "https"}://${host}` : SITE;
};

const getJson = async (url) => {
  try {
    const r = await fetch(url, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(4000) });
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
};

/** 掲載先の名前（src/lib/dataMapper.ts の detectPlatform と同じ） */
const platformOf = (url) => {
  const host = new URL(url).hostname.replace(/^www\./, "");
  const known = [["qiita.com", "Qiita"], ["zenn.dev", "Zenn"], ["note.com", "note"], ["speakerdeck.com", "Speaker Deck"], ["medium.com", "Medium"]];
  return known.find(([h]) => host.endsWith(h))?.[1] ?? (host.includes("hatena") ? "はてなブログ" : host);
};

/** "2026年夏" → 20263（並べ替え用。src/lib/dataMapper.ts の seasonRank と同じ） */
const seasonRank = (t) => {
  const m = /(\d{4})\s*年?\s*(冬|春|夏|秋)?/.exec(t || "");
  return m ? Number(m[1]) * 10 + (m[2] ? "冬春夏秋".indexOf(m[2]) + 1 : 0) : -1;
};

/** トップの埋め込みに載せる、サイトのいまの中身。どれかが読めなくても残りで作る */
async function loadTop(req) {
  const [profileRows, projects, sheetArticles, watching, watched, qiita, spotify] = await Promise.all([
    readSheet("Profile"),
    readSheet("Projects"),
    readSheet("Articles"),
    readSheet("all-watching-anime"),
    readSheet("all-watched-anime"),
    getJson("https://qiita.com/api/v2/users/nico0748/items?per_page=10"),
    getJson(`${originOf(req)}/api/spotify`),
  ]);
  const profile = Object.fromEntries(profileRows.filter((r) => r.key).map((r) => [r.key, r.value]));

  const works = projects
    .filter((r) => r.id && r.title)
    .slice(0, 4)
    .map((r) => ({ title: r.title, url: `${SITE}/projects/${encodeURIComponent(r.id)}`, description: r.description, image: r.thumbnail }));

  const articles = [
    ...(Array.isArray(qiita) ? qiita : [])
      .filter((i) => !i.private && i.url && i.title)
      .map((i) => ({ title: i.title, url: i.url, platform: "Qiita", date: String(i.created_at ?? "").slice(0, 10) })),
    ...sheetArticles
      .filter((r) => r.title && /^https:\/\//.test(r.url))
      .map((r) => ({ title: r.title, url: r.url, platform: r.platform || platformOf(r.url), date: r.date.slice(0, 10) })),
  ]
    .filter((a, i, all) => all.findIndex((b) => b.url === a.url) === i)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 3);

  const tracks = (Array.isArray(spotify?.tracks) ? spotify.tracks : [])
    .filter((t) => t?.title)
    .slice(0, 3)
    .map((t) => ({ title: t.title, artists: t.artists, url: /^https:\/\/open\.spotify\.com\//.test(t.url ?? "") ? t.url : "" }));

  const watchingIds = new Set(watching.map((w) => w.id));
  const anime = [...watching, ...watched.filter((w) => !watchingIds.has(w.id))]
    .filter((w) => w.id && w.title && /^(true|1)$/i.test(w.isFavorite || ""))
    .sort((a, b) => seasonRank(b.release_season) - seasonRank(a.release_season) || Number(b.id) - Number(a.id))
    .slice(0, 3)
    .map((w) => ({ title: w.title, season: w.release_season, url: `${SITE}/anime?tab=favorite&id=${encodeURIComponent(w.id)}` }));

  return {
    bio: profile.description || DEFAULT_DESCRIPTION,
    works,
    articles,
    tracks,
    anime,
    links: { xUrl: absUrl(profile.xUrl), githubUrl: absUrl(profile.githubUrl), qiitaUrl: absUrl(profile.qiitaUrl) },
  };
}

export default async function handler(req, res) {
  const page = typeof req.query?.page === "string" ? req.query.page : "";
  const id = typeof req.query?.id === "string" ? req.query.id : "";

  let meta;
  let embed;
  if (page === "top") {
    const top = await loadTop(req);
    const html = setComponentEmbed(await loadBaseHtml(req), richTopEmbed(top));
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
    return res.status(200).send(html);
  }
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
