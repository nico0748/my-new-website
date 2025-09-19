import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // react-router-domからBrowserRouterをインポート
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* アプリケーション全体をBrowserRouterで囲みます */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
