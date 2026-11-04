import React from "react";
import { Link, NavLink } from "react-router-dom";
import SiteBackground from "../ui/SiteBackground";
import { QIITA_PROFILE_URL } from "../../lib/articles";

/** 本文の最大幅。1カラムで読ませるため狭めに取る。 */
export const CONTENT_WIDTH = "max-w-[720px]";
/** 表や作品詳細など、横幅が要るページ用。 */
const WIDE_WIDTH = "max-w-[960px]";

const NAV = [
  { to: "/projects", label: "Works" },
  { to: "/articles", label: "Articles" },
  { to: "/skills", label: "Skills" },
];

export const SiteHeader: React.FC<{ wide?: boolean }> = ({ wide }) => (
  <header className={`${wide ? WIDE_WIDTH : CONTENT_WIDTH} w-full mx-auto px-6 pt-10 pb-6 flex items-center justify-between`}
    style={{ viewTransitionName: "site-header" }}
  >
    <Link
      to="/"
      className="text-[15px] font-semibold tracking-tight transition-opacity hover:opacity-70"
      style={{ color: "var(--text-primary)" }}
    >
      nico-labo748.dev
    </Link>
    <nav className="flex items-center gap-6">
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          viewTransition
          className="text-sm transition-colors"
          style={({ isActive }) => ({
            color: isActive ? "var(--text-primary)" : "var(--text-muted)",
          })}
        >
          {n.label}
        </NavLink>
      ))}
    </nav>
  </header>
);

export const SiteFooter: React.FC<{ wide?: boolean }> = ({ wide }) => (
  <footer className={`${wide ? WIDE_WIDTH : CONTENT_WIDTH} w-full mx-auto px-6 pt-12 pb-16 mt-32`}>
    <div className="h-px mb-10" style={{ background: "var(--border-color)" }} />
    <div className="flex flex-col sm:flex-row sm:justify-between gap-8 text-sm">
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        {[{ to: "/", label: "Home" }, ...NAV, { to: "/hobbys", label: "Hobby" }].map((n) => (
          <li key={n.to}>
            <Link to={n.to} className="link-quiet">
              {n.label}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="flex flex-wrap gap-x-6 gap-y-2">
        <li>
          <a href={QIITA_PROFILE_URL} target="_blank" rel="noopener noreferrer" className="link-quiet">
            Qiita
          </a>
        </li>
        <li>
          <a href="https://github.com/nico0748" target="_blank" rel="noopener noreferrer" className="link-quiet">
            GitHub
          </a>
        </li>
      </ul>
    </div>
    <p className="mt-10 text-xs" style={{ color: "var(--text-muted)" }}>
      &copy; {new Date().getFullYear()} NICOLABO
    </p>
  </footer>
);

interface SiteLayoutProps {
  children: React.ReactNode;
  /** 本文幅を広げたいページ用（Skills の表など）。 */
  wide?: boolean;
}

/** ポートフォリオ側の共通レイアウト（ヘッダー + 1カラム本文 + フッター）。 */
const SiteLayout: React.FC<SiteLayoutProps> = ({ children, wide }) => (
  <SiteBackground>
    <div className="antialiased min-h-screen flex flex-col">
      <SiteHeader wide={wide} />
      <main className={`${wide ? WIDE_WIDTH : CONTENT_WIDTH} w-full mx-auto px-6 flex-1`}>{children}</main>
      <SiteFooter wide={wide} />
    </div>
  </SiteBackground>
);

/** セクション見出し。小さく静かに置き、余白で区切る。 */
export const SectionHeading: React.FC<{ id?: string; children: React.ReactNode }> = ({ id, children }) => (
  <h2
    id={id}
    className="text-[13px] font-medium uppercase tracking-[0.18em] mb-8 scroll-mt-12"
    style={{ color: "var(--text-muted)" }}
  >
    {children}
  </h2>
);

/** 「すべて見る」リンク。 */
export const MoreLink: React.FC<{ to: string; children: React.ReactNode; external?: boolean }> = ({
  to,
  children,
  external,
}) => {
  const cls = "inline-flex items-center gap-1.5 mt-8 text-sm link-quiet";
  return external ? (
    <a href={to} target="_blank" rel="noopener noreferrer" className={cls}>
      {children} <span aria-hidden>↗</span>
    </a>
  ) : (
    <Link to={to} className={cls}>
      {children} <span aria-hidden>→</span>
    </Link>
  );
};

/** ページタイトル（下層ページ用）。 */
export const PageTitle: React.FC<{ title: string; lead?: string }> = ({ title, lead }) => (
  <div className="pt-16 pb-14">
    <h1 className="text-3xl font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
      {title}
    </h1>
    {lead && (
      <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {lead}
      </p>
    )}
  </div>
);

export const Loading: React.FC = () => (
  <p className="py-24 text-sm" style={{ color: "var(--text-muted)" }}>
    読み込み中…
  </p>
);

export default SiteLayout;
