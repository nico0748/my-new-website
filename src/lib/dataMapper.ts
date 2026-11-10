import type { SheetRow } from "./googleSheets";

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  markdownFile?: string; // /projects/<id>.md など
  /** 制作期間。例: "2025.04 - 2025.07" / "2026.10 -"（継続中） */
  period?: string;
  /** 詳細ページのギャラリー（サムネイルの後ろに並ぶ追加画像）。シートではカンマ区切り */
  images?: string[];
}

export interface Skill {
    name: string;
    level: number;
    description?: string;
    experienceYears?: number;
    libraries?: string[];
    comment?: string;
    logo?: string;
}
export interface SkillCategory {
    category: string;
    skills: Skill[];
}

/** Timeline の詳細ポップアップに並べるリンク。url は https:// かサイト内パス（/ で始まる）だけ。 */
export interface TimelineLink {
    label: string;
    url: string;
}

export interface TimelineItem {
    /** ポップアップの URL（?timeline=）に使う。シートの id 列。空なら start とタイトルから作る */
    id: string;
    start: string;           // "YYYY-MM" または "YYYY"
    end?: string;            // "YYYY-MM" / "YYYY" / "present"（継続中）。単発なら空
    title: string;
    description: string;
    type: "education" | "work" | "project" | "other" | "certification";
    href?: string;           // 外部 URL、または "/projects/xxx" のようなサイト内パス
    status?: "done" | "upcoming";
    /** 所属先・主催（ポップアップのタイトルの下に出す）。例 "TempestAI株式会社" */
    org?: string;
    /** ポップアップだけに出す詳しい説明。改行で段落を分ける */
    detail?: string;
    /** ポップアップのリンク（href の後ろに並ぶ）。シートでは 1 行に 1 つ「ラベル | URL」 */
    links: TimelineLink[];
    /** 使った技術・分野など。シートではカンマ区切り */
    tags: string[];
}

export interface ProfileData {
    name: string;
    title: string;
    description: string;
    image: string;
    blogUrl?: string;
    githubUrl?: string;
    qiitaUrl?: string;
    xUrl?: string;
    linkedinUrl?: string;
    /** LinkedIn の表示名（URL の ID と違う表記にしたいとき）。Profile シートの linkedinLabel */
    linkedinLabel?: string;
}

export interface ArticleItem {
  id: string;
  title: string;
  url: string;             // 記事本体（外部サイト）への URL
  platform: string;        // "Qiita" | "Zenn" | "note" など（URL から自動判定）
  date: string;            // YYYY-MM-DD
  tags: string[];
  likes?: number;
  image?: string;          // OGP 画像を上書きしたい場合のみ（Articles シートの image 列）
}

export const mapProfileData = (rows: SheetRow[]): ProfileData => {
    const profile: Record<string, string> = {};
    rows.forEach(row => {
        if (row.key && row.value) {
            profile[row.key] = row.value;
        }
    });
    return {
        name: profile.name || "",
        title: profile.title || "",
        description: profile.description || "",
        image: profile.image || "/sns_icon_round.png",
        blogUrl: profile.blogUrl || undefined,
        githubUrl: profile.githubUrl || undefined,
        qiitaUrl: profile.qiitaUrl || undefined,
        xUrl: profile.xUrl || undefined,
        linkedinUrl: profile.linkedinUrl || undefined,
        linkedinLabel: profile.linkedinLabel || undefined,
    };
};

export const mapSkillsData = (rows: SheetRow[]): SkillCategory[] => {
    const categories: { [key: string]: Skill[] } = {};
    
    rows.forEach(row => {
        const cat = row.category;
        const name = row.name;
        const level = parseInt(row.level, 10) || 0;

        if (!cat || !name) return;

        if (!categories[cat]) {
            categories[cat] = [];
        }
        categories[cat].push({
            name,
            level,
            description: row.description || undefined,
            experienceYears: row.experienceYears ? parseInt(row.experienceYears, 10) : undefined,
            libraries: row.libraries ? row.libraries.split(',').map((l: string) => l.trim()).filter(Boolean) : undefined,
            comment: row.comment || undefined,
            logo: row.logo || undefined,
        });
    });

    return Object.keys(categories).map(cat => ({
        category: cat,
        skills: categories[cat]
    }));
};

