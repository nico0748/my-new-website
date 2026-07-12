/** Google Analytics 4（GA4）計測ヘルパー。
 *  - Measurement ID は env `VITE_GA_MEASUREMENT_ID`（例: G-XXXXXXXXXX）で設定
 *  - 本番ビルド（import.meta.env.PROD）かつ ID がある時のみ有効。dev では無効
 *  - SPA なので `send_page_view:false` にして、ルート遷移ごとに手動で page_view 送信
 *    （初回ロードも useAnalytics の効果で送信される）
 */

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
const enabled = !!GA_ID && import.meta.env.PROD;
let started = false;

/** gtag.js を読み込み、GA4 を初期化する（1 回だけ）。 */
export const initGA = () => {
  if (!enabled || started || typeof document === "undefined") return;
  started = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // gtag.js は「arguments オブジェクト」の push を前提とする（公式スニペットと同形にする）。
  function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag as (...args: unknown[]) => void;
  window.gtag("js", new Date());
  // SPA: 自動 page_view を止め、ルート遷移ごとに手動送信する
  window.gtag("config", GA_ID, { send_page_view: false });
};

/** ページビューを送信（ルート遷移ごと）。 */
export const pageview = (path: string) => {
  if (!enabled || typeof window.gtag !== "function") return;
  window.gtag("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
};

/** 任意のカスタムイベントを送信（例: trackEvent("cta_click", { id })）。 */
export const trackEvent = (name: string, params?: Record<string, unknown>) => {
  if (!enabled || typeof window.gtag !== "function") return;
  window.gtag("event", name, params ?? {});
};

/** App 直下で呼ぶと GA4 を初期化し、ルート遷移を page_view として計測する。 */
export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    initGA();
  }, []);

  useEffect(() => {
    pageview(location.pathname + location.search);
  }, [location.pathname, location.search]);
};
