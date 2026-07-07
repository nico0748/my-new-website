/**
 * Learn 用 OGP 静的生成スクリプト（vite build の後に実行）
 *
 *  1. src/content/learn の各記事 TSX から meta を抽出
 *  2. コースサムネと同モチーフの OG 画像（1200x630 PNG）を satori + resvg で生成
 *     → dist/learn/og/<domain>/<id>.png / dist/learn/og/<domain>.png / dist/learn/og/learn.png
 *  3. meta（title / description / og:*）を差し替えた index.html を各ルートに出力
 *     → dist/learn/index.html / dist/learn/<domain>/index.html / dist/learn/<domain>/<id>/index.html
 *
 * Vercel は rewrite より実ファイルを優先するため、クローラーにはこの静的 HTML が返る。
 * 環境変数: OG_ROOT（リポジトリルート）/ OG_DIST（出力先）でテスト時に上書き可能。
 */
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.OG_ROOT ?? join(HERE, "..", "..");
const DIST = process.env.OG_DIST ?? join(ROOT, "dist");
const SITE = "https://nico-labo748.dev";
const BRAND = "nicoTech Learn";
const LANDING_TITLE = "nicoTech Learn — Web・インフラ・セキュリティの教材";
const LANDING_DESC =
  "Web・インフラ・セキュリティを分野ごとに体系立てて学べる IT 教材ライブラリ。";

/* ---------- 1. メタ抽出 ---------- */

