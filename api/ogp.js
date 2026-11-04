// Vercel Function: 記事ページの OGP 画像 URL を返す。
//   GET /api/ogp?url=<記事URL>  →  { "image": "https://..." | null }
// ブラウザからは CORS で他サイトの HTML を読めないため、サーバー側で og:image を取り出す。
// SSRF を避けるため、取得先は記事プラットフォームのホストに限定する。

const ALLOWED_HOSTS = [
  "qiita.com",
  "zenn.dev",
  "note.com",
  "speakerdeck.com",
  "medium.com",
  "hatenablog.com",
  "hatenablog.jp",
  "hateblo.jp",
];

const isAllowed = (u) => {
  try {
    const url = new URL(u);
    if (url.protocol !== "https:") return false;
    const host = url.hostname.toLowerCase();
    return ALLOWED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`));
  } catch {
    return false;
  }
};

const MAX_BYTES = 512 * 1024;

/** 先頭 MAX_BYTES だけ読む（og:image は <head> にあるので十分）。 */
async function readHead(res) {
  const reader = res.body.getReader();
  const chunks = [];
  let size = 0;
  while (size < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    size += value.length;
    if (new TextDecoder().decode(value).includes("</head>")) break;
  }
  reader.cancel().catch(() => {});
  return new TextDecoder().decode(Buffer.concat(chunks));
}

const decodeEntities = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function findOgImage(html) {
  const metas = html.match(/<meta\b[^>]*>/gi) ?? [];
  for (const prop of ["og:image", "twitter:image"]) {
    for (const tag of metas) {
      const key = /(?:property|name)\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
      if (key?.toLowerCase() !== prop) continue;
      const content = /content\s*=\s*["']([^"']+)["']/i.exec(tag)?.[1];
      if (content && /^https:\/\//i.test(decodeEntities(content))) return decodeEntities(content);
    }
  }
  return null;
}

export default async function handler(req, res) {
  const target = typeof req.query?.url === "string" ? req.query.url : "";
  if (!isAllowed(target)) {
    res.status(400).json({ image: null, error: "url is not allowed" });
    return;
  }

  let image = null;
  try {
    const upstream = await fetch(target, {
      headers: { "user-agent": "nico-labo748.dev OGP fetcher", accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(5000),
    });
    if (upstream.ok && isAllowed(upstream.url)) {
      image = findOgImage(await readHead(upstream));
    }
  } catch {
    image = null;
  }

  // 取得できた場合は 1 週間、失敗時は 1 時間だけ CDN にキャッシュ
  res.setHeader(
    "Cache-Control",
    image ? "public, s-maxage=604800, stale-while-revalidate=86400" : "public, s-maxage=3600"
  );
  res.status(200).json({ image });
}
