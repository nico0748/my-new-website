/** 教材記事の再利用 UI キット（Stripe / Vercel Docs 調）。
 *  すべて `.learn-docs` 配下のクラス（src/styles/learn.css）に対応。
 *
 *  記事は素の <h2>/<p>/<ul> も使える（.learn-docs のベース書式が当たる）が、
 *  リッチな演出はこのキットの部品で置く。API 名は据え置き。 */

import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import { highlightCode } from "../../lib/highlight";

/* ── リード文 ─────────────────────────── */
export const Lead: React.FC<{ children: ReactNode }> = ({ children }) => (
  <p className="lead">{children}</p>
);

/* ── 読了状態（h2 見出しごとに localStorage 保存）──
 *  key は URL パス＋見出しアンカーで一意化。トグル時に progress イベントを発火し、
 *  サイドバー目次（LearnLayout）へ反映させる。 */
const readKey = (anchor?: string) =>
  anchor && typeof window !== "undefined" ? `nicotech:read:${window.location.pathname}#${anchor}` : undefined;

const useSectionRead = (anchor?: string) => {
  const key = readKey(anchor);
  const [read, setRead] = useState(false);
  useEffect(() => {
    if (!key) return;
    try {
      setRead(localStorage.getItem(key) === "1");
    } catch {
      /* noop */
    }
  }, [key]);
  const toggle = (v: boolean) => {
    setRead(v);
    if (!key) return;
    try {
      if (v) localStorage.setItem(key, "1");
      else localStorage.removeItem(key);
    } catch {
      /* noop */
    }
    window.dispatchEvent(new CustomEvent("nicotech:progress"));
  };
  return [read, toggle] as const;
};

/* ── 見出し（h2 / h3）。h2 は id 付き＋読了チェックボックス ── */
const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\w\-ぁ-んァ-ヶ一-龠]/g, "");

export const Section: React.FC<{ children: ReactNode; id?: string; label?: string }> = ({
  children,
  id,
  label,
}) => {
  const anchor = id ?? (typeof children === "string" ? slugify(children) : undefined);
  const [read, toggle] = useSectionRead(anchor);
  return (
    <>
      {label && <span className="section-number">{label}</span>}
      <h2 id={anchor} className={`${anchor ? "has-check" : ""}${read ? " is-read" : ""}`.trim() || undefined}>
        {anchor && (
          <input
            type="checkbox"
            className="h2-check"
            checked={read}
            onChange={(e) => toggle(e.target.checked)}
            aria-label="このセクションを読了にする"
          />
        )}
        <span className="h2-text">{children}</span>
      </h2>
    </>
  );
};

export const SubSection: React.FC<{ children: ReactNode }> = ({ children }) => (
  <h3>{children}</h3>
);

/* ── コールアウト（info / tip / warn / danger / ai） ── */
type CalloutVariant = "info" | "tip" | "warn" | "danger" | "ai";
const ICONS: Record<CalloutVariant, ReactNode> = {
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  tip: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" />
    </svg>
  ),
  warn: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  danger: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
  ai: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6v6H9z" />
    </svg>
  ),
};
const DEFAULT_LABEL: Record<CalloutVariant, string> = {
  info: "NOTE",
  tip: "TIP",
  warn: "WARNING",
  danger: "DANGER",
  ai: "AI PROMPT",
};

export const Callout: React.FC<{
  variant?: CalloutVariant;
  title?: string;
  children: ReactNode;
}> = ({ variant = "info", title, children }) => (
  <div className={`callout callout-${variant}`}>
    <div className="callout-title">
      {ICONS[variant]}
      {title ?? DEFAULT_LABEL[variant]}
    </div>
    <div>{children}</div>
  </div>
);

/* ── 座学 ↔ 実務の橋渡し（情報系の講義で学ぶ理論と、この技術の実務的なつながり） ── */
export const Bridge: React.FC<{ course?: string; title?: string; children: ReactNode }> = ({
  course,
  title = "座学とのつながり",
  children,
}) => (
  <div className="bridge-box">
    <div className="bridge-title">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="6" cy="12" r="3" /><circle cx="18" cy="12" r="3" /><line x1="9" y1="12" x2="15" y2="12" />
      </svg>
      <span>{title}</span>
      {course && <span className="bridge-course">{course}</span>}
    </div>
    <div>{children}</div>
  </div>
);

