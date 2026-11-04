import React from "react";
import { Link } from "react-router-dom";
import type { TimelineItem } from "../../lib/dataMapper";

const TYPE_LABEL: Record<TimelineItem["type"], string> = {
  education: "学歴",
  work: "仕事",
  project: "制作",
  certification: "受賞・資格",
  other: "その他",
};

/** "2025-04" → "2025.04"、"2025" → "2025" */
const ym = (v: string) => v.replace("-", ".");

/** 期間の表示: "2025.04 – 2025.07" / "2025.10 – 現在" / "2024.10" */
const formatPeriod = (start: string, end?: string): string => {
  if (!end) return ym(start);
  return `${ym(start)} – ${end === "present" ? "現在" : ym(end)}`;
};

const Title: React.FC<{ item: TimelineItem }> = ({ item }) => {
  const text = (
    <span className="row-title text-[15px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
      {item.title}
    </span>
  );
  if (!item.href) return <p>{text}</p>;
  return item.href.startsWith("/") ? (
    <Link to={item.href} className="row-link">
      {text}
    </Link>
  ) : (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className="row-link">
      {text} <span aria-hidden className="text-[12px]" style={{ color: "var(--text-muted)" }}>↗</span>
    </a>
  );
};

/** 年ごとにまとめた縦線つきの年表。各項目は「期間 · 種別」→ タイトル → 説明の順。 */
const Timeline: React.FC<{ items: TimelineItem[] }> = ({ items }) => {
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
        <section key={g.year} className="grid grid-cols-1 sm:grid-cols-[5rem_1fr] gap-x-6 gap-y-4">
          <h3
            className="text-[15px] font-medium tabular-nums sm:pt-[3px]"
            style={{ color: "var(--text-primary)" }}
          >
            {g.year}
          </h3>
          <ol className="relative flex flex-col gap-8 pl-6">
            <span aria-hidden className="absolute left-[3px] top-2 bottom-2 w-px" style={{ background: "var(--border-color)" }} />
            {g.items.map((it, i) => {
              const ongoing = it.end === "present";
              return (
                <li key={`${it.start}-${i}`} className="relative">
                  <span
                    aria-hidden
                    className="absolute -left-6 top-[7px] h-[7px] w-[7px] rounded-full"
                    style={{
                      background: ongoing ? "var(--accent)" : "var(--bg)",
                      border: `1px solid ${ongoing ? "var(--accent)" : "var(--text-muted)"}`,
                    }}
                  />
                  <p className="text-[12px] tabular-nums tracking-wide" style={{ color: "var(--text-muted)" }}>
                    {formatPeriod(it.start, it.end)}
                    <span className="mx-2" aria-hidden>·</span>
                    {TYPE_LABEL[it.type] ?? TYPE_LABEL.other}
                    {it.status === "upcoming" && <span className="ml-2">（予定）</span>}
                  </p>
                  <div className="mt-1.5">
                    <Title item={it} />
                  </div>
                  {it.description && (
                    <p className="mt-1.5 text-[13px] leading-[1.9]" style={{ color: "var(--text-secondary)" }}>
                      {it.description}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
};

export default Timeline;
