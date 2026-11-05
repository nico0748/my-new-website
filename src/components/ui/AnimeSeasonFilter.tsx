import React, { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { ANIME_SEASONS, parseSeason } from "../../lib/dataMapper";
import type { AnimeWork } from "../../lib/dataMapper";
import type { SeasonFilter } from "../../lib/anime";

const Pill: React.FC<{
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ selected, disabled, onClick, children }) => (
  <button
    type="button"
    aria-pressed={selected}
    disabled={disabled}
    onClick={onClick}
    className={`rounded-full border px-3 py-1.5 text-[15px] transition-colors duration-200 sm:px-3.5 ${
      selected
        ? "border-white/[0.4] bg-white/[0.06]"
        : "border-white/[0.1] hover:border-white/[0.24] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/[0.1]"
    }`}
    style={{ color: selected ? "var(--text-primary)" : "var(--text-secondary)" }}
  >
    {children}
  </button>
);

/**
 * 放送時期の絞り込み。年を選ぶと、その年の季節（冬 → 春 → 夏 → 秋）を選べる。
 * 選べる年と件数は、いま開いているタブの作品から数える（新しい年が上）。
 */
const AnimeSeasonFilter: React.FC<{
  works: AnimeWork[];
  value: SeasonFilter | null;
  onChange: (next: SeasonFilter | null) => void;
  /** 絞り込んだ結果の件数 */
  count: number;
}> = ({ works, value, onChange, count }) => {
  const { years, seasons } = useMemo(() => {
    const years = new Map<number, number>();
    const seasons = new Map<string, number>();
    works.forEach((w) => {
      const p = parseSeason(w.season);
      if (!p) return;
      years.set(p.year, (years.get(p.year) ?? 0) + 1);
      if (p.season) seasons.set(`${p.year}-${p.season}`, (seasons.get(`${p.year}-${p.season}`) ?? 0) + 1);
    });
    return { years, seasons };
  }, [works]);

  // 選んでいる年がこのタブに無くても、選択肢から消さない（タブを切り替えても絞り込みを保つ）
  const yearOptions = [...years.entries()];
  if (value && !years.has(value.year)) yearOptions.push([value.year, 0]);
  yearOptions.sort((a, b) => b[0] - a[0]);

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <label className="flex items-center gap-3">
        <span className="text-[13px] tracking-wide" style={{ color: "var(--text-muted)" }}>
          放送時期
        </span>
        <span className="relative inline-flex">
          <select
            value={value ? String(value.year) : ""}
            onChange={(e) => onChange(e.target.value ? { year: Number(e.target.value) } : null)}
            className="cursor-pointer appearance-none rounded-full border border-white/[0.12] py-1.5 pl-4 pr-10 text-[15px] tabular-nums transition-colors duration-200 hover:border-white/[0.24]"
            style={{ background: "var(--surface)", color: "var(--text-primary)" }}
          >
            <option value="">すべての年</option>
            {yearOptions.map(([year, n]) => (
              <option key={year} value={year}>
                {year}年（{n}）
              </option>
            ))}
          </select>
          <ChevronDown
            aria-hidden
            size={16}
            strokeWidth={1.75}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-secondary)" }}
          />
        </span>
      </label>

      {value && (
        <div role="group" aria-label={`${value.year}年の季節`} className="flex flex-wrap gap-1.5 sm:gap-2">
          <Pill selected={!value.season} onClick={() => onChange({ year: value.year })}>
            すべて
          </Pill>
          {ANIME_SEASONS.map((s) => {
            const n = seasons.get(`${value.year}-${s.key}`) ?? 0;
            const selected = value.season === s.key;
            return (
              <Pill
                key={s.key}
                selected={selected}
                disabled={!n && !selected}
                onClick={() => onChange({ year: value.year, season: s.key })}
              >
                {s.label}
                <span className="ml-1 tabular-nums text-[13px] sm:ml-1.5" style={{ color: "var(--text-muted)" }}>
                  {n}
                </span>
              </Pill>
            );
          })}
        </div>
      )}

      {value && (
        <span className="text-[13px] tabular-nums tracking-wide sm:ml-auto" style={{ color: "var(--text-muted)" }}>
          {count} 件
        </span>
      )}
    </div>
  );
};

export default AnimeSeasonFilter;
