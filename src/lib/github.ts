/**
 * GitHub の公開リポジトリとコントリビューション（/api/github、Vercel Function）。
 * API 由来の型はここに置く（dataMapper.ts はシートの行を変換するためのもの）。
 */
export interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  /** 最後に push した日（日本時間）。例 "2026.10.28" */
  pushedOn: string | null;
}

export interface ContributionDay {
  /** "2026-11-05"。Date で読み直さず文字列のまま扱う */
  date: string;
  /** 0 = 日曜 〜 6 = 土曜 */
  weekday: number;
  count: number;
  /** GitHub の contributionLevel（NONE 〜 FOURTH_QUARTILE）を 0〜4 にしたもの */
  level: 0 | 1 | 2 | 3 | 4;
}

export interface ContributionCalendar {
  total: number;
  /** 週ごとの日（最初と最後の週は欠けていることがある） */
  weeks: ContributionDay[][];
}

export interface GitHubActivity {
  repos: GitHubRepo[];
  calendar: ContributionCalendar | null;
}

/** 取得するユーザー（api/github.js の LOGIN と同じ）。リンク先は Profile シートの githubUrl が無いときだけこれを使う。 */
const GITHUB_USER = "nico0748";
const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USER}`;

export const EMPTY_GITHUB_ACTIVITY: GitHubActivity = { repos: [], calendar: null };

/** 受け取るリポジトリの URL（関数側でも同じ持ち主に絞っている） */
const REPO_URL = new RegExp(`^https://github\\.com/${GITHUB_USER}/[^/?#]+$`);

let pending: Promise<GitHubActivity> | null = null;
let cache: GitHubActivity | null = null;

export const getCachedGitHubActivity = (): GitHubActivity | null => cache;

const toRepo = (r: unknown): GitHubRepo | null => {
  const v = r as Record<string, unknown> | null;
  if (!v || typeof v.name !== "string" || !v.name || typeof v.url !== "string" || !REPO_URL.test(v.url)) return null;
  return {
    name: v.name,
    description: typeof v.description === "string" && v.description.trim() ? v.description : null,
    url: v.url,
    language: typeof v.language === "string" && v.language ? v.language : null,
    pushedOn: typeof v.pushedOn === "string" && /^\d{4}\.\d{2}\.\d{2}$/.test(v.pushedOn) ? v.pushedOn : null,
  };
};

const isDay = (d: unknown): d is ContributionDay => {
  const v = d as ContributionDay | null;
  return (
    !!v &&
    typeof v.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(v.date) &&
    Number.isInteger(v.weekday) &&
    v.weekday >= 0 &&
    v.weekday <= 6 &&
    Number.isInteger(v.count) &&
    v.count >= 0 &&
    Number.isInteger(v.level) &&
    v.level >= 0 &&
    v.level <= 4
  );
};

/** 形が 1 か所でも違えば null（欠けたままマス目を並べない）。 */
const toCalendar = (c: unknown): ContributionCalendar | null => {
  const v = c as { total?: unknown; weeks?: unknown } | null;
  if (!v || typeof v.total !== "number" || !Number.isInteger(v.total) || v.total < 0 || !Array.isArray(v.weeks)) return null;
  const weeks = v.weeks as unknown[];
  if (!weeks.every((w) => Array.isArray(w) && w.length > 0 && w.length <= 7 && w.every(isDay))) return null;
  return { total: v.total, weeks: weeks as ContributionDay[][] };
};

/**
 * 取得できなければ空。JSON 以外は「無し」として扱う（ローカルの npm run dev では関数が動かず関数のソースがそのまま返り、
 * 古い Service Worker の残ったブラウザでは index.html が返ることがある）。
 * 失敗したあとはこのタブでは取り直さない（失敗の応答はキャッシュされないので、トップに戻るたびに GitHub まで届かせない）。
 */
export const fetchGitHubActivity = (): Promise<GitHubActivity> => {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = (async () => {
      try {
        const res = await fetch("/api/github");
        if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return EMPTY_GITHUB_ACTIVITY;
        const json = (await res.json()) as { repos?: unknown; calendar?: unknown } | null;
        if (!json || !Array.isArray(json.repos)) return EMPTY_GITHUB_ACTIVITY;
        cache = {
          repos: json.repos.map(toRepo).filter((r): r is GitHubRepo => r !== null),
          calendar: toCalendar(json.calendar),
        };
        return cache;
      } catch {
        return EMPTY_GITHUB_ACTIVITY;
      }
    })();
  }
  return pending;
};

/** "https://github.com/Nico0748/Paperlens.git/" → "https://github.com/nico0748/paperlens" */
const normalizeRepoUrl = (u: string) =>
  u.trim().toLowerCase().replace(/\/+$/, "").replace(/\.git$/, "").replace(/\/+$/, "");

/**
 * トップに出すリポジトリを選ぶ（WORKS 以外のコードを見せる欄にする）。
 * 1. Projects シートの repoUrl に載っているリポジトリを除く
 * 2. 説明のあるものを優先し、3 件に満たないときだけ説明の無いもので埋める
 * 3. 最近 push した順のまま先頭から limit 件
 */
export const pickRepos = (repos: GitHubRepo[], workRepoUrls: (string | undefined)[], limit = 3): GitHubRepo[] => {
  const works = new Set(workRepoUrls.filter((u): u is string => !!u?.trim()).map(normalizeRepoUrl));
  const rest = repos.filter((r) => !works.has(normalizeRepoUrl(r.url)));
  const described = rest.filter((r) => r.description);
  return (described.length >= limit ? described : [...described, ...rest.filter((r) => !r.description)]).slice(0, limit);
};

/** 「すべてのリポジトリを見る」のリンク先（Profile シートの githubUrl に ?tab=repositories）。 */
export const githubReposUrl = (profileUrl?: string): string => {
  try {
    const u = new URL(profileUrl?.trim() || GITHUB_PROFILE_URL);
    if (u.protocol !== "https:") throw new Error("not https");
    u.searchParams.set("tab", "repositories");
    return u.toString();
  } catch {
    return `${GITHUB_PROFILE_URL}?tab=repositories`;
  }
};
