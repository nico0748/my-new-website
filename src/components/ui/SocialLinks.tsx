import React from "react";

export type SocialKind = "qiita" | "github" | "x" | "linkedin";

export interface SocialLink {
  kind: SocialKind;
  url: string;
  /** 表示する ID。省略時は URL から自動で取り出す。 */
  label?: string;
}

const ICONS: Record<SocialKind, React.ReactNode> = {
  github: (
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  ),
  x: (
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  ),
  linkedin: (
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  ),
  // Qiita は公式の単色マークが無いため、"Q" を線で描いたシンプルなマーク
  qiita: (
    <g fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <circle cx="11" cy="11" r="8" />
      <path d="M15.5 15.5 21 21" />
    </g>
  ),
};

const NAMES: Record<SocialKind, string> = { qiita: "Qiita", github: "GitHub", x: "X", linkedin: "LinkedIn" };

/** URL の最後のパスから表示用 ID を作る（X / Qiita は @ を付ける。LinkedIn は末尾の英数字 ID を省く）。 */
const handleFromUrl = (kind: SocialKind, url: string): string => {
  try {
    const seg = decodeURIComponent(new URL(url).pathname.split("/").filter(Boolean).pop() ?? "");
    if (kind === "linkedin") return seg.replace(/-[0-9a-z]{6,}$/i, "");
    return kind === "x" || kind === "qiita" ? `@${seg}` : seg;
  } catch {
    return NAMES[kind];
  }
};

/** サービス名・ユーザー ID・アイコンを1枚のカードにして縦に積むソーシャルリンク。
 *  ID とアイコンは同じ差し色（サンド）で揃え、サービス名は副テキスト色。 */
const SocialLinks: React.FC<{ links: SocialLink[]; className?: string }> = ({ links, className = "" }) => (
  <ul className={`flex flex-col gap-2.5 ${className}`}>
    {links.map((l) => {
      const handle = l.label ?? handleFromUrl(l.kind, l.url);
      return (
        <li key={l.kind}>
          <a
            href={l.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${NAMES[l.kind]}: ${handle}`}
            className="group flex items-center justify-between gap-4 rounded-xl border px-5 py-3.5 transition-colors
              bg-[color:var(--surface)] border-[color:var(--border-color)]
              hover:border-[color:var(--accent-border)] hover:bg-[color:var(--surface-hover)]
              focus-visible:outline-none focus-visible:border-[color:var(--accent)]"
          >
            <span className="min-w-0">
              <span className="block text-[13px]" style={{ color: "var(--text-secondary)" }}>
                {NAMES[l.kind]}
              </span>
              <span className="mt-0.5 block truncate text-[17px] font-semibold" style={{ color: "var(--accent)" }}>
                {handle}
              </span>
            </span>
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="currentColor"
              aria-hidden
              className="shrink-0 transition-opacity opacity-90 group-hover:opacity-100"
              style={{ color: "var(--accent)" }}
            >
              {ICONS[l.kind]}
            </svg>
          </a>
        </li>
      );
    })}
  </ul>
);

export default SocialLinks;
