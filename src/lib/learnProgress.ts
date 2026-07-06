/** 学習進捗の永続化ヘルパー。
 *  - 見出し読了: `nicotech:read:/learn/<domain>/<id>#<anchor>`（kit.tsx / LearnLayout が書き込み）
 *  - 記事完了:   `nicotech:done:/learn/<domain>/<id>`（全見出し読了で LearnLayout が自動設定）
 *  進捗が変わると window に "nicotech:progress" イベントを発火し、各ページが再描画する。 */

import { useEffect, useState } from "react";
import type { LearnDomain } from "./learnCategories";
import { getEntriesByDomain } from "./learnRegistry";

export const donePath = (domain: string, id: string) => `/learn/${domain}/${id}`;
export const doneKey = (domain: string, id: string) => `nicotech:done:${donePath(domain, id)}`;

export const isArticleDone = (domain: string, id: string): boolean => {
  try {
    return localStorage.getItem(doneKey(domain, id)) === "1";
  } catch {
    return false;
  }
};

export const setArticleDone = (domain: string, id: string, v: boolean) => {
  try {
    if (v) localStorage.setItem(doneKey(domain, id), "1");
    else localStorage.removeItem(doneKey(domain, id));
  } catch {
    /* noop */
  }
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("nicotech:progress"));
};

/* ── 「続きから読む」: 最後に開いた記事を保持 ── */
const LAST_KEY = "nicotech:last";

export interface LastOpened {
  domain: LearnDomain;
  id: string;
}

export const setLastOpened = (domain: LearnDomain, id: string) => {
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify({ domain, id }));
    localStorage.setItem(`${LAST_KEY}:${domain}`, id);
  } catch {
    /* noop */
  }
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("nicotech:progress"));
};

/** 全体で最後に開いた記事（ランディングの「続きから」用）。 */
export const getLastOpened = (): LastOpened | null => {
  try {
    const raw = localStorage.getItem(LAST_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as LastOpened;
    return v && v.domain && v.id ? v : null;
  } catch {
    return null;
  }
};

/** そのコースで最後に開いた記事 id（コースページの「続きから」用）。 */
export const getLastOpenedInDomain = (domain: LearnDomain): string | null => {
  try {
    return localStorage.getItem(`${LAST_KEY}:${domain}`);
  } catch {
    return null;
  }
};

export interface CourseProgress {
  done: number;
  total: number;
  percent: number;
}

export const getCourseProgress = (domain: LearnDomain): CourseProgress => {
  const list = getEntriesByDomain(domain);
  const done = list.filter((e) => isArticleDone(domain, e.meta.id)).length;
  const total = list.length;
  return { done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
};

/** 進捗イベントで再描画するためのフック（値は使わずトリガーのみ）。 */
export const useProgressTick = () => {
  const [, force] = useState(0);
  useEffect(() => {
    const h = () => force((n) => n + 1);
    window.addEventListener("nicotech:progress", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("nicotech:progress", h);
      window.removeEventListener("storage", h);
    };
  }, []);
};
