// Vercel Function: Spotify の「最近よく聴いている曲」（直近 4 週間のトップトラック）を返す。
//   GET /api/spotify  →  { "tracks": [{ title, artists, image, url }] }
//
// - 権限は user-top-read だけ。再生中の曲や再生履歴は取らない（生活時間が分かってしまうため）
// - トークン（client secret / refresh token / access token）はサーバーの外に出さない
// - 応答は曲名・アーティスト・ジャケット画像・Spotify の URL だけに絞る
// - CDN に 1 日キャッシュし、Spotify へのリクエストはリージョンごとに 1 日 1 回程度に抑える
// 設定手順は docs/spotify-setup.md。環境変数が無ければ空の配列を返す（ローカルの npm run dev では関数自体が動かない）。

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const TOP_TRACKS_URL = "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20";
const LIMIT = 5;

const send = (res, status, body, cache) => {
  res.setHeader("Cache-Control", cache);
  res.status(status).json(body);
};

async function getAccessToken() {
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) return null;
  const r = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
    signal: AbortSignal.timeout(5000),
  });
  if (!r.ok) throw new Error(`token ${r.status}`);
  const json = await r.json();
  if (json.refresh_token && json.refresh_token !== refresh) {
    // 環境変数は書き換えられないので、ログで知らせるだけにする（古いトークンもしばらくは使える）
    console.warn("[spotify] Spotify returned a new refresh token. Update SPOTIFY_REFRESH_TOKEN.");
  }
  return json.access_token;
}

/** ジャケット画像は 112px 以上で一番小さいもの（表示は 56px 角なので高解像度の画面でも粗くならない大きさ）。 */
const pickImage = (images = []) =>
  [...images].filter((i) => i?.url && (i.width ?? 0) >= 112).sort((a, b) => (a.width ?? 0) - (b.width ?? 0))[0]?.url ??
  images[0]?.url ??
  null;

const toTrack = (t) => ({
  title: String(t.name ?? ""),
  artists: (t.artists ?? []).map((a) => a?.name).filter(Boolean).join(", "),
  image: pickImage(t.album?.images),
  url: t.external_urls?.spotify ?? null,
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return send(res, 405, { tracks: [] }, "no-store");
  }
  // クエリを付けてキャッシュを外し、Spotify へ連打させることを防ぐ
  if (Object.keys(req.query ?? {}).length > 0) {
    return send(res, 400, { tracks: [] }, "public, s-maxage=86400");
  }

  try {
    const token = await getAccessToken();
    if (!token) return send(res, 200, { tracks: [] }, "public, s-maxage=300");

    const r = await fetch(TOP_TRACKS_URL, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) throw new Error(`top tracks ${r.status}`);
    const { items = [] } = await r.json();
    const tracks = items
      .filter((t) => t && !t.explicit && t.external_urls?.spotify)
      .slice(0, LIMIT)
      .map(toTrack);

    return send(res, 200, { tracks }, "public, s-maxage=86400, stale-while-revalidate=86400, stale-if-error=604800");
  } catch (e) {
    console.error("[spotify]", e instanceof Error ? e.message : e);
    return send(res, 200, { tracks: [] }, "public, s-maxage=300");
  }
}
