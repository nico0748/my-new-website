// Vercel Function: GitHub の公開リポジトリ（最近 push した順）とコントリビューションのカレンダーを返す。
//   GET /api/github  →  { "repos": [{ name, description, url, language, pushedOn }], "calendar": { total, weeks } | null }
//
// - GraphQL API v4 にクエリを 1 本だけ投げる（1 point）。トークンは公開リポジトリを読むだけの GITHUB_READ_TOKEN
// - 応答は表示に使う項目だけに絞る（GraphQL の応答をそのまま返さない）。
//   言語の色・スター数・リポジトリ名を含むコントリビューションの内訳・時刻は取らない
// - 成功は CDN に 6 時間キャッシュし、取り直しのあいだは 1 週間まで古い値を出す
// - 失敗は 502 + no-store（5xx はキャッシュされないので、CDN の正常な値を空で上書きしない）
// - トークンは応答にもログにも出さない
// 設定手順は docs/github-setup.md。トークンが無ければ空を返す（ローカルの npm run dev では関数自体が動かない）。

const GRAPHQL_URL = "https://api.github.com/graphql";
const LOGIN = "nico0748";
/** 返すリポジトリの URL（ほかの持ち主のリポジトリが混ざっても出さない） */
const REPO_URL = /^https:\/\/github\.com\/nico0748\//;

const QUERY = `query($login: String!) {
  user(login: $login) {
    repositories(first: 30, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false, isArchived: false,
                 orderBy: { field: PUSHED_AT, direction: DESC }) {
      nodes { name description url isPrivate pushedAt primaryLanguage { name } }
    }
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date weekday contributionCount contributionLevel } }
      }
    }
  }
}`;

const EMPTY = { repos: [], calendar: null };
const LEVEL = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };

const send = (res, status, body, cache) => {
  res.setHeader("Cache-Control", cache);
  res.status(status).json(body);
};

/**
 * 説明文から絵文字を除く（サイト全体で絵文字を出さないため）。
 * `:rocket:` のような略記と、Unicode の絵文字（肌の色・国旗・キーキャップの部品、付随する異体字セレクタ・ZWJ も）を消し、空白を詰める。
 */
const cleanDescription = (s) => {
  if (typeof s !== "string") return null;
  const t = s
    .replace(/:[a-z0-9_+-]+:/g, "")
    .replace(/[\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}\u{FE0E}\u{FE0F}\u{200D}\u{20E3}\u{E0020}-\u{E007F}]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
  return t || null;
};

/** "2026-10-28T15:04:05Z" → 日本時間の日付 "2026.10.29"（時刻は返さない） */
const toJstDate = (iso) => {
  const t = typeof iso === "string" ? Date.parse(iso) : NaN;
  return Number.isNaN(t) ? null : new Date(t + 9 * 36e5).toISOString().slice(0, 10).replace(/-/g, ".");
};

const toRepos = (nodes) =>
  (Array.isArray(nodes) ? nodes : [])
    .filter(
      (n) =>
        n &&
        n.isPrivate === false &&
        typeof n.name === "string" &&
        typeof n.url === "string" &&
        REPO_URL.test(n.url) &&
        // プロフィールの README 用のリポジトリ（nico0748/nico0748）は作ったものではないので出さない
        n.name.toLowerCase() !== LOGIN
    )
    .map((n) => ({
      name: n.name,
      description: cleanDescription(n.description),
      url: n.url,
      language: typeof n.primaryLanguage?.name === "string" ? n.primaryLanguage.name : null,
      pushedOn: toJstDate(n.pushedAt),
    }));

const toCalendar = (cal) => {
  if (!cal || !Array.isArray(cal.weeks)) return null;
  return {
    total: Number(cal.totalContributions) || 0,
    weeks: cal.weeks.map((w) =>
      (Array.isArray(w?.contributionDays) ? w.contributionDays : []).map((d) => ({
        date: d?.date,
        weekday: d?.weekday,
        count: d?.contributionCount,
        // 段階は GitHub の判定（contributionLevel）をそのまま使う。しきい値は持たない
        level: LEVEL[d?.contributionLevel] ?? 0,
      }))
    ),
  };
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, EMPTY, "no-store");
  }
  // クエリを付けてキャッシュを外し、GitHub へ連打させることを防ぐ
  if (Object.keys(req.query ?? {}).length > 0) {
    return send(res, 400, EMPTY, "public, s-maxage=86400");
  }

  // GITHUB_TOKEN は gh CLI などの権限の広いトークンを拾う恐れがあるので使わない
  const token = process.env.GITHUB_READ_TOKEN;
  if (!token) return send(res, 200, EMPTY, "public, s-maxage=300");

  try {
    const r = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "nico-labo748.dev",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
      signal: AbortSignal.timeout(5000),
    });
    if (r.status === 401 || r.status === 403) {
      throw new Error(`graphql ${r.status}: GITHUB_READ_TOKEN が無効か期限切れの可能性があります（403 は権限不足・レート制限のこともあります）`);
    }
    if (!r.ok) throw new Error(`graphql ${r.status}`);
    const json = await r.json();
    if (json?.errors) {
      const types = (Array.isArray(json.errors) ? json.errors : []).map((e) => e?.type || e?.message).filter(Boolean);
      throw new Error(`graphql errors: ${types.join(", ").slice(0, 200) || "unknown"}`);
    }
    const user = json?.data?.user;
    if (!user) throw new Error("graphql: user is null");

    const body = {
      repos: toRepos(user.repositories?.nodes),
      calendar: toCalendar(user.contributionsCollection?.contributionCalendar),
    };
    return send(res, 200, body, "public, s-maxage=21600, stale-while-revalidate=604800");
  } catch (e) {
    console.error("[github]", e instanceof Error ? `${e.name}: ${e.message}` : e);
    return send(res, 502, EMPTY, "no-store");
  }
}
