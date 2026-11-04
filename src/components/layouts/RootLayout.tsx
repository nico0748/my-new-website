import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAnalytics } from "../../lib/analytics";

/** 旧 /learn/... を新 /nicotech/... へ置き換えてリダイレクト（クエリ・ハッシュ保持）。 */
export function LearnRedirect() {
  const loc = useLocation();
  const to = loc.pathname.replace(/^\/learn/, "/nicotech") + loc.search + loc.hash;
  return <Navigate to={to} replace />;
}

/** 全ページ共通の外枠（GA4 の page_view 送信）。 */
export function RootLayout() {
  useAnalytics(); // GA4: ルート遷移ごとに page_view を送信（本番のみ）
  return <Outlet />;
}

