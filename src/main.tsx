import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom' // react-router-domからBrowserRouterをインポート
import './index.css'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter /* basename="/" はルート配信なら省略可 */>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);