import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import NicoTechMark from "./NicoTechMark";
import LearnSearch from "./LearnSearch";
import { DOMAIN_ORDER, DOMAIN_STYLES } from "../../lib/learnCategories";
import type { LearnDomain } from "../../lib/learnCategories";
import "../../styles/learn.css";

interface TocItem {
  id: string;
  text: string;
}

interface Props {
  /** 現在のコース（ヘッダーのコースナビで active 表示） */
  activeDomain?: LearnDomain;
  /** サイドバーのナビ内容（章・記事リスト等） */
  sidebar: ReactNode;
  /** 本文 */
  children: ReactNode;
  /** true で本文中の h2[id] から「On this page」目次を自動生成＋スクロールスパイ */
  toc?: boolean;
}

const CheckIcon = () => (
  <svg className="toc-check" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LearnLayout = ({ activeDomain, sidebar, children, toc = false }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [readSet, setReadSet] = useState<Set<string>>(new Set());
  const { pathname } = useLocation();

  // ページ遷移（記事の切替）でスクロール位置を先頭へ戻す。
  // ハッシュ（#見出し）だけの移動では pathname が変わらないため、TOC ジャンプには影響しない。
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // 白背景に切替（ポートフォリオのダーク body を隠す）
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = "#ffffff";
    return () => {
      document.body.style.background = prev;
    };
  }, []);

  // スクロール進捗バー
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(h > 0 ? Math.min((window.scrollY / h) * 100, 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 本文の h2[id] から目次生成（lazy 描画に対応して MutationObserver で追従）
  useEffect(() => {
    if (!toc || !contentRef.current) return;
    const el = contentRef.current;
    const build = () => {
      const heads = Array.from(el.querySelectorAll<HTMLHeadingElement>("h2[id]"));
      setTocItems(heads.map((h) => ({ id: h.id, text: h.textContent || "" })));
    };
    build();
    const mo = new MutationObserver(build);
    mo.observe(el, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [toc, children]);

  // スクロールスパイ
  useEffect(() => {
    if (!toc || tocItems.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId((e.target as HTMLElement).id);
        });
      },
      { rootMargin: "-72px 0px -75% 0px", threshold: 0 }
    );
    tocItems.forEach((t) => {
      const el = document.getElementById(t.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [toc, tocItems]);

  // 読了状態を localStorage から取得し、目次に反映（progress イベントで更新）
  useEffect(() => {
    if (!toc) return;
    const compute = () => {
      const s = new Set<string>();
      tocItems.forEach((t) => {
        try {
          if (localStorage.getItem(`nicotech:read:${window.location.pathname}#${t.id}`) === "1") s.add(t.id);
        } catch {
          /* noop */
        }
      });
      setReadSet(s);
    };
    compute();
    window.addEventListener("nicotech:progress", compute);
    return () => window.removeEventListener("nicotech:progress", compute);
  }, [toc, tocItems]);

  const closeMenu = () => setMenuOpen(false);
  const readCount = tocItems.filter((t) => readSet.has(t.id)).length;

  // 全見出しを読了したら記事を「完了」に（コース進捗へ反映）
  useEffect(() => {
    if (!toc || tocItems.length === 0) return;
    const key = `nicotech:done:${window.location.pathname}`;
    try {
      if (readCount === tocItems.length) localStorage.setItem(key, "1");
      else localStorage.removeItem(key);
    } catch {
      /* noop */
    }
  }, [toc, tocItems.length, readCount]);

  return (
    <div className="learn-docs">
      {/* Header */}
      <header className="site-header">
        <button
          className="hamburger"
          aria-label="メニューを開く"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <Link to="/learn" className="logo">
          <NicoTechMark size={32} />
          <span className="logo-text">nico<span className="accent">Tech</span></span>
        </Link>
        <nav className="course-nav" aria-label="コース">
          {DOMAIN_ORDER.map((d) => (
            <Link key={d} to={`/learn/${d}`} className={activeDomain === d ? "active" : ""}>
              {DOMAIN_STYLES[d].label}
            </Link>
          ))}
        </nav>
        <button
          className="header-search"
          aria-label="記事を検索"
          onClick={() => window.dispatchEvent(new CustomEvent("nicotech:search-open"))}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span className="header-search-text">検索</span>
          <kbd>⌘K</kbd>
        </button>
        <Link to="/" className="back-link">← Portfolio</Link>
      </header>

      <LearnSearch />

      {/* Progress bar */}
      <div className="progress-bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Mobile overlay */}
      <div className={`sidebar-overlay ${menuOpen ? "open" : ""}`} onClick={closeMenu} />

      <div className="layout">
        {/* Sidebar */}
        <aside className={`sidebar ${menuOpen ? "open" : ""}`} aria-label="目次" onClick={closeMenu}>
          {sidebar}
          {toc && tocItems.length > 0 && (
            <>
              <div className="sidebar-chapter">
                読了 {readCount}/{tocItems.length}
              </div>
              <ul className="sidebar-nav toc-nav">
                {tocItems.map((t) => {
                  const isRead = readSet.has(t.id);
                  return (
                    <li key={t.id}>
                      <a
                        href={`#${t.id}`}
                        className={`${activeId === t.id ? "active" : ""}${isRead ? " read" : ""}`.trim()}
                      >
                        <span className="toc-mark">{isRead && <CheckIcon />}</span>
                        <span className="toc-label">{t.text}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </aside>

        {/* Main */}
        <main className="main-content">
          <div className="content-wrapper" ref={contentRef}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default LearnLayout;
