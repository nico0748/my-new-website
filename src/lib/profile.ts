import { fetchSheetData } from "./googleSheets";
import type { SheetRow } from "./googleSheets";
import { mapProfileData } from "./dataMapper";
import type { ProfileData } from "./dataMapper";
import { QIITA_PROFILE_URL } from "./articles";

export type SocialKind = "x" | "github" | "qiita" | "linkedin";

export interface SocialLink {
  kind: SocialKind;
  url: string;
  /** 表示する ID。省略時は URL から自動で取り出す。 */
  label?: string;
}

export const SOCIAL_NAMES: Record<SocialKind, string> = { x: "X", github: "GitHub", qiita: "Qiita", linkedin: "LinkedIn" };

/**
 * Profile シートの取得をアプリ全体で 1 回にまとめる。
 * トップの自己紹介と、全ページのフッターの SNS リンクが同じ結果を使う（ページを移っても読み直さない）。
 * シートを読めないとき（API キーが無い・失敗した）は null。
 */
let cache: ProfileData | null = null;
let pending: Promise<ProfileData | null> | null = null;

export const getCachedProfile = (): ProfileData | null => cache;

export const fetchProfile = (): Promise<ProfileData | null> => {
  if (cache) return Promise.resolve(cache);
  if (!pending) {
    pending = fetchSheetData<SheetRow>("Profile")
      .then((rows) => {
        if (rows.length === 0) return null;
        cache = mapProfileData(rows);
        return cache;
      })
      .catch(() => {
        pending = null;
        return null;
      });
  }
  return pending;
};

/**
 * Profile シートの各 URL からソーシャルリンクを作る（X → GitHub → Qiita → LinkedIn の順、URL が無いものは出さない）。
 * Qiita だけは記事の取得と同じユーザーを既定値にする。
 */
export const socialLinksOf = (profile: ProfileData | null): SocialLink[] => {
  const candidates: { kind: SocialKind; url?: string; label?: string }[] = [
    { kind: "x", url: profile?.xUrl },
    { kind: "github", url: profile?.githubUrl },
    { kind: "qiita", url: profile?.qiitaUrl || QIITA_PROFILE_URL },
    // LinkedIn は URL の ID が「名-姓」になるため、表示名は Profile シートの linkedinLabel を優先
    { kind: "linkedin", url: profile?.linkedinUrl, label: profile?.linkedinLabel },
  ];
  return candidates.filter((l): l is SocialLink => !!l.url);
};
