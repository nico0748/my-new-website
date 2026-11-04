/** Spotify の「最近よく聴いている曲」（/api/spotify、Vercel Function）。 */
export interface SpotifyTrack {
  title: string;
  artists: string;
  image: string | null;
  url: string;
}

let pending: Promise<SpotifyTrack[]> | null = null;
let cache: SpotifyTrack[] | null = null;

export const getCachedTopTracks = (): SpotifyTrack[] | null => cache;

const isTrack = (t: unknown): t is SpotifyTrack => {
  const v = t as SpotifyTrack;
  return !!v && typeof v.title === "string" && typeof v.url === "string" && /^https:\/\/open\.spotify\.com\//.test(v.url);
};

/**
 * 取得できなければ空の配列（ローカルの npm run dev では関数が動かず index.html が返るので、
 * JSON 以外は「無し」として扱う）。
 */
export const fetchTopTracks = (): Promise<SpotifyTrack[]> => {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = (async () => {
      try {
        const res = await fetch("/api/spotify");
        if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return [];
        const { tracks } = (await res.json()) as { tracks?: unknown[] };
        cache = Array.isArray(tracks)
          ? tracks.filter(isTrack).map((t) => ({ ...t, image: t.image && /^https:\/\//.test(t.image) ? t.image : null }))
          : [];
        return cache;
      } catch {
        pending = null;
        return [];
      }
    })();
  }
  return pending;
};