/* ── コードブロック（言語/ファイル名 + コピー） ── */
export const Code: React.FC<{ children: string; lang?: string; filename?: string }> = ({
  children,
  lang,
  filename,
}) => {
  const [copied, setCopied] = useState(false);
  const code = children.replace(/\n$/, "");
  const { html, language } = useMemo(() => highlightCode(code, lang), [code, lang]);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };
  return (
    <div className="code-block">
      <div className="code-block-header">
        {filename ? (
          <span className="code-block-filename">{filename}</span>
        ) : (
          <span className="code-block-lang">{lang ?? "code"}</span>
        )}
        <button className={`copy-btn ${copied ? "copied" : ""}`} onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>
        <code className={`hljs language-${language}`} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
};

/* ── インラインコード / コマンド ── */
export const Cmd: React.FC<{ children: ReactNode }> = ({ children }) => <code>{children}</code>;

/* ── 手順（CSS カウンタで採番） ── */
export const Steps: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="steps">{children}</div>
);
export const Step: React.FC<{ title?: string; children: ReactNode }> = ({ title, children }) => (
  <div className="step">
    {title && <div className="step-title">{title}</div>}
    <div>{children}</div>
  </div>
);

/* ── 要点ボックス ── */
export const KeyPoints: React.FC<{ title?: string; items: ReactNode[] }> = ({
  title = "この章の要点",
  items,
}) => (
  <div className="keypoints">
    <div className="keypoints-title">{title}</div>
    <ul>
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  </div>
);

/* ── 比較表 ── */
export const ComparisonTable: React.FC<{ headers: string[]; rows: ReactNode[][] }> = ({
  headers,
  rows,
}) => (
  <table className="comparison-table">
    <thead>
      <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
    </thead>
    <tbody>
      {rows.map((r, i) => (
        <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>
      ))}
    </tbody>
  </table>
);

/* ── Key-Value リスト ── */
export const KVList: React.FC<{ items: { key: ReactNode; val: ReactNode }[] }> = ({ items }) => (
  <ul className="kv-list">
    {items.map((it, i) => (
      <li key={i}>
        <span className="key">{it.key}</span>
        <span className="val">{it.val}</span>
      </li>
    ))}
  </ul>
);

/* ── Tip（軽い補足） ── */
export const TipBox: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="tip-box">{children}</div>
);

/* ── 図 ── */
export const Figure: React.FC<{ src: string; alt: string; caption?: string }> = ({
  src,
  alt,
  caption,
}) => (
  <figure>
    <img src={src} alt={alt} />
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
);

/* ── 理解度チェック（選択式クイズ・答え開閉） ── */
export const Quiz: React.FC<{
  question: ReactNode;
  options: ReactNode[];
  /** 正解の選択肢インデックス（0 始まり） */
  answer: number;
  explanation?: ReactNode;
}> = ({ question, options, answer, explanation }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === answer;
  return (
    <div className="quiz">
      <div className="quiz-q">
        <span className="quiz-badge">Q</span>
        <div className="quiz-q-text">{question}</div>
      </div>
      <ul className="quiz-options">
        {options.map((op, i) => {
          const cls = !answered
            ? ""
            : i === answer
            ? " correct"
            : i === selected
            ? " wrong"
            : "";
          return (
            <li key={i}>
              <button
                className={`quiz-option${cls}`}
                disabled={answered}
                onClick={() => setSelected(i)}
              >
                <span className="quiz-key">{String.fromCharCode(65 + i)}</span>
                <span className="quiz-op-text">{op}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {answered && (
        <div className={`quiz-result ${correct ? "ok" : "ng"}`}>
          <div className="quiz-verdict">{correct ? "正解！" : "不正解"}</div>
          {explanation && <div className="quiz-explain">{explanation}</div>}
          <button className="quiz-retry" onClick={() => setSelected(null)}>
            もう一度
          </button>
        </div>
      )}
    </div>
  );
};

export const Divider: React.FC = () => <hr />;