/** "2025/04", "2025-4", "2025.04", "2025" などを "YYYY-MM" / "YYYY" に正規化する。 */
const normalizeYm = (v: string): string => {
    const m = /^(\d{4})(?:\s*[/.\-年]\s*(\d{1,2}))?/.exec(v.trim());
    if (!m) return "";
    return m[2] ? `${m[1]}-${m[2].padStart(2, "0")}` : m[1];
};

const normalizeEnd = (v: string): string | undefined => {
    const t = v.trim().toLowerCase();
    if (!t) return undefined;
    if (["present", "now", "現在", "~", "〜"].includes(t)) return "present";
    return normalizeYm(t) || undefined;
};

/** 旧形式の year 列（"2026/05~" / "2025/04~07" / "2025/02"）を start / end に分解する。 */
const parseLegacyYear = (v: string): { start: string; end?: string } => {
    const m = /^(\d{4})\s*[/.-]?\s*(\d{1,2})?\s*([~〜-])?\s*(\d{1,2})?/.exec(v.trim());
    if (!m) return { start: "" };
    const start = m[2] ? `${m[1]}-${m[2].padStart(2, "0")}` : m[1];
    if (m[4]) return { start, end: `${m[1]}-${m[4].padStart(2, "0")}` };
    return { start, end: m[3] ? "present" : undefined };
};

/** リンクに使ってよい URL か（https:// かサイト内パスだけ。javascript: などは捨てる）。 */
const isSafeLink = (url: string) => /^https:\/\/[^\s]+$/i.test(url) || /^\/(?!\/)[^\s]*$/.test(url);

/**
 * links 列: 1 行に 1 つ「ラベル | URL」。ラベルを省いて URL だけでもよい（表示はホスト名）。
 * 区切りは「|」のほか全角の「｜」も可。使えない URL の行は捨てる。
 */
const parseTimelineLinks = (v: string): TimelineLink[] =>
    v
        .split(/\r?\n/)
        .map((line) => {
            const parts = line.split(/[|｜]/).map((t) => t.trim()).filter(Boolean);
            if (parts.length === 0) return null;
            const url = parts[parts.length - 1];
            const label = parts.length > 1 ? parts.slice(0, -1).join(" | ") : "";
            return isSafeLink(url) ? { label, url } : null;
        })
        .filter((l): l is TimelineLink => l !== null);

/** id 列が空のときの id（start とタイトルから。行の並びが変わっても変わらない）。 */
const fallbackTimelineId = (start: string, title: string) => {
    let h = 5381;
    for (const ch of title) h = ((h << 5) + h + ch.codePointAt(0)!) >>> 0;
    return `${start || "item"}-${h.toString(36)}`;
};

/**
 * Timeline シート: start, end, title, description, type, href（旧 year 列にも対応）と、
 * ポップアップ用の id, org, detail, links, tags。新しい順に並べる。
 */
export const mapTimelineData = (rows: SheetRow[]): TimelineItem[] => {
    return rows
        .filter(row => row.title && (row.start || row.year))
        .map(row => {
            const period = row.start
                ? { start: normalizeYm(row.start), end: normalizeEnd(row.end || "") }
                : parseLegacyYear(row.year);
            const title = row.title.trim();
            const href = (row.href || "").trim();
            return {
                ...period,
                id: (row.id || "").trim() || fallbackTimelineId(period.start, title),
                title,
                description: (row.description || "").trim(),
                type: (row.type as TimelineItem["type"]) || "other",
                href: href && isSafeLink(href) ? href : undefined,
                status: (row.status as TimelineItem["status"]) || "done",
                org: (row.org || "").trim() || undefined,
                detail: (row.detail || "").trim() || undefined,
                links: parseTimelineLinks(row.links || ""),
                tags: row.tags ? row.tags.split(/[,、]/).map((t) => t.trim()).filter(Boolean) : [],
            };
        })
        .sort((a, b) => (a.start < b.start ? 1 : a.start > b.start ? -1 : 0));
};

