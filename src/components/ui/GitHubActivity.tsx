import React from "react";
import { CalendarDays, FolderGit2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ContributionCalendar, ContributionDay, GitHubRepo } from "../../lib/github";
import Reveal from "./Reveal";

/** スマホ（md 未満）で出す週の数（直近半年）。 */
const MOBILE_WEEKS = 26;
/** 曜日ラベルの列の幅と、マス目との間（px）。 */
const LABEL_COL = 16;
const LABEL_GAP = 8;
/** 曜日ラベルは月・水・金の行だけ（weekday は 0 = 日曜）。 */
const WEEKDAY_LABEL: Record<number, string> = { 1: "月", 3: "水", 5: "金" };

const fmt = (n: number) => n.toLocaleString("ja-JP");

/** 小見出し（OFF-HOURS のカテゴリ見出しと同じ形）。右端に補足。 */
const SubHeading: React.FC<{ id: string; icon: LucideIcon; note?: React.ReactNode; children: React.ReactNode }> = ({
  id,
  icon: Icon,
  note,
  children,
}) => (
  <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
    <h3 id={id} className="flex items-center gap-2.5 text-[17px] font-medium" style={{ color: "var(--text-primary)" }}>
      <span aria-hidden className="self-center" style={{ color: "var(--text-secondary)" }}>
        <Icon size={18} strokeWidth={1.75} />
      </span>
      {children}
    </h3>
    {note && (
      <p className="text-[13px] tracking-wide tabular-nums" style={{ color: "var(--text-muted)" }}>
        {note}
      </p>
    )}
  </div>
);

/** 週の最初の日の月（"11"）。日付は文字列のまま扱う */
const monthOf = (week: ContributionDay[]) => week[0].date.slice(5, 7);

/**
 * 月ラベル。その週の最初の日の月が前の週と変わる列に置く。
 * 1 列目は、次のラベルまで 2 列以内なら出さない（重なるため）。
 */
const monthLabels = (weeks: ContributionDay[][]): (string | null)[] => {
  const labels = weeks.map((w, i) => (i > 0 && monthOf(w) !== monthOf(weeks[i - 1]) ? `${Number(monthOf(w))}月` : null));
  const next = labels.findIndex((l, i) => i > 0 && l !== null);
  if (weeks.length > 0 && (next === -1 || next > 2)) labels[0] = `${Number(monthOf(weeks[0]))}月`;
  return labels;
};

/**
 * コントリビューションのヒートマップ。週ごとの列を幅いっぱいに並べ、マス目は幅に合わせて伸び縮みする
 * （14px を超えないよう全体に最大幅を付ける。横スクロールはしない）。md 未満は直近 26 週だけ。
 * 月ラベルは各週の列の中に置き、列を隠せば一緒に消える。段階は GitHub の contributionLevel のまま。
 */
