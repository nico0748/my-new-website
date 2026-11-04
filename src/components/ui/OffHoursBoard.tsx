import React, { useState } from "react";
import { Music2, Package, Ticket, Tv } from "lucide-react";
import type { OffHoursCategory, OffHoursItem } from "../../lib/dataMapper";
import { OFF_HOURS_LABEL, OFF_HOURS_ORDER } from "../../lib/offHours";
import Reveal from "./Reveal";

const ICON: Record<OffHoursCategory, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  anime: Tv,
  music: Music2,
  event: Ticket,
  indie: Package,
};

/** "2026-10-12" → イベントは "2026.10.12"、それ以外は年月だけの "2026.10" */
const formatDate = (category: OffHoursCategory, date: string) =>
  (category === "event" ? date : date.slice(0, 7)).replace(/-/g, ".");

/** 56px 角のサムネイル。画像が無い / 読み込めないときはカテゴリのピクトグラム。 */
const Thumb: React.FC<{ item: OffHoursItem }> = ({ item }) => {
  const [failed, setFailed] = useState(false);
  const Icon = ICON[item.category];
  return (
    <span
      className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md"
      style={{ background: "var(--surface)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}
    >
      {item.image && !failed ? (
        <img
          src={item.image}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <Icon size={20} strokeWidth={1.75} />
      )}
    </span>
  );
};

const Row: React.FC<{ item: OffHoursItem }> = ({ item }) => (
  <li className="flex items-start gap-4">
    <Thumb item={item} />
    <div className="min-w-0 pt-0.5">
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="row-link line-clamp-2 text-[16px] leading-snug"
          style={{ color: "var(--text-primary)" }}
        >
          <span className="row-title">{item.title}</span>{" "}
          <span aria-hidden className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            ↗
          </span>
        </a>
      ) : (
        <p className="line-clamp-2 text-[16px] leading-snug" style={{ color: "var(--text-primary)" }}>
          {item.title}
        </p>
      )}
      <p className="mt-1 truncate text-[13px] tabular-nums tracking-wide" style={{ color: "var(--text-secondary)" }}>
        <time dateTime={item.date}>{formatDate(item.category, item.date)}</time>
        {item.subtitle && (
          <>
            <span className="mx-2" aria-hidden>
              ·
            </span>
            {item.subtitle}
          </>
        )}
      </p>
    </div>
  </li>
);

/**
 * 趣味の記録（OFF-HOURS）。カテゴリごとの箱に新しい順で数件ずつ並べる。
 * 記録が 1 件も無いカテゴリの箱は出さない。
 */
const OffHoursBoard: React.FC<{ items: OffHoursItem[]; perCategory?: number }> = ({ items, perCategory = 3 }) => {
  const groups = OFF_HOURS_ORDER.map((category) => ({
    category,
    items: items.filter((it) => it.category === category).slice(0, perCategory),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
      {groups.map((g) => {
        const Icon = ICON[g.category];
        return (
          <Reveal key={g.category} className="h-full">
            <section
              aria-labelledby={`off-hours-${g.category}`}
              className="h-full rounded-lg p-5 md:p-6 border border-white/[0.08]"
              style={{ background: "var(--card-bg)" }}
            >
              <h3
                id={`off-hours-${g.category}`}
                className="flex items-center gap-2.5 text-[17px] font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                <span aria-hidden style={{ color: "var(--text-secondary)" }}>
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                {OFF_HOURS_LABEL[g.category]}
              </h3>
              <ul className="mt-5 flex flex-col gap-5">
                {g.items.map((it, i) => (
                  <Row key={`${it.date}-${i}`} item={it} />
                ))}
              </ul>
            </section>
          </Reveal>
        );
      })}
    </div>
  );
};

export default OffHoursBoard;