export const mapPortfolioData = (rows: SheetRow[]): PortfolioItem[] => {
    return rows.map(row => ({
        id: row.id,
        title: row.title,
        description: row.description,
        thumbnail: row.thumbnail,
        tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
        liveUrl: row.liveUrl,
        repoUrl: row.repoUrl,
        markdownFile: row.markdownFile || `/projects/${row.id}.md`,
        period: row.period?.trim() || undefined,
        images: row.images ? row.images.split(',').map(t => t.trim()).filter(Boolean) : [],
    }));
};

/** URL のホスト名から掲載先プラットフォーム名を推定する。 */
export const detectPlatform = (url: string): string => {
    try {
        const host = new URL(url).hostname.replace(/^www\./, "");
        if (host.endsWith("qiita.com")) return "Qiita";
        if (host.endsWith("zenn.dev")) return "Zenn";
        if (host.endsWith("note.com")) return "note";
        if (host.includes("hatenablog") || host.includes("hatena")) return "はてなブログ";
        if (host.endsWith("speakerdeck.com")) return "Speaker Deck";
        if (host.endsWith("medium.com")) return "Medium";
        return host;
    } catch {
        return "";
    }
};

/** Google Sheets「Articles」シート（任意）: id, title, url, platform, date, tags */
export const mapArticleData = (rows: SheetRow[]): ArticleItem[] => {
    return rows
        .filter(row => row.title && row.url)
        .map(row => ({
            id: row.id || row.url,
            title: row.title,
            url: row.url,
            platform: row.platform || detectPlatform(row.url),
            date: (row.date || "").slice(0, 10),
            tags: row.tags ? row.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
            image: row.image || undefined,
        }));
};

// ---------------------------------------------------------------------------
// Off-hours（趣味の記録）: OffHours シート date, category, title, subtitle, url, image
// ⚠️ シートは公開されている（API キーがバンドルに入るため）。全年齢・公開してよい記録だけを書く。
// ---------------------------------------------------------------------------

export type OffHoursCategory = "anime" | "music" | "indie" | "event";

export interface OffHoursItem {
    category: OffHoursCategory;
    /** "YYYY-MM-DD" */
    date: string;
    title: string;
    subtitle?: string;
    url?: string;
    image?: string;
}

/** シートの category 列（ドロップダウンの日本語ラベル / 英字キーのどちらでも可）→ キー */
const OFF_HOURS_CATEGORY: Record<string, OffHoursCategory> = {
    anime: "anime", アニメ: "anime",
    music: "music", 音楽: "music",
    indie: "indie", dlsite: "indie", 同人作品: "indie",
    event: "event", イベント: "event",
};

/** DLsite の全年齢フロアだけを許可する（成人向けフロアの URL を持つ行は行ごと捨てる）。 */
const ALL_AGES_DLSITE_FLOORS = ["home", "comic", "soft"];

/** "2026-10-12" / "2026/10/12" / "2026.10.12" / "2026年10月12日" → "2026-10-12"。日まで無いものは "" */
const normalizeYmd = (v: string): string => {
    const m = /^(\d{4})\s*[/.\-年]\s*(\d{1,2})\s*[/.\-月]\s*(\d{1,2})/.exec(v.trim());
    if (!m) return "";
    return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
};

/** 日本時間の今日 "YYYY-MM-DD" */
const todayJst = (): string => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

const httpsUrl = (v?: string): URL | null => {
    try {
        const u = new URL((v || "").trim());
        return u.protocol === "https:" ? u : null;
    } catch {
        return null;
    }
};

/** image 列: https の URL か、public/off-hours/ 配下のパスだけを受け付ける。 */
const offHoursImage = (v?: string): string | undefined => {
    const t = (v || "").trim();
    if (/^\/off-hours\/[\w./-]+$/.test(t) && !t.includes("..")) return t;
    return httpsUrl(t)?.href;
};

