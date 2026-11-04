import React, { useEffect, useState } from "react";
import type { ArticleItem } from "../../lib/dataMapper";
import { formatJaDate } from "../../lib/articles";
import { fetchOgpImage } from "../../lib/ogp";

/** OGP 画像。取得中・取得できない場合はタイトルを置いた静かなプレースホルダー。 */
const OgpImage: React.FC<{ item: ArticleItem }> = ({ item }) => {
  const [src, setSrc] = useState<string | null>(item.image ?? null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (item.image) return;
    let alive = true;
    fetchOgpImage(item.url).then((img) => alive && setSrc(img));
    return () => {
      alive = false;
    };
  }, [item.url, item.image]);

  return (
    <div className="relative aspect-[1200/630] overflow-hidden" style={{ background: "var(--surface)" }}>
      {src && !failed ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center" aria-hidden>
          <span className="text-[13px] tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>
            {item.platform}
          </span>
        </div>
      )}
    </div>
  );
};

/** 記事のボックス一覧（OGP 画像 + タイトル + 掲載先 · 日付）。クリックで外部の記事ページへ遷移する。 */
const ArticleList: React.FC<{ items: ArticleItem[] }> = ({ items }) => (
  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
    {items.map((a) => (
      <li key={a.id}>
        <a
          href={a.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-full flex-col overflow-hidden rounded-lg border border-white/[0.08] transition-colors duration-300 hover:border-white/[0.18]"
          style={{ background: "var(--card-bg)" }}
        >
          <OgpImage item={a} />
          <div className="flex flex-1 flex-col p-5">
            <span className="text-[14px] font-medium leading-relaxed line-clamp-2" style={{ color: "var(--text-primary)" }}>
              {a.title}
            </span>
            <span className="mt-auto flex items-center gap-2 pt-3 text-[12px]" style={{ color: "var(--text-muted)" }}>
              <span>{a.platform}</span>
              <span aria-hidden>·</span>
              <time dateTime={a.date}>{formatJaDate(a.date)}</time>
              <span aria-hidden className="ml-auto opacity-0 transition-opacity group-hover:opacity-100">
                ↗
              </span>
            </span>
          </div>
        </a>
      </li>
    ))}
  </ul>
);

export default ArticleList;