const field = (src, key) => {
  const m = src.match(new RegExp(`(?:^|\\n)\\s*${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`));
  return m ? m[1].replace(/\\"/g, '"') : undefined;
};

const contentDir = join(ROOT, "src", "content", "learn");
const domains = readdirSync(contentDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const articles = [];
for (const domain of domains) {
  const dir = join(contentDir, domain);
  for (const f of readdirSync(dir).filter((f) => f.endsWith(".tsx"))) {
    const src = readFileSync(join(dir, f), "utf8");
    const block = src.match(/export const meta[^=]*=\s*\{([\s\S]*?)\n\};/)?.[1];
    if (!block) {
      console.warn(`⚠ meta が見つかりません: ${domain}/${f}（スキップ）`);
      continue;
    }
    const id = field(block, "id");
    const title = field(block, "title");
    if (!id || !title) {
      console.warn(`⚠ meta の id / title を解析できません: ${domain}/${f}（スキップ）`);
      continue;
    }
    articles.push({
      domain,
      id,
      title,
      description: field(block, "description") ?? "",
      section: field(block, "section") ?? "",
    });
  }
}

/* ---------- 2. learnCategories からコース定義を抽出 ---------- */

const catSrc = readFileSync(join(ROOT, "src", "lib", "learnCategories.ts"), "utf8");

const domainStyle = (d) => {
  const block = catSrc.match(new RegExp(`\\n  ${d}:\\s*\\{([\\s\\S]*?)\\}`))?.[1] ?? "";
  return {
    label: field(block, "label") ?? d,
    accent: block.match(/accent:\s*"(#[0-9a-fA-F]{6})"/)?.[1] ?? "#22b0a0",
    description: field(block, "description") ?? "",
  };
};

const sectionLabel = (d, key) => {
  const sec = catSrc
    .match(/const DOMAIN_SECTIONS[^=]*=\s*\{([\s\S]*?)\n\};/)?.[1]
    ?.match(new RegExp(`${d}:\\s*\\[([\\s\\S]*?)\\]`))?.[1];
  const m = sec?.match(new RegExp(`key:\\s*"${key}",\\s*label:\\s*"([^"]+)"`));
  return m?.[1] ?? "";
};

/* ---------- 3. コースアイコン（public/learn/covers と同モチーフ・白ライン） ---------- */

const ICONS = {
  web: () => `
    <rect x="90" y="52" width="140" height="88" rx="10" fill="#fff" fill-opacity="0.14" stroke="#fff" stroke-width="3"/>
    <path d="M90 72 h140" stroke="#fff" stroke-width="3"/>
    <circle cx="104" cy="62" r="3.2" fill="#fff"/><circle cx="116" cy="62" r="3.2" fill="#fff"/><circle cx="128" cy="62" r="3.2" fill="#fff"/>
    <path d="M104 88 h64 M104 102 h84 M104 116 h48" stroke="#fff" stroke-width="3.4" stroke-linecap="round" stroke-opacity="0.92"/>`,
  infra: () => `
    <g stroke="#fff" stroke-width="3">
      <rect x="112" y="50" width="96" height="26" rx="6" fill="#fff" fill-opacity="0.14"/>
      <rect x="112" y="84" width="96" height="26" rx="6" fill="#fff" fill-opacity="0.14"/>
      <rect x="112" y="118" width="96" height="26" rx="6" fill="#fff" fill-opacity="0.14"/>
    </g>
    <g fill="#fff"><circle cx="126" cy="63" r="3.4"/><circle cx="126" cy="97" r="3.4"/><circle cx="126" cy="131" r="3.4"/></g>
    <path d="M150 63 h44 M150 97 h44 M150 131 h44" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-opacity="0.85"/>`,
  security: () => `
    <path d="M160 46 L196 60 V96 C196 118 180 132 160 140 C140 132 124 118 124 96 V60 Z" fill="#fff" fill-opacity="0.14" stroke="#fff" stroke-width="3.4" stroke-linejoin="round"/>
    <path d="M146 92 l10 11 l20 -24" stroke="#fff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  ai: (accent) => `
    <g stroke="#fff" stroke-width="2.8" stroke-opacity="0.75">
      <path d="M118 60 L160 77 M118 60 L160 113 M118 95 L160 77 M118 95 L160 113 M118 130 L160 77 M118 130 L160 113"/>
      <path d="M160 77 L202 95 M160 113 L202 95"/>
    </g>
    <g fill="${accent}" stroke="#fff" stroke-width="3">
      <circle cx="118" cy="60" r="9"/><circle cx="118" cy="95" r="9"/><circle cx="118" cy="130" r="9"/>
      <circle cx="160" cy="77" r="9"/><circle cx="160" cy="113" r="9"/><circle cx="202" cy="95" r="9"/>
    </g>
    <g fill="#fff" fill-opacity="0.14">
      <circle cx="118" cy="60" r="9"/><circle cx="118" cy="95" r="9"/><circle cx="118" cy="130" r="9"/>
      <circle cx="160" cy="77" r="9"/><circle cx="160" cy="113" r="9"/><circle cx="202" cy="95" r="9"/>
    </g>`,
  dev: () => `
    <rect x="96" y="50" width="128" height="90" rx="10" fill="#fff" fill-opacity="0.14" stroke="#fff" stroke-width="3"/>
    <path d="M116 78 l18 14 l-18 14" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M148 112 h32" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-opacity="0.92"/>`,
  mobile: () => `
    <rect x="132" y="40" width="56" height="104" rx="12" fill="#fff" fill-opacity="0.14" stroke="#fff" stroke-width="3.4"/>
    <path d="M152 54 h16" stroke="#fff" stroke-width="3.2" stroke-linecap="round"/>
    <path d="M144 76 h32 M144 90 h24" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-opacity="0.85"/>
    <path d="M150 130 h20" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/>`,
  db: () => `
    <path d="M116 62 v58 a44 14 0 0 0 88 0 v-58" fill="#fff" fill-opacity="0.14" stroke="#fff" stroke-width="3.4"/>
    <ellipse cx="160" cy="62" rx="44" ry="14" fill="#fff" fill-opacity="0.14" stroke="#fff" stroke-width="3.4"/>
    <path d="M116 82 a44 14 0 0 0 88 0" stroke="#fff" stroke-width="3" stroke-opacity="0.85"/>
    <path d="M116 101 a44 14 0 0 0 88 0" stroke="#fff" stroke-width="3" stroke-opacity="0.85"/>`,
  cs: () => `
    <rect x="124" y="59" width="72" height="72" rx="9" fill="#fff" fill-opacity="0.14" stroke="#fff" stroke-width="3.4"/>
    <rect x="146" y="81" width="28" height="28" rx="5" stroke="#fff" stroke-width="3" fill="#fff" fill-opacity="0.1"/>
    <g stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-opacity="0.9">
      <path d="M140 59 v-13 M160 59 v-13 M180 59 v-13"/><path d="M140 131 v13 M160 131 v13 M180 131 v13"/>
      <path d="M124 75 h-13 M124 95 h-13 M124 115 h-13"/><path d="M196 75 h13 M196 95 h13 M196 115 h13"/>
    </g>`,
};

const iconDataUri = (domain, accent) => {
  const body = ICONS[domain]?.(accent);
  if (!body) return null;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="70 20 180 150" width="360" height="300">${body}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/* ---------- 4. フォント（Noto Sans JP: japanese サブセット + 全スライスをフォールバック） ---------- */

const require_ = createRequire(pathToFileURL(join(ROOT, "package.json")));
const fontDir = join(dirname(require_.resolve("@fontsource/noto-sans-jp/package.json")), "files");

const loadFonts = (weight) => {
  const jp = readFileSync(join(fontDir, `noto-sans-jp-japanese-${weight}-normal.woff`));
  const slices = readdirSync(fontDir).filter((f) =>
    new RegExp(`^noto-sans-jp-\\d+-${weight}-normal\\.woff$`).test(f)
  );
  // 注意: satori は同名・同ウェイトのフォントを重複排除するため、スライスごとに一意名を付ける
  return [
    { name: "NotoSansJP", data: jp, weight, style: "normal" },
    ...slices.map((f, i) => ({
      name: `NSJ-${weight}-${i}`,
      data: readFileSync(join(fontDir, f)),
      weight,
      style: "normal",
    })),
  ];
};
const fonts = [...loadFonts(700), ...loadFonts(500)];

/* ---------- 5. OG 画像テンプレート ---------- */

const el = (type, props, ...children) => ({
  type,
  // 注意: 子が 0 個のとき undefined にする（空配列だと satori が「複数子」と誤判定する）
  props: { ...props, children: children.length === 0 ? undefined : children.length === 1 ? children[0] : children },
});

const titleSize = (t) => (t.length >= 40 ? 46 : t.length >= 26 ? 54 : 62);

const ogImage = async ({ accent, kicker, title, sub, iconDomain }) => {
  const icon = iconDataUri(iconDomain, accent);
  const svg = await satori(
    el(
      "div",
      { style: { width: 1200, height: 630, display: "flex", background: accent, fontFamily: "NotoSansJP", color: "#ffffff" } },
      el(
        "div",
        { style: { display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: "60px 0 56px 72px" } },
        el("div", { style: { display: "flex", fontSize: 30, fontWeight: 500, opacity: 0.92 } }, kicker),
        el(
          "div",
          { style: { display: "flex", flexDirection: "column" } },
          el("div", { style: { display: "flex", fontSize: titleSize(title), fontWeight: 700, lineHeight: 1.4, lineClamp: 3, paddingRight: 24 } }, title),
          ...(sub
            ? [el("div", { style: { display: "flex", fontSize: 27, fontWeight: 500, lineHeight: 1.6, opacity: 0.92, marginTop: 22, lineClamp: 2, paddingRight: 24 } }, sub)]
            : [])
        ),
        el(
          "div",
          { style: { display: "flex", alignItems: "center", gap: 18 } },
          el("div", { style: { width: 10, height: 40, background: "#ffffff", borderRadius: 3 } }),
          el("div", { style: { display: "flex", fontSize: 30, fontWeight: 700 } }, BRAND)
        )
      ),
      el(
        "div",
        { style: { display: "flex", width: 430, alignItems: "center", justifyContent: "center" } },
        ...(icon ? [el("img", { src: icon, width: 360, height: 300 })] : [])
      )
    ),
    { width: 1200, height: 630, fonts }
  );
  return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
};

/* ---------- 6. HTML メタ差し替え ---------- */

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const indexHtmlPath = join(DIST, "index.html");
if (!existsSync(indexHtmlPath)) {
  console.error(`dist/index.html がありません。先に vite build を実行してください: ${indexHtmlPath}`);
  process.exit(1);
}
const baseHtml = readFileSync(indexHtmlPath, "utf8");

const replaceMeta = (html, re, replacement) => {
  if (!re.test(html)) console.warn(`⚠ index.html にメタタグが見つかりません: ${re}`);
  return html.replace(re, replacement);
};

const buildHtml = ({ title, desc, url, image, type }) => {
  let out = baseHtml;
  out = replaceMeta(out, /<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
  out = replaceMeta(out, /(<meta name="description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  out = replaceMeta(out, /(<meta property="og:type" content=")[^"]*(")/, `$1${type}$2`);
  out = replaceMeta(out, /(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`);
  out = replaceMeta(out, /(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`);
  out = replaceMeta(out, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  out = replaceMeta(out, /(<meta property="og:image" content=")[^"]*(")/, `$1${image}$2`);
  return out;
};

const emit = (relDir, png, html) => {
  if (png) {
    mkdirSync(dirname(join(DIST, "learn", "og", relDir + ".png")), { recursive: true });
    writeFileSync(join(DIST, "learn", "og", relDir + ".png"), png);
  }
  const htmlDir = relDir === "learn" ? join(DIST, "learn") : join(DIST, "learn", relDir);
  mkdirSync(htmlDir, { recursive: true });
  writeFileSync(join(htmlDir, "index.html"), html);
};

/* ---------- 7. 生成 ---------- */

let count = 0;

// /learn ランディング
{
  const png = await ogImage({ accent: "#26313f", kicker: "Learn", title: "IT 教材ライブラリ", sub: LANDING_DESC, iconDomain: null });
  const html = buildHtml({ title: LANDING_TITLE, desc: LANDING_DESC, url: `${SITE}/learn`, image: `${SITE}/learn/og/learn.png`, type: "website" });
  mkdirSync(join(DIST, "learn", "og"), { recursive: true });
  writeFileSync(join(DIST, "learn", "og", "learn.png"), png);
  mkdirSync(join(DIST, "learn"), { recursive: true });
  writeFileSync(join(DIST, "learn", "index.html"), html);
  count++;
}

// コースページ + 記事ページ
for (const domain of domains) {
  const style = domainStyle(domain);
  const courseTitle = `${style.label} コース | ${BRAND}`;
  const coursePng = await ogImage({ accent: style.accent, kicker: "Learn ／ コース", title: `${style.label} コース`, sub: style.description, iconDomain: domain });
  emit(domain, coursePng, buildHtml({
    title: courseTitle,
    desc: style.description || LANDING_DESC,
    url: `${SITE}/learn/${domain}`,
    image: `${SITE}/learn/og/${domain}.png`,
    type: "website",
  }));
  count++;

  for (const a of articles.filter((a) => a.domain === domain)) {
    const sec = sectionLabel(domain, a.section);
    const png = await ogImage({
      accent: style.accent,
      kicker: `Learn ／ ${style.label}${sec ? ` — ${sec}` : ""}`,
      title: a.title,
      sub: null,
      iconDomain: domain,
    });
    emit(`${domain}/${a.id}`, png, buildHtml({
      title: `${a.title} | ${BRAND}`,
      desc: a.description || style.description || LANDING_DESC,
      url: `${SITE}/learn/${domain}/${a.id}`,
      image: `${SITE}/learn/og/${domain}/${a.id}.png`,
      type: "article",
    }));
    count++;
  }
}

console.log(`✅ OGP 生成完了: ${count} ページ（記事 ${articles.length} 本 + コース ${domains.length} + ランディング）→ dist/learn/`);