/**
 * OffHours シートを型付きの記録に変換し、日付の新しい順に並べる（同じ日付ならシートで後の行を先に）。
 * - 未来の日付は出さない。イベントは当日も出さない（居場所を知らせないため、翌日以降に表示）
 * - 同人作品: DLsite は全年齢フロアの URL だけ。画像は使わない
 */
export const mapOffHoursData = (rows: SheetRow[], today: string = todayJst()): OffHoursItem[] => {
    const items: { item: OffHoursItem; order: number }[] = [];
    rows.forEach((row, order) => {
        const category = OFF_HOURS_CATEGORY[(row.category || "").trim().toLowerCase()];
        const date = normalizeYmd(row.date || "");
        const title = (row.title || "").trim();
        if (!category || !date || !title) return;
        if (date > today || (category === "event" && date >= today)) return;

        const url = httpsUrl(row.url);
        if (category === "indie" && url && /(^|\.)dlsite\.com$/.test(url.hostname)) {
            const floor = url.pathname.split("/").filter(Boolean)[0] ?? "";
            if (!ALL_AGES_DLSITE_FLOORS.includes(floor)) return;
        }

        items.push({
            item: {
                category,
                date,
                title,
                subtitle: (row.subtitle || "").trim() || undefined,
                url: url?.href,
                image: category === "indie" ? undefined : offHoursImage(row.image),
            },
            order,
        });
    });
    return items
        .sort((a, b) =>
            a.item.date === b.item.date ? b.order - a.order : a.item.date < b.item.date ? 1 : -1
        )
        .map((x) => x.item);
};

// ---------------------------------------------------------------------------
// アニメの視聴記録（Annict から同期しているシート all-watching-anime / all-watched-anime / all-wanna-watch-anime）
// 列: id, title, official_site_url, release_season, twitter_avatar_url, official_site_twitter_image_url,
//     media, episodes_count, watchers_count, original, director, studio, cast, wikipedia_url, twitter_hashtag,
//     isFavorite（「見てる」「見た」のシートだけ。チェックボックス）
// 同期は Apps Script（scripts/gas/annict-sync.gs）が 6 時間ごとに行う。サイトは読むだけ。
// 詳細の列が空の作品もある（空なら表示しない）。
// ---------------------------------------------------------------------------

/** Annict の記録の状態。watching = 見てる / watched = 見た / wanna = 見たい */
export type AnimeStatus = "watching" | "watched" | "wanna";

export interface AnimeCast {
    /** キャラクター名（無いこともある） */
    character?: string;
    /** 声優名 */
    actor: string;
}

export interface AnimeWork {
    id: string;
    title: string;
    /** 放送クール（例 "2026年夏"）。年だけのこともある */
    season: string;
    status: AnimeStatus;
    /** 公式サイト */
    url?: string;
    /** 横長のキービジュアル（公式サイトの OGP 画像） */
    image?: string;
    /** 公式 X のアイコン（キービジュアルが無い・読めないときの代わり） */
    avatar?: string;
    /** 種別（TV / 映画 / OVA / Web / その他） */
    media?: string;
    episodes?: number;
    /** Annict で記録している人数 */
    watchers?: number;
    original?: string;
    director?: string;
    studio?: string;
    cast: AnimeCast[];
    wikipediaUrl?: string;
    /** 公式ハッシュタグ（# は付けない） */
    hashtag?: string;
    /** お気に入り（シートの isFavorite にチェック） */
    favorite: boolean;
}

export type AnimeSeasonKey = "winter" | "spring" | "summer" | "autumn";

/**
 * 1 年の中の季節の順（Annict の区分: 冬 = 1〜3 月、春 = 4〜6 月、夏 = 7〜9 月、秋 = 10〜12 月）。
 * 文字の並び（夏・冬・春・秋）で並べると崩れるので、季節の比較は必ずこの順を使う。
 */
