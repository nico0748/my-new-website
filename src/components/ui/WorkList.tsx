import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { PortfolioItem } from "../../lib/dataMapper";
import { projectVtName } from "../../lib/projects";
import Reveal from "./Reveal";

/** サムネイル。画像が無い / 読み込めない場合はタイトルの頭文字を置いた静かなプレースホルダー。 */
const Thumb: React.FC<{ item: PortfolioItem; named: boolean }> = ({ item, named }) => {
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
          className="vt-project-img h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          style={{ viewTransitionName: named ? projectVtName("img", item.id) : undefined }}
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

/**
 * 作品のボックス一覧（サムネイル + タイトル + 一行説明 + 技術タグ）。詳細ページへ遷移する。
 * vtExclude の作品には view-transition-name を付けない（トップの Timeline のポップアップが同じ作品の画像を
 * 持っている間。同じ名前が 2 つあると遷移のアニメーションごと失敗するため）。
 */
const WorkList: React.FC<{ items: PortfolioItem[]; vtExclude?: string }> = ({ items, vtExclude }) => (
  <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
    {items.map((w) => (
      <Reveal as="li" key={w.id}>
        <Link
          to={`/projects/${w.id}`}
          viewTransition
          className="card-hover group flex h-full flex-col overflow-hidden rounded-lg border border-white/[0.08] hover:border-white/[0.18]"
          style={{ background: "var(--card-bg)" }}
        >
          <Thumb item={w} named={w.id !== vtExclude} />
          <div className="flex flex-1 flex-col p-5">
            <span
              className="vt-project-title self-start text-[17px] font-medium"
              style={{
                color: "var(--text-primary)",
                viewTransitionName: w.id !== vtExclude ? projectVtName("title", w.id) : undefined,
              }}
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
      </Reveal>
    ))}
  </ul>
);

export default WorkList;
