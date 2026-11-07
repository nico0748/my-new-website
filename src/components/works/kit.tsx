/** Works 記事（src/content/works/<id>.tsx）を書くための部品。
 *  見た目は src/styles/works-article.css（.work-article スコープ）。
 *  素の <p> <ul> <ol> <strong> <code> <a> もそのまま整形されるので、地の文は普通に JSX で書く。
 *  動きのある図（Flow / Layers）は ./motion.tsx。 */

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { highlightCode } from "../../lib/highlight";

/* ─── 文 ─────────────────────────────────────── */

/** 記事そのものの題。作品名とは別の副題がある記事だけ、Lead の前に置く（h1 はページ側の作品名）。 */
export const ArticleTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="wa-title">{children}</p>
);

/** 冒頭の要約。ひとこと目に置く。 */
export const Lead: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="wa-lead">{children}</p>
);

/**
 * 章の見出し（h2）。目次に載る。
 * - no: 章番号（「1」など）。淡色の接頭辞として分けて表示する
 * - toc: 目次に出す短い名前。省略時は children の文字列（「—」より前）
 */
export const Section: React.FC<{ id: string; no?: string; toc?: string; children: React.ReactNode }> = ({
  id,
  no,
  toc,
  children,
}) => {
  const label = toc ?? (typeof children === "string" ? children.split(/\s*[—─]+\s*/)[0] : id);
  return (
    <h2 id={id} className="wa-h2" data-toc={label} data-no={no}>
      <span aria-hidden className="wa-h2-rule" />
      <span className="wa-h2-text">
        {no && <span className="wa-no">{no}.</span>}
        {children}
      </span>
    </h2>
  );
};

/** 節の見出し（h3）。no は「2-1」など。 */
export const Sub: React.FC<{ id?: string; no?: string; children: React.ReactNode }> = ({ id, no, children }) => (
  <h3 id={id} className="wa-h3">
    {no && <span className="wa-no">{no}</span>}
    {children}
  </h3>
);

/** 小見出し（h4）。 */
export const H4: React.FC<{ children: React.ReactNode }> = ({ children }) => <h4 className="wa-h4">{children}</h4>;

/** 補足・注意の囲み。 */
export const Callout: React.FC<{ title?: string; children: React.ReactNode }> = ({ title, children }) => (
  <aside className="wa-callout">
    {title && <p className="wa-callout-title">{title}</p>}
    <div className="wa-callout-body">{children}</div>
  </aside>
);

/** 引用。 */
export const Quote: React.FC<{ cite?: string; children: React.ReactNode }> = ({ cite, children }) => (
  <figure className="wa-quote">
    <blockquote>{children}</blockquote>
    {cite && <figcaption>{cite}</figcaption>}
  </figure>
);

/* ─── 画像 ───────────────────────────────────── */

/** スクリーンショット＋キャプション。押すと拡大する。alt は画面の内容を文章で書く。 */
export const Figure: React.FC<{ src: string; alt: string; caption?: React.ReactNode }> = ({ src, alt, caption }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <figure className="wa-figure">
      <button type="button" className="wa-figure-btn" onClick={() => setOpen(true)} aria-label={`画像を拡大する: ${alt}`}>
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      </button>
      {caption && <figcaption>{caption}</figcaption>}
      {open &&
        createPortal(
          <div className="wa-zoom" role="dialog" aria-modal="true" aria-label="画像の拡大表示" onClick={() => setOpen(false)}>
            <img src={src} alt={alt} />
            <p className="wa-zoom-hint">Esc またはクリックで閉じる</p>
          </div>,
          document.body
        )}
    </figure>
  );
};

/* ─── 表・数字 ───────────────────────────────── */

/**
 * 表。幅が足りなければ横にスクロールする。
 * stack を付けると、md 未満では 1 行を 1 枚の箱にして「見出し: 値」で縦に積む（4 列以上の表向け）。
 */
export const Table: React.FC<{
  head: React.ReactNode[];
  rows: React.ReactNode[][];
  caption?: React.ReactNode;
  stack?: boolean;
}> = ({ head, rows, caption, stack }) => (
  <figure className={`wa-table ${stack ? "is-stack" : ""}`}>
    <div className="wa-table-scroll" tabIndex={0} role="region" aria-label={typeof caption === "string" ? caption : "表"}>
      <table>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} data-label={typeof head[j] === "string" ? (head[j] as string) : undefined}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {caption && <figcaption>{caption}</figcaption>}
  </figure>
);

/** 開発期間・コミット数などの数字（動かさない）。 */
export const Stats: React.FC<{ items: { label: string; value: React.ReactNode; note?: React.ReactNode }[] }> = ({
  items,
}) => (
  <dl className="wa-stats">
    {items.map((it) => (
      <div key={it.label}>
        <dt>{it.label}</dt>
        <dd>
          <span className="wa-stats-value">{it.value}</span>
          {it.note && <span className="wa-stats-note">{it.note}</span>}
        </dd>
      </div>
    ))}
  </dl>
);

/* ─── コード ─────────────────────────────────── */

export const Code: React.FC<{ children: string; lang?: string; filename?: string }> = ({ children, lang, filename }) => {
  const code = children.replace(/^\n+|\s+$/g, "");
  const { html, language } = useMemo(() => highlightCode(code, lang), [code, lang]);
  return (
    <figure className="wa-code">
      {filename && <figcaption>{filename}</figcaption>}
      <pre>
        <code className={`hljs language-${language}`} dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </figure>
  );
};

/* ─── 脚注 ───────────────────────────────────── */

/** 本文中の脚注番号。<Footnotes> の n 番目に飛ぶ。 */
export const Fn: React.FC<{ n: number }> = ({ n }) => (
  <sup className="wa-fn-ref" id={`fnref-${n}`}>
    <a href={`#fn-${n}`} aria-label={`脚注 ${n}`}>
      {n}
    </a>
  </sup>
);

/** 記事の末尾に置く脚注の一覧。 */
export const Footnotes: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <section className="wa-footnotes" aria-label="脚注">
    <ol>
      {items.map((it, i) => (
        <li key={i} id={`fn-${i + 1}`}>
          {it}{" "}
          <a href={`#fnref-${i + 1}`} className="wa-fn-back">
            ← 本文へ
          </a>
        </li>
      ))}
    </ol>
  </section>
);
