import React, { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import SiteBackground from "../ui/SiteBackground";
import type { ProfileData } from "../../lib/dataMapper";
import { fetchProfile, getCachedProfile, socialLinksOf, SOCIAL_NAMES } from "../../lib/profile";
import { PAGES, SECTIONS, currentSectionOf, prefersReducedMotion, scrollToSection } from "../../lib/sections";
import type { SectionId } from "../../lib/sections";

/** ページ全体のコンテナ幅と左右の余白。カードの一覧はこの幅いっぱいに並べる。 */
export const CONTENT_WIDTH = "max-w-[1080px] px-5 sm:px-8 lg:px-10";
/** 文章ブロックの最大幅。日本語で1行おおよそ 38〜42 字に収め、読みやすい行長を保つ。 */
export const READABLE_WIDTH = "max-w-[680px]";

/**
 * トップページのセクションへのリンク（/#works など）。
 * トップにいるときは遷移せずにその見出しまでスクロールする（動きを減らす設定では一気に）。
 * 他のページからは /#id へ遷移し、トップ側（portfolioPage の useScrollToHash）が位置を合わせる。
 */
const SectionLink: React.FC<{
  id: SectionId;
  className?: string;
  style?: React.CSSProperties;
  onNavigate?: () => void;
  children: React.ReactNode;
}> = ({ id, className, style, onNavigate, children }) => {
  const { pathname } = useLocation();
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.();
    if (pathname !== "/") return;
    e.preventDefault();
    if (!scrollToSection(id, prefersReducedMotion() ? "auto" : "smooth")) return;
    // キーボードで操作したときに、続きを見出しから読めるようにする（見出しは tabIndex=-1）
    document.getElementById(id)?.focus({ preventScroll: true });
  };
  return (
    <Link to={{ pathname: "/", hash: `#${id}` }} viewTransition onClick={onClick} className={className} style={style}>
      {children}
    </Link>
  );
};

/** スマホのメニュー（セクションへのリンクを縦に並べたパネル）。外側を押す・Esc・リンクを押すと閉じる。 */
const MobileMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const Icon = open ? X : Menu;
  return (
    <div ref={rootRef} className="relative md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 text-[15px] transition-colors"
        style={{ color: open ? "var(--text-primary)" : "var(--text-secondary)" }}
      >
        Menu
        <Icon aria-hidden size={18} strokeWidth={1.75} />
      </button>
      <nav
        id={panelId}
        aria-label="トップのセクション"
        hidden={!open}
        className="absolute right-0 top-full z-50 mt-3 w-56 rounded-xl border py-2"
        style={{ background: "var(--surface)", borderColor: "var(--border-color)" }}
      >
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <SectionLink id={s.id} onNavigate={() => setOpen(false)} className="link-quiet block px-5 py-2.5 text-[15px]">
                {s.label}
              </SectionLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

/**
 * ヘッダー。右にトップページのセクションへの移動メニュー（md 以上は横に並べ、スマホは Menu ボタン）。
 * 下層ページ（/projects など）では、同じ名前のセクションの下に現在地の短い線を引く。
 */
const SiteHeader: React.FC = () => {
  const { pathname } = useLocation();
  const current = currentSectionOf(pathname);
  return (
    <header
      className={`${CONTENT_WIDTH} relative z-40 w-full mx-auto pt-8 pb-6 sm:pt-10 flex items-center justify-between gap-6`}
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
      <nav aria-label="トップのセクション" className="hidden md:block">
        <ul className="flex items-center gap-6">
          {SECTIONS.map((s) => {
            const active = s.id === current;
            return (
              <li key={s.id}>
                <SectionLink
                  id={s.id}
                  className="relative text-[15px] transition-colors hover:!text-[color:var(--text-primary)]"
                  style={{ color: active ? "var(--text-primary)" : "var(--text-muted)" }}
                >
                  {s.label}
                  {/* 現在地の短い線。ページを移ると View Transition で隣の項目へ滑る（名前は 1 つだけ） */}
                  {active && (
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-[7px] mx-auto h-px w-[16px]"
                      style={{ background: "var(--accent)", viewTransitionName: "nav-indicator" }}
                    />
                  )}
                </SectionLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <MobileMenu />
    </header>
  );
};

/** フッターの列（小さな見出し + 縦のリンク）。 */
const FooterGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const titleId = useId();
  return (
    <nav aria-labelledby={titleId}>
      <p id={titleId} className="mb-4 text-[13px] uppercase tracking-[0.14em]" style={{ color: "var(--text-muted)" }}>
        {title}
      </p>
      <ul className="flex flex-col gap-2.5 min-h-[1.5em]">{children}</ul>
    </nav>
  );
};

/**
 * 全ページ共通のフッター。罫線の下に 3 列: Home（トップのセクションへの移動）/ Pages（一覧ページ）/
 * Social（トップの自己紹介と同じ SNS。Profile シートの URL）。
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
      <div className="grid grid-cols-2 gap-x-8 gap-y-10 text-[15px] sm:grid-cols-[repeat(3,minmax(0,13rem))] sm:gap-x-12">
        <FooterGroup title="Home">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <SectionLink id={s.id} className="link-quiet">
                {s.label}
              </SectionLink>
            </li>
          ))}
        </FooterGroup>
        <FooterGroup title="Pages">
          {PAGES.map((p) => (
            <li key={p.to}>
              <Link to={p.to} viewTransition className="link-quiet">
                {p.label}
              </Link>
            </li>
          ))}
        </FooterGroup>
        <FooterGroup title="Social">
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
        </FooterGroup>
      </div>
      <p className="mt-12 text-[13px]" style={{ color: "var(--text-muted)" }}>
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
    // 移動メニューで飛んだとき、フォーカスを見出しへ移せるように（Tab の順番には入れない）
    tabIndex={id ? -1 : undefined}
    className="flex items-center gap-4 outline-none text-[24px] md:text-[28px] font-semibold uppercase tracking-[0.12em] mb-8 md:mb-10"
    style={{ color: "var(--accent)" }}
  >
    {/* 見出しの文字のあとに、左から伸びる（Reveal の中だけ。index.css の .draw-x） */}
    <span aria-hidden className="draw-x h-px w-[28px]" style={{ background: "var(--accent)" }} />
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
