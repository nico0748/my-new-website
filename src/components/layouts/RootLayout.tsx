import { useEffect } from "react";
import { Navigate, Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import { useAnalytics } from "../../lib/analytics";
import { installCardHover } from "../../lib/cardHover";

/** 旧 /learn/... を新 /nicotech/... へ置き換えてリダイレクト（クエリ・ハッシュ保持）。 */
export function LearnRedirect() {
  const loc = useLocation();
  const to = loc.pathname.replace(/^\/learn/, "/nicotech") + loc.search + loc.hash;
  return <Navigate to={to} replace />;
}

/** 全ページ共通の外枠（GA4 の page_view 送信・スクロール位置の管理・カードのホバー）。 */
export function RootLayout() {
  useAnalytics(); // GA4: ルート遷移ごとに page_view を送信（本番のみ）
  // .card-hover のカードを、カーソルの位置に合わせて少し傾けて浮かせる（document に 1 つだけ。lib/cardHover.ts）
  useEffect(() => installCardHover(), []);
  return (
    <>
      <Outlet />
      {/* 新しいページは先頭から、戻る / 進むでは元のスクロール位置を復元する */}
      <ScrollRestoration />
    </>
  );
}

