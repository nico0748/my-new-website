import React from "react";
import { Link } from "react-router-dom";
import type { To } from "react-router-dom";
import type { TimelineItem } from "../../lib/dataMapper";
import { TIMELINE_TYPE_LABEL, formatPeriod, hasTimelineDetail } from "../../lib/timeline";
import Reveal from "./Reveal";

/**
 * 年ごとにまとめた縦線つきの年表。各項目は「期間 · 種別」→ タイトル → 説明の順。
 * 項目を押すと詳細のポップアップを開く（?timeline=<id>。開き方はトップの PortfolioPage が持つ）。
 * タイトルのリンクの当たり判定を項目全体に広げ（.timeline-open）、読み上げの名前はタイトルだけにする。
 */
const Timeline: React.FC<{
  items: TimelineItem[];
  /** ポップアップを開くリンク先 */
  linkTo: (it: TimelineItem) => To;
  /** 押した瞬間に呼ぶ（その項目のタイトルにモーフ用の名前を付ける） */
  onOpen: (it: TimelineItem) => void;
  /** タイトルの view-transition-name（最後に開いた項目だけ。ほかは undefined） */
  vtNameOf: (it: TimelineItem) => string | undefined;
}> = ({ items, linkTo, onOpen, vtNameOf }) => {
  const groups: { year: string; items: TimelineItem[] }[] = [];
  items.forEach((it) => {
    const year = it.start.slice(0, 4);
    const last = groups[groups.length - 1];
    if (last && last.year === year) last.items.push(it);
    else groups.push({ year, items: [it] });
  });

  return (
    <div className="flex flex-col gap-12">
      {groups.map((g) => (
        <Reveal as="section" key={g.year} className="grid grid-cols-1 sm:grid-cols-[6rem_1fr] gap-x-8 gap-y-4">
          <h3
            className="text-[17px] font-medium tabular-nums sm:pt-[3px]"
            style={{ color: "var(--text-primary)" }}
          >
            {g.year}
          </h3>
          <ol className="relative flex flex-col gap-8 pl-6">
            {/* 縦線は年ごとの Reveal で上から伸びる（index.css の .draw-y） */}
            <span aria-hidden className="draw-y absolute left-[3px] top-2 bottom-2 w-px" style={{ background: "var(--border-color)" }} />
            {g.items.map((it, i) => {
              const ongoing = it.end === "present";
              const title = (
                <span
                  className="row-title vt-timeline-title text-[17px] leading-relaxed"
                  style={{ color: "var(--text-primary)", viewTransitionName: vtNameOf(it) }}
                >
                  {it.title}
                </span>
              );
              return (
                <li key={it.id} className="relative">
                  {/* 過去の項目の点は線に続いて上から順に点く（.draw-dot）。継続中の差し色の点は状態なので最初から出す */}
                  <span
                    aria-hidden
                    className={`absolute -left-6 top-[7px] h-[7px] w-[7px] rounded-full${ongoing ? "" : " draw-dot"}`}
                    style={
                      {
                        background: ongoing ? "var(--accent)" : "var(--bg)",
                        border: `1px solid ${ongoing ? "var(--accent)" : "var(--text-muted)"}`,
                        "--i": Math.min(i, 4),
                      } as React.CSSProperties
                    }
                  />
                  <p className="text-[13px] tabular-nums tracking-wide" style={{ color: "var(--text-muted)" }}>
                    {formatPeriod(it.start, it.end)}
                    <span className="mx-2" aria-hidden>·</span>
                    {TIMELINE_TYPE_LABEL[it.type] ?? TIMELINE_TYPE_LABEL.other}
                    {it.status === "upcoming" && <span className="ml-2">（予定）</span>}
                  </p>
                  <div className="mt-1.5">
                    {hasTimelineDetail(it) ? (
                      <Link
                        to={linkTo(it)}
                        state={{ from: "timeline" }}
                        viewTransition
                        preventScrollReset
                        onClick={() => onOpen(it)}
                        aria-haspopup="dialog"
                        className="timeline-open row-link"
                      >
                        {title}
                      </Link>
                    ) : (
                      <p>{title}</p>
                    )}
                  </div>
                  {it.description && (
                    <p className="mt-1.5 max-w-[680px] text-[14px] leading-[1.9]" style={{ color: "var(--text-secondary)" }}>
                      {it.description}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </Reveal>
      ))}
    </div>
  );
};

export default Timeline;
