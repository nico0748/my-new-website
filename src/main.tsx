import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import { appRoutes } from "./App.tsx";

// Service Worker の登録。autoUpdate なので、デプロイ後に新しい SW が有効になったら一度だけ自動で読み込み直す。
// これが無いと、前に訪れた人はデプロイ後の 1 回目に SW のキャッシュにある古い版を見ることになる
// （古い版が消したファイルを取りに行き、作品詳細が「準備中」になるなど）。初めての訪問では読み込み直さない。
registerSW({ immediate: true });

// <Link viewTransition>（一覧 → 詳細の共有要素モーフ）は data router でしか効かないため、
// BrowserRouter ではなく createBrowserRouter を使う。ルート定義は App.tsx の appRoutes。
const router = createBrowserRouter(createRoutesFromElements(appRoutes));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* reducedMotion="user": OS の「視差効果を減らす」設定時に
        全 motion コンポーネントの transform/layout アニメを自動で抑制する */}
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  </React.StrictMode>
);
