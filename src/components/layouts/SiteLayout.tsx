import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import SiteBackground from "../ui/SiteBackground";
import type { ProfileData } from "../../lib/dataMapper";
import { fetchProfile, getCachedProfile, socialLinksOf, SOCIAL_NAMES } from "../../lib/profile";

/** ページ全体のコンテナ幅と左右の余白。カードの一覧はこの幅いっぱいに並べる。 */
export const CONTENT_WIDTH = "max-w-[1080px] px-5 sm:px-8 lg:px-10";
/** 文章ブロックの最大幅。日本語で1行おおよそ 38〜42 字に収め、読みやすい行長を保つ。 */
export const READABLE_WIDTH = "max-w-[680px]";

const NAV = [
  { to: "/projects", label: "Works" },
  { to: "/articles", label: "Articles" },
  { to: "/skills", label: "Skills" },
];

const SiteHeader: React.FC = () => (
  <header className={`${CONTENT_WIDTH} w-full mx-auto pt-8 pb-6 sm:pt-10 flex items-center justify-between`}
    style={{ viewTransitionName: "site-header" }}
  >
    <Link
      to="/"
      viewTransition
      className="text-[16px] sm:text-[17px] font-semibold tracking-tight transition-opacity hover:opacity-70"
      style={{ color: "var(--text-primary)" }}
    >
      nico-labo748.dev
    </Link>
    <nav className="flex items-center gap-4 sm:gap-6">
      {NAV.map((n) => (
        <NavLink
          key={n.to}
          to={n.to}
          viewTransition
          className="relative text-[14px] sm:text-[15px] transition-colors"
          style={({ isActive }) => ({
            color: isActive ? "var(--text-primary)" : "var(--text-muted)",
          })}
        >
          {({ isActive }) => (
            <>
              {n.label}
              {/* 現在地の短い線。ページを移ると View Transition で隣の項目へ滑る（名前は 1 つだけ） */}
              {isActive && (
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-[7px] mx-auto h-px w-[16px]"
                  style={{ background: "var(--accent)", viewTransitionName: "nav-indicator" }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  </header>
);

/** フッターのサイト内リンク（ヘッダーと同じページ + Home）。 */
const FOOTER_NAV = [{ to: "/", label: "Home" }, ...NAV];

/**
 * 全ページ共通のフッター。左にサイト内リンク、右にトップの自己紹介と同じ SNS（Profile シートの URL）。
 * SNS は Profile シートを読み終えてから出す（後から項目が割り込んで並びが変わらないように）。
 */
const SiteFooter: React.FC = () => {
  // undefined = 読み込み中 / null = シートを読めなかった（Qiita だけ出す）
  const [profile, setProfile] = useState<ProfileData | null | undefined>(() => getCachedProfile() ?? undefined);

  useEffect(() => {
    if (profile !== undefined) return;
    let alive = true;
    fetchProfile().then((p) => {
      if (alive) setProfile(p);
    });
    return () => {
      alive = false;
    };
  }, [profile]);

  const socials = profile === undefined ? [] : socialLinksOf(profile);

  return (
    <footer className={`${CONTENT_WIDTH} w-full mx-auto pt-12 pb-16 mt-24 md:mt-32`}>
      <div className="h-px mb-10" style={{ background: "var(--border-color)" }} />
      <div className="flex flex-col sm:flex-row sm:justify-between gap-6 sm:gap-8 text-[15px]">
        <nav aria-label="サイト内">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} viewTransition className="link-quiet">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <ul aria-label="SNS" className="flex flex-wrap gap-x-6 gap-y-2 min-h-[1.5em]">
          {socials.map((l) => (
            <li key={l.kind}>
              <a href={l.url} target="_blank" rel="noopener noreferrer" className="link-quiet">
                {SOCIAL_NAMES[l.kind]}{" "}
                <span aria-hidden className="text-[13px]">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-10 text-[13px]" style={{ color: "var(--text-muted)" }}>
        &copy; {new Date().getFullYear()} NICOLABO
      </p>
    </footer>
  );
};

interface SiteLayoutProps {
  children: React.ReactNode;
}

/** ポートフォリオ側の共通レイアウト（ヘッダー + 本文 + フッター）。全ページ同じコンテナ幅に揃える。 */
const SiteLayout: React.FC<SiteLayoutProps> = ({ children }) => (
  <SiteBackground>
    <div className="antialiased min-h-screen flex flex-col">
      <SiteHeader />
      <main className={`${CONTENT_WIDTH} w-full mx-auto flex-1`}>{children}</main>
      <SiteFooter />
    </div>
  </SiteBackground>
);

/** セクション見出し。「すべて見る →」などの本文リンクより一段大きくし、見出しだと分かるようにする。 */
export const SectionHeading: React.FC<{ id?: string; children: React.ReactNode }> = ({ id, children }) => (
  <h2
    id={id}
    className="flex items-center gap-3.5 text-[19px] md:text-[21px] font-semibold uppercase tracking-[0.14em] mb-8 md:mb-10 scroll-mt-12"
    style={{ color: "var(--accent)" }}
  >
    {/* 見出しの文字のあとに、左から伸びる（Reveal の中だけ。index.css の .draw-x） */}
    <span aria-hidden className="draw-x h-px w-[24px]" style={{ background: "var(--accent)" }} />
    {children}
  </h2>
);

/** 「すべて見る」リンク。 */
export const MoreLink: React.FC<{ to: string; children: React.ReactNode; external?: boolean }> = ({
  to,
  children,
  external,
}) => {
  const cls = "inline-flex items-center gap-1.5 mt-8 text-[15px] link-accent";
  return external ? (
    <a href={to} target="_blank" rel="noopener noreferrer" className={cls}>
      {children} <span aria-hidden>↗</span>
    </a>
  ) : (
    <Link to={to} viewTransition className={cls}>
      {children} <span aria-hidden>→</span>
    </Link>
  );
};

/** ページタイトル（下層ページ用）。 */
export const PageTitle: React.FC<{ title: string; lead?: string }> = ({ title, lead }) => (
  <div className="pt-10 pb-10 md:pt-16 md:pb-14">
    <h1 className="text-[2.125rem] font-semibold tracking-tight" style={{ color: "var(--text-primary)" }}>
      {title}
    </h1>
    {lead && (
      <p className={`mt-4 ${READABLE_WIDTH} text-[17px] leading-relaxed`} style={{ color: "var(--text-secondary)" }}>
        {lead}
      </p>
    )}
  </div>
);

export const Loading: React.FC = () => (
  <p className="py-24 text-[15px]" style={{ color: "var(--text-muted)" }}>
    読み込み中…
  </p>
);

export default SiteLayout;
