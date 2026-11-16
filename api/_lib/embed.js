// リンクを貼ったときのプレビュー（OGP と Discord の Component Embed）を組み立てる共通部品。
//   - api/embed.js（SNS のクローラーにだけ返すページごとの HTML）
//   - vite.config.ts（トップ＝index.html に Component Embed を差し込む）
// の両方から使う。api/ の中でも `_` で始まるフォルダは Vercel Function にならない。
//
// Discord の仕様: https://docs.discord.com/developers/link-previews/overview
//                 https://docs.discord.com/developers/link-previews/component-embeds
//   - クローラーは JS を実行しないので、タグはサーバーが返す HTML に入っている必要がある
//   - Component Embed は <script id="discord:component-embed" type="application/json"> の JSON（3,000 バイトまで）。
//     最上位は Container（type 17）1 つだけ。不正な JSON は丸ごと捨てられ、OGP のプレビューに戻る
//   - ボタンはリンク（style 5）だけで、使えるキーは id / type / url / style / label / emoji / disabled のみ

export const SITE = "https://nico-labo748.dev";
export const SITE_NAME = "NICOLABO -にこラボ-";
export const AUTHOR = "nico";
export const DEFAULT_DESCRIPTION = "NICOLABO -にこラボ- ホビーサイトです。 プロフィールや作品を紹介しています。";
export const DEFAULT_IMAGE = {
  url: `${SITE}/site_ogp3.webp`,
  width: 3008,
  height: 1575,
  alt: "NICOLABO -にこラボ-",
};
/** サンドベージュ（--accent #cbbf9f）。Discord の埋め込みの左の帯の色 */
export const ACCENT = 0xcbbf9f;
const AVATAR = `${SITE}/sns_icon_round.png`;

/** Component Embed の上限（バイト）。少し余裕を持たせる */
const MAX_BYTES = 2900;

/* ---------- 文字列 ---------- */

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Discord の markdown として特別な意味を持つ記号を無効にする（タイトルや説明はシートの文字列なので） */
const md = (s) =>
  String(s)
    .replace(/([\\*_~`|[\]])/g, "\\$1")
    .replace(/^(\s*)([#>-])/gm, "$1\\$2");

/** 文字数で切る（サロゲートペアを壊さない） */
export const clip = (s, max) => {
  const chars = [...String(s ?? "").replace(/\s+/g, " ").trim()];
  return chars.length > max ? `${chars.slice(0, max - 1).join("")}…` : chars.join("");
};

/** サイト内パス（/foo.webp）を絶対 URL に。http(s) 以外は捨てる */
export const absUrl = (u) => {
  if (!u) return "";
  try {
    const url = new URL(u, SITE);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
};

/* ---------- Component Embed ---------- */

const text = (content) => ({ type: 10, content });
const separator = () => ({ type: 14, divider: true, spacing: 1 });
const gallery = (urls, alt) => ({
  type: 12,
  items: urls.map((url) => ({ media: { url }, ...(alt ? { description: clip(alt, 200) } : {}) })),
});
const buttons = (links) => ({
  type: 1,
  components: links.slice(0, 5).map(({ label, url }) => ({ type: 2, style: 5, label: clip(label, 80), url })),
});
const container = (components, accent = ACCENT) => ({ component: { type: 17, accent_color: accent, components } });

/** <head> に入れる <script>。JSON の中の `<` はエスケープして </script> で閉じられないようにする */
export const componentEmbedScript = (payload) =>
  `<script id="discord:component-embed" type="application/json">${JSON.stringify(payload).replace(/</g, "\\u003c")}</script>`;

const bytes = (payload) => Buffer.byteLength(JSON.stringify(payload).replace(/</g, "\\u003c"));

/** 上限を超えたら説明を短くして作り直す */
const fit = (build, desc) => {
  for (const max of [200, 140, 90, 50, 0]) {
    const payload = build(max ? clip(desc, max) : "");
    if (bytes(payload) <= MAX_BYTES) return payload;
  }
  return null;
};

const links = (list) => list.filter((l) => l.url);

/** トップページ（index.html に差し込む） */
export const topEmbed = ({ xUrl, githubUrl, qiitaUrl } = {}) =>
  fit(
    (desc) =>
      container([
        {
          type: 9,
          components: [text(`## ${md(SITE_NAME)}\n${md(desc)}`), text("-# Works · Articles · Skills · Activity · Timeline · Off-hours")],
          accessory: { type: 11, media: { url: AVATAR }, description: AUTHOR },
        },
        gallery([DEFAULT_IMAGE.url], DEFAULT_IMAGE.alt),
        separator(),
        buttons(
          links([
            { label: "Works", url: `${SITE}/projects` },
            { label: "Articles", url: `${SITE}/articles` },
            { label: "GitHub", url: githubUrl },
            { label: "X", url: xUrl },
            { label: "Qiita", url: qiitaUrl },
          ])
        ),
      ]),
    DEFAULT_DESCRIPTION
  );

