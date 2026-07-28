/** カテゴリ用ピクトグラム（Lucide 相当の 24 viewBox / stroke 2 / round cap）。
 *  絵文字の代替。currentColor で描くのでバッジの文字色をそのまま継承する。
 *  ⚠️ 絵文字は Topics/Study/Learn すべてで使わない方針（CLAUDE.md 禁止事項）。 */

import type { CSSProperties, ReactNode } from "react";

export type CategoryIconName =
  | "newspaper" | "shield" | "alert" | "puzzle" | "terminal"
  | "palette" | "settings" | "cpu" | "pin"
  | "pencil" | "blocks" | "brain" | "cloud" | "book";

const PATHS: Record<CategoryIconName, ReactNode> = {
  // ── Topics ──
  newspaper: (
    <>
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2" />
      <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" />
    </>
  ),
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  alert: (
    <>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </>
  ),
  puzzle: (
    <path d="M9 3a2 2 0 0 1 4 0v1h4a1 1 0 0 1 1 1v4h1a2 2 0 0 1 0 4h-1v4a1 1 0 0 1-1 1h-4v-1a2 2 0 0 0-4 0v1H5a1 1 0 0 1-1-1v-4H3a2 2 0 0 1 0-4h1V5a1 1 0 0 1 1-1h4z" />
  ),
  terminal: (
    <>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </>
  ),
  palette: (
    <>
      <circle cx="13.5" cy="6.5" r="1.5" />
      <circle cx="17.5" cy="10.5" r="1.5" />
      <circle cx="8.5" cy="7.5" r="1.5" />
      <circle cx="6.5" cy="12.5" r="1.5" />
      <path d="M12 2a10 10 0 1 0 0 20 2 2 0 0 0 0-4 6 6 0 0 1 0-12 4 4 0 0 0 4-4 2 2 0 0 0-4 0z" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </>
  ),
  cpu: (
    <>
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" />
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
    </>
  ),
  pin: (
    <>
      <line x1="12" y1="17" x2="12" y2="22" />
      <path d="M5 17h14l-1.6-2.4A3 3 0 0 1 17 13V7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v6a3 3 0 0 1-.4 1.6z" />
    </>
  ),

  // ── Study ──
  pencil: (
    <>
      <path d="M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5z" />
      <path d="M15 5l4 4" />
    </>
  ),
  blocks: (
    <>
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
      <rect x="8" y="3" width="8" height="8" rx="1" />
    </>
  ),
  brain: (
    <>
      <path d="M9.5 3A2.5 2.5 0 0 1 12 5.5v13a2.5 2.5 0 0 1-4.9.6A2.5 2.5 0 0 1 4 16.5a2.5 2.5 0 0 1-.5-4A2.5 2.5 0 0 1 4 7.5 2.5 2.5 0 0 1 7 4.6 2.5 2.5 0 0 1 9.5 3z" />
      <path d="M14.5 3A2.5 2.5 0 0 0 12 5.5v13a2.5 2.5 0 0 0 4.9.6A2.5 2.5 0 0 0 20 16.5a2.5 2.5 0 0 0 .5-4A2.5 2.5 0 0 0 20 7.5 2.5 2.5 0 0 0 17 4.6 2.5 2.5 0 0 0 14.5 3z" />
    </>
  ),
  cloud: <path d="M17.5 19a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.6 1.6A3.5 3.5 0 0 0 7 19z" />,
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </>
  ),
};

interface Props {
  name: CategoryIconName;
  /** px。バッジ内は 13、詳細ページの見出しバッジは 14 を使う */
  size?: number;
  style?: CSSProperties;
}

const CategoryIcon = ({ name, size = 13, style }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    style={{ flexShrink: 0, ...style }}
  >
    {PATHS[name] ?? PATHS.pin}
  </svg>
);

export default CategoryIcon;