const Heatmap: React.FC<{ calendar: ContributionCalendar }> = ({ calendar }) => {
  const { weeks } = calendar;
  const labels = monthLabels(weeks);
  const hiddenBefore = weeks.length - MOBILE_WEEKS;
  const mobileWeeks = Math.min(weeks.length, MOBILE_WEEKS);
  // マス目 14px + 間 3px（md 未満は 2px）で、ちょうど 14px になる幅
  const maxWidth = {
    "--heat-max": `${weeks.length * 17 - 3 + LABEL_COL + LABEL_GAP}px`,
    "--heat-max-sm": `${mobileWeeks * 16 - 2 + LABEL_COL + LABEL_GAP}px`,
  } as React.CSSProperties;

  return (
    <div className="max-w-[var(--heat-max)] max-md:max-w-[var(--heat-max-sm)]" style={maxWidth}>
      <div role="img" aria-label={`過去1年のコントリビューション ${fmt(calendar.total)} 件`} className="flex pt-5">
        {/* 曜日ラベル。行の高さはマス目と同じ（列の高さに引き伸ばして 7 等分。ラベルは高さに数えない） */}
        <div
          className="grid shrink-0 grid-rows-7 gap-[2px] md:gap-[3px]"
          style={{ width: LABEL_COL, marginRight: LABEL_GAP }}
        >
          {Array.from({ length: 7 }, (_, wd) => (
            <span key={wd} className="relative">
              {WEEKDAY_LABEL[wd] && (
                <span
                  className="absolute inset-y-0 left-0 flex items-center text-[13px] leading-none"
                  style={{ color: "var(--text-muted)" }}
                >
                  {WEEKDAY_LABEL[wd]}
                </span>
              )}
            </span>
          ))}
        </div>
        <div className="flex min-w-0 flex-1 gap-[2px] md:gap-[3px]">
          {weeks.map((week, i) => {
            const slots: (ContributionDay | undefined)[] = Array.from({ length: 7 });
            // 行は weekday で決める（最初・最後の欠けた週は空ける）
            for (const d of week) slots[d.weekday] = d;
            return (
              <div key={week[0].date} className={`relative min-w-0 flex-1 ${i < hiddenBefore ? "max-md:hidden" : ""}`}>
                {labels[i] && (
                  <span
                    className="absolute bottom-full left-0 mb-1.5 whitespace-nowrap text-[13px] leading-none"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {labels[i]}
                  </span>
                )}
                <div className="grid gap-[2px] md:gap-[3px]">
                  {slots.map((d, wd) =>
                    d ? (
                      <span
                        key={wd}
                        title={`${d.date.replace(/-/g, ".")} · ${fmt(d.count)} 件`}
                        className="block aspect-square rounded-[2px]"
                        style={{ background: `var(--heat-${d.level})` }}
                      />
                    ) : (
                      <span key={wd} className="block aspect-square" />
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div aria-hidden className="mt-3 flex items-center justify-end gap-[3px] text-[13px]" style={{ color: "var(--text-muted)" }}>
        <span className="mr-1.5">少ない</span>
        {[0, 1, 2, 3, 4].map((lv) => (
          <span key={lv} className="h-[11px] w-[11px] rounded-[2px]" style={{ background: `var(--heat-${lv})` }} />
        ))}
        <span className="ml-1.5">多い</span>
      </div>
    </div>
  );
};

/** リポジトリのカード（ArticleList のカードから画像を外した形）。カード全体が GitHub へのリンク。 */
const RepoCard: React.FC<{ repo: GitHubRepo }> = ({ repo }) => (
  <a
    href={repo.url}
    target="_blank"
    rel="noopener noreferrer"
    className="card-hover group flex h-full flex-col rounded-lg border border-white/[0.08] p-5 hover:border-white/[0.18]"
    style={{ background: "var(--card-bg)" }}
  >
    <span className="text-[17px] font-medium leading-snug break-words" style={{ color: "var(--text-primary)" }}>
      {repo.name}
    </span>
    {repo.description && (
      <span className="mt-2 text-[14px] leading-relaxed line-clamp-2" style={{ color: "var(--text-secondary)" }}>
        {repo.description}
      </span>
    )}
    <span className="mt-auto flex items-center gap-2 pt-3 text-[13px]" style={{ color: "var(--text-muted)" }}>
      {repo.language && <span>{repo.language}</span>}
      {repo.language && repo.pushedOn && <span aria-hidden>·</span>}
      {repo.pushedOn && (
        <span className="tabular-nums">
          <time dateTime={repo.pushedOn.replace(/\./g, "-")}>{repo.pushedOn}</time> 更新
        </span>
      )}
      <span aria-hidden className="ml-auto opacity-0 transition-opacity group-hover:opacity-100">
        ↗
      </span>
    </span>
  </a>
);

/**
 * GitHub の活動（ACTIVITY）。コントリビューションのヒートマップと、最近更新したリポジトリのカード。
 * calendar が null / repos が空の小見出しは出さない（両方無いときはページ側でセクションごと出さない）。
 */
const GitHubActivity: React.FC<{ calendar: ContributionCalendar | null; repos: GitHubRepo[] }> = ({ calendar, repos }) => {
  // スマホで見えている直近 26 週の合計
  const recent = calendar
    ? calendar.weeks.slice(-MOBILE_WEEKS).reduce((sum, w) => sum + w.reduce((s, d) => s + d.count, 0), 0)
    : 0;

  return (
    <div className="flex flex-col gap-12 md:gap-14">
      {calendar && (
        <Reveal>
          <section aria-labelledby="activity-contributions">
            <SubHeading
              id="activity-contributions"
              icon={CalendarDays}
              note={
                <>
                  <span className="hidden md:inline">過去 1 年 · {fmt(calendar.total)} 件</span>
                  <span className="md:hidden">直近半年 · {fmt(recent)} 件</span>
                </>
              }
            >
              コントリビューション
            </SubHeading>
            <Heatmap calendar={calendar} />
          </section>
        </Reveal>
      )}
      {repos.length > 0 && (
        <section aria-labelledby="activity-repos">
          <Reveal>
            <SubHeading id="activity-repos" icon={FolderGit2} note="最近更新した順">
              リポジトリ
            </SubHeading>
          </Reveal>
          {/* PC 3 列で 3 件 / タブレット 2 列で 2 件（3 件目を隠す）/ スマホ 1 列で 3 件 */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {repos.map((r, i) => (
              <Reveal as="li" key={r.url} className={i >= 2 ? "sm:max-lg:hidden" : undefined}>
                <RepoCard repo={r} />
              </Reveal>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default GitHubActivity;
