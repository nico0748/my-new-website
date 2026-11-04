import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { PortfolioItem } from "../../lib/dataMapper";
import { projectVtName } from "../../lib/projects";

/** サムネイル。画像が無い / 読み込めない場合はタイトルの頭文字を置いた静かなプレースホルダー。 */
const Thumb: React.FC<{ item: PortfolioItem }> = ({ item }) => {
  const [failed, setFailed] = useState(false);
  const hasImage = !!item.thumbnail && !failed;
  return (
    <div className="relative aspect-[16/10] overflow-hidden" style={{ background: "var(--surface)" }}>
      {hasImage ? (
        <img
          src={item.thumbnail}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          style={{ viewTransitionName: projectVtName("img", item.id) }}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-[2.125rem] font-semibold"
          style={{ color: "var(--text-muted)" }}
          aria-hidden
        >
          {item.title.replace(/^[^\p{L}\p{N}]+/u, "").charAt(0)}
        </div>
      )}
    </div>
  );
};

/** 作品のボックス一覧（サムネイル + タイトル + 一行説明 + 技術タグ）。詳細ページへ遷移する。 */
const WorkList: React.FC<{ items: PortfolioItem[] }> = ({ items }) => (
  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
    {items.map((w) => (
      <li key={w.id}>
        <Link
          to={`/projects/${w.id}`}
          viewTransition
          className="group flex h-full flex-col overflow-hidden rounded-lg transition-colors duration-300 border border-white/[0.08] hover:border-white/[0.18]"
          style={{ background: "var(--card-bg)" }}
        >
          <Thumb item={w} />
          <div className="flex flex-1 flex-col p-5">
            <span
              className="self-start text-[17px] font-medium"
              style={{ color: "var(--text-primary)", viewTransitionName: projectVtName("title", w.id) }}
            >
              {w.title}
            </span>
            {w.description && (
              <span className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {w.description}
              </span>
            )}
            {w.tags.length > 0 && (
              <span className="mt-auto pt-4 text-[13px] tracking-wide" style={{ color: "var(--text-muted)" }}>
                {w.tags.join(" / ")}
              </span>
            )}
          </div>
        </Link>
      </li>
    ))}
  </ul>
);

export default WorkList;