/** 作品の詳細ページ（/projects/:id） */
export const projectEmbed = (p) => {
  const pageUrl = `${SITE}/projects/${encodeURIComponent(p.id)}`;
  const images = [p.thumbnail, ...(p.images ?? [])].map(absUrl).filter(Boolean).slice(0, 4);
  const meta = [p.period && `制作期間 ${p.period}`, p.tags?.length && p.tags.slice(0, 6).join(" · ")].filter(Boolean);
  return fit(
    (desc) =>
      container([
        text(`-# Works\n## ${md(p.title)}${desc ? `\n${md(desc)}` : ""}`),
        ...(meta.length ? [text(meta.map((m) => `-# ${md(m)}`).join("\n"))] : []),
        ...(images.length ? [gallery(images, p.title)] : []),
        separator(),
        buttons(
          links([
            { label: "作品ページを見る", url: pageUrl },
            { label: "デモ", url: absUrl(p.liveUrl) },
            { label: "GitHub", url: absUrl(p.repoUrl) },
          ])
        ),
      ]),
    p.description ?? ""
  );
};

/**
 * 一覧ページ・教材ページなど（見出し・説明・画像・ページへのボタン）。
 * accent は "#rrggbb"（省略時はサンド）。
 */
export const pageEmbed = ({ kicker, title, description, url, image = DEFAULT_IMAGE.url, accent }) =>
  fit(
    (desc) =>
      container(
        [
          text(`-# ${md(kicker)}\n## ${md(title)}${desc ? `\n${md(desc)}` : ""}`),
          gallery([image], title),
          separator(),
          buttons([{ label: "ページを開く", url }]),
        ],
        /^#[0-9a-f]{6}$/i.test(accent ?? "") ? parseInt(accent.slice(1), 16) : ACCENT
      ),
    description
  );

/* ---------- HTML のメタタグ差し替え ---------- */

/** <meta property|name="key" content="..."> を差し替える。無ければ </head> の前に足す */
const setMeta = (html, attr, key, value) => {
  const tag = `<meta ${attr}="${key}" content="${esc(value)}" />`;
  const re = new RegExp(`<meta\\s+(?:property|name)="${key.replace(/[.:]/g, "\\$&")}"[^>]*>`, "i");
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
};

const removeMeta = (html, key) =>
  html.replace(new RegExp(`\\s*<meta\\s+(?:property|name)="${key.replace(/[.:]/g, "\\$&")}"[^>]*>`, "gi"), "");

/** 既存の Component Embed を外し、payload があれば入れ直す */
export const setComponentEmbed = (html, payload) => {
  const out = html.replace(/\s*<script id="discord:component-embed"[\s\S]*?<\/script>/, "");
  return payload ? out.replace("</head>", `    ${componentEmbedScript(payload)}\n  </head>`) : out;
};

/**
 * ページごとのメタ情報を index.html に当てる。
 * image に width / height が無い（シートの画像など）ときは寸法のタグを外す（間違った寸法を残さない）。
 */
export const applyMeta = (html, { title, description, url, type = "website", image = DEFAULT_IMAGE }) => {
  let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  out = setMeta(out, "name", "description", description);
  out = setMeta(out, "property", "og:type", type);
  out = setMeta(out, "property", "og:title", title);
  out = setMeta(out, "property", "og:description", description);
  out = setMeta(out, "property", "og:url", url);
  out = setMeta(out, "property", "og:image", image.url);
  out = setMeta(out, "property", "og:image:alt", image.alt ?? title);
  out = setMeta(out, "name", "twitter:image", image.url);
  if (image.width && image.height) {
    out = setMeta(out, "property", "og:image:width", String(image.width));
    out = setMeta(out, "property", "og:image:height", String(image.height));
  } else {
    out = removeMeta(removeMeta(out, "og:image:width"), "og:image:height");
  }
  out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${esc(url)}$2`);
  return out;
};
