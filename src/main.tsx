import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { RouterProvider } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import "./index.css";
import { appRoutes } from "./App.tsx";

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
