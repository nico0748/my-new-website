/**
 * トップページのセクション。ヘッダーとフッターの移動メニューに並べる。
 * id は portfolioPage.tsx の SectionHeading の id と同じにする（/#works のように飛ぶ先）。
 */
export const SECTIONS = [
  { id: "works", label: "Works" },
  { id: "articles", label: "Articles" },
  { id: "skills", label: "Skills" },
  { id: "activity", label: "Activity" },
  { id: "timeline", label: "Timeline" },
  { id: "off-hours", label: "Off-hours" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/**
 * 一覧ページ。フッターの Pages に並べ、下層ページではヘッダーの現在地（同じ名前のセクション）に使う。
 * ページを足したらここに足す。
 */
export const PAGES: { to: string; label: string; section: SectionId }[] = [
  { to: "/projects", label: "Works", section: "works" },
  { to: "/articles", label: "Articles", section: "articles" },
  { to: "/skills", label: "Skills", section: "skills" },
];

/** 今いる下層ページに当たるセクション（/projects/xxx なら works）。トップやその他のページでは null。 */
export const currentSectionOf = (pathname: string): SectionId | null =>
  PAGES.find((p) => pathname === p.to || pathname.startsWith(`${p.to}/`))?.section ?? null;

/** 動きを減らす設定か（スクロールを滑らかにしない）。 */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** 見出しの上に残す余白（px）。ヘッダーの高さではなく、見出しが画面の縁に貼り付かないための間。 */
const SCROLL_GAP = 48;

/**
 * トップのセクションまでスクロールする。見出しは Reveal（下からフェードイン）の途中だと下にずれているので、
 * 動かない外側の <section> の位置で合わせる。見つからなければ false。
 */
export const scrollToSection = (id: string, behavior: ScrollBehavior = "auto"): boolean => {
  const heading = document.getElementById(id);
  if (!heading) return false;
  const box = heading.closest("section") ?? heading;
  window.scrollTo({ top: box.getBoundingClientRect().top + window.scrollY - SCROLL_GAP, behavior });
  return true;
};
