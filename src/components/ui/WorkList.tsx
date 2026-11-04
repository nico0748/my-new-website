import React from "react";
import { Link } from "react-router-dom";
import type { PortfolioItem } from "../../lib/dataMapper";

/** 作品の一覧（タイトル + 一行説明 + 技術タグ）。詳細ページへ遷移する。 */
const WorkList: React.FC<{ items: PortfolioItem[] }> = ({ items }) => (
  <ul className="flex flex-col">
    {items.map((w) => (
      <li key={w.id}>
        <Link to={`/projects/${w.id}`} viewTransition className="row-link block py-4">
          <span className="row-title text-[15px] font-medium" style={{ color: "var(--text-primary)" }}>
            {w.title}
          </span>
          {w.description && (
            <span className="mt-1.5 block text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              {w.description}
            </span>
          )}
          {w.tags.length > 0 && (
            <span className="mt-2 block text-[12px] tracking-wide" style={{ color: "var(--text-muted)" }}>
              {w.tags.join(" / ")}
            </span>
          )}
        </Link>
      </li>
    ))}
  </ul>
);

export default WorkList;
