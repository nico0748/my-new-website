/** 記事 URL の OGP 画像を /api/ogp（Vercel Function）経由で取得する。結果はタブ内でキャッシュ。 */
const memory = new Map<string, Promise<string | null>>();
const KEY = (url: string) => `nico:ogp:${url}`;

export const fetchOgpImage = (url: string): Promise<string | null> => {
  const hit = memory.get(url);
  if (hit) return hit;

  const p = (async () => {
    try {
      const cached = sessionStorage.getItem(KEY(url));
      if (cached !== null) return cached || null;
    } catch {
      // storage 不可
    }
    try {
      const res = await fetch(`/api/ogp?url=${encodeURIComponent(url)}`);
      if (!res.ok || !res.headers.get("content-type")?.includes("application/json")) return null;
      const { image } = (await res.json()) as { image: string | null };
      try {
        sessionStorage.setItem(KEY(url), image ?? "");
      } catch {
        // storage 不可
      }
      return image;
    } catch {
      return null;
    }
  })();
  memory.set(url, p);
  return p;
};