export const ANIME_SEASONS: readonly { key: AnimeSeasonKey; label: string }[] = [
    { key: "winter", label: "冬" },
    { key: "spring", label: "春" },
    { key: "summer", label: "夏" },
    { key: "autumn", label: "秋" },
];

/** "2026年夏" → { year: 2026, season: "summer" }。年だけ（"2027年"）なら season なし、年も無ければ null。 */
export const parseSeason = (text: string): { year: number; season?: AnimeSeasonKey } | null => {
    const m = /(\d{4})\s*年?\s*(冬|春|夏|秋)?/.exec(text || "");
    if (!m) return null;
    const season = ANIME_SEASONS.find((s) => s.label === m[2])?.key;
    return season ? { year: Number(m[1]), season } : { year: Number(m[1]) };
};

/** "2026年夏" → 20263（年 × 10 + 季節の順 1〜4）。年だけなら 0、年も無ければ -1。並べ替え用。 */
export const seasonRank = (text: string): number => {
    const p = parseSeason(text);
    if (!p) return -1;
    return p.year * 10 + (p.season ? ANIME_SEASONS.findIndex((s) => s.key === p.season) + 1 : 0);
};

/** 放送クールの新しい順（同じクールなら Annict の ID の大きい順）。 */
export const sortAnime = (works: AnimeWork[]): AnimeWork[] =>
    [...works].sort((a, b) => seasonRank(b.season) - seasonRank(a.season) || Number(b.id) - Number(a.id));

/** 画像の URL。http の画像は https に読み替える（そのままだと混在コンテンツで読まれないため）。 */
const animeImage = (v?: string): string | undefined =>
    httpsUrl((v || "").trim().replace(/^http:\/\//i, "https://"))?.href;

/** Wikipedia の URL。Annict には http のものが多いので https に読み替える（Wikipedia 以外の URL は出さない）。 */
const wikiUrl = (v?: string): string | undefined => {
    const u = httpsUrl((v || "").trim().replace(/^http:\/\//i, "https://"));
    return u && /(^|\.)wikipedia\.org$/i.test(u.hostname) ? u.href : undefined;
};

const positiveInt = (v?: string): number | undefined => {
    const n = Number((v || "").replace(/[,\s]/g, ""));
    return Number.isInteger(n) && n > 0 ? n : undefined;
};

/** cast 列: 1 行に 1 人、「キャラクター名：声優名」（キャラクター名が無ければ声優名だけ）。 */
const parseCast = (v?: string): AnimeCast[] =>
    (v || "")
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const i = line.lastIndexOf("：");
            return i > 0 ? { character: line.slice(0, i).trim(), actor: line.slice(i + 1).trim() } : { actor: line };
        })
        .filter((c) => c.actor);

const text = (v?: string): string | undefined => (v || "").trim() || undefined;

/** 1 枚のシート（1 つの状態）を作品の一覧にする。URL は https のものだけ残す。並びは放送クールの新しい順。 */
export const mapAnimeRows = (rows: SheetRow[], status: AnimeStatus): AnimeWork[] => {
    const seen = new Set<string>();
    const works: AnimeWork[] = [];
    rows.forEach((row) => {
        const id = (row.id || "").trim();
        const title = (row.title || "").trim();
        if (!id || !title || seen.has(id)) return;
        seen.add(id);
        works.push({
            id,
            title,
            season: (row.release_season || "").trim(),
            status,
            url: httpsUrl(row.official_site_url)?.href,
            image: animeImage(row.official_site_twitter_image_url),
            avatar: animeImage(row.twitter_avatar_url),
            media: text(row.media),
            episodes: positiveInt(row.episodes_count),
            watchers: positiveInt(row.watchers_count),
            original: text(row.original),
            director: text(row.director),
            studio: text(row.studio),
            cast: parseCast(row.cast),
            wikipediaUrl: wikiUrl(row.wikipedia_url),
            hashtag: text((row.twitter_hashtag || "").replace(/^#/, "")),
            favorite: /^(true|1)$/i.test((row.isFavorite || "").trim()),
        });
    });
    return sortAnime(works);
};
