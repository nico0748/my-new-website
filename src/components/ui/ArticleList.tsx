import React from "react";
import type { ArticleItem } from "../../lib/dataMapper";
import { formatJaDate } from "../../lib/articles";

/** 記事の一覧（タイトル + 掲載先 · 日付）。クリックで外部の記事ページへ遷移する。 */
const ArticleList: React.FC<{ items: ArticleItem[] }> = ({ items }) => (
  <ul className="flex flex-col">
    {items.map((a) => (
      <li key={a.id}>
        <a
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          className="row-link group block py-4"
        >
          <span className="row-title text-[15px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
            {a.title}
          </span>
          <span className="mt-1.5 flex items-center gap-2 text-[13px]" style={{ color: "var(--text-muted)" }}>
            <span>{a.platform}</span>
            <span aria-hidden>·</span>
            <time dateTime={a.date}>{formatJaDate(a.date)}</time>
            <span aria-hidden className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
              ↗
            </span>
          </span>
        </a>
      </li>
    ))}
  </ul>
);

export default ArticleList;
