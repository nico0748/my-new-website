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

export interface TimelineItem {
    start: string;           // "YYYY-MM" または "YYYY"
    end?: string;            // "YYYY-MM" / "YYYY" / "present"（継続中）。単発なら空
    title: string;
    description: string;
    type: "education" | "work" | "project" | "other" | "certification";
    href?: string;           // 外部 URL、または "/projects/xxx" のようなサイト内パス
    status?: "done" | "upcoming";
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

export interface AnimeItem {
    id: string;
    title: string;
    official_site_url: string;
    release_season: string;
    twitter_avatar_url: string;
    official_site_twitter_image_url: string;
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

/** Timeline シート: start, end, title, description, type, href（旧 year 列にも対応）。新しい順に並べる。 */
export const mapTimelineData = (rows: SheetRow[]): TimelineItem[] => {
    return rows
        .filter(row => row.title && (row.start || row.year))
        .map(row => {
            const period = row.start
                ? { start: normalizeYm(row.start), end: normalizeEnd(row.end || "") }
                : parseLegacyYear(row.year);
            return {
                ...period,
                title: row.title.trim(),
                description: (row.description || "").trim(),
                type: (row.type as TimelineItem["type"]) || "other",
                href: row.href || undefined,
                status: (row.status as TimelineItem["status"]) || "done",
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

export const mapAnimeData = (rows: SheetRow[]): AnimeItem[] => {
    return rows.map(row => ({
        id: row.id || "",
        title: row.title || "",
        official_site_url: row.official_site_url || "",
        release_season: row.release_season || "",
        twitter_avatar_url: row.twitter_avatar_url || "",
        official_site_twitter_image_url: row.official_site_twitter_image_url || ""
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
