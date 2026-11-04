import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import SiteLayout, { SectionHeading, MoreLink } from "../components/layouts/SiteLayout";
import ArticleList from "../components/ui/ArticleList";
import WorkList from "../components/ui/WorkList";

import { fetchSheetData } from "../lib/googleSheets";
import type { SheetRow } from "../lib/googleSheets";
import { mapProfileData, mapPortfolioData, mapSkillsData, mapTimelineData } from "../lib/dataMapper";
import type { ProfileData, SkillCategory, TimelineItem, PortfolioItem, ArticleItem } from "../lib/dataMapper";
import { fetchArticles, QIITA_PROFILE_URL } from "../lib/articles";

const REAL_NAME = "細澤 悠真";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const PortfolioPage = () => {
  const [profile, setProfile] = useState<ProfileData>({ name: "", title: "", description: "", image: "" });
  const [works, setWorks] = useState<PortfolioItem[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [articlesLoaded, setArticlesLoaded] = useState(false);

  useEffect(() => {
    fetchArticles()
      .then(setArticles)
      .finally(() => setArticlesLoaded(true));

    if (!import.meta.env.VITE_GOOGLE_SHEETS_API_KEY) return;
    (async () => {
      try {
        const [profileRows, worksRows, skillsRows, timelineRows] = await Promise.all([
          fetchSheetData<SheetRow>("Profile"),
          fetchSheetData<SheetRow>("Projects"),
          fetchSheetData<SheetRow>("Skills"),
          fetchSheetData<SheetRow>("Timeline"),
        ]);
        if (profileRows.length > 0) setProfile(mapProfileData(profileRows));
        if (worksRows.length > 0) setWorks(mapPortfolioData(worksRows));
        if (skillsRows.length > 0) setSkills(mapSkillsData(skillsRows));
        if (timelineRows.length > 0) setTimeline(mapTimelineData(timelineRows));
      } catch (error) {
        console.error("Failed to fetch data from Google Sheets", error);
      }
    })();
  }, []);

  return (
    <SiteLayout>
      <Intro profile={profile} />

      <section className="mt-32">
        <SectionHeading id="works">Works</SectionHeading>
        {works.length > 0 ? <WorkList items={works.slice(0, 5)} /> : <Empty text="作品を読み込んでいます" />}
        <MoreLink to="/projects">すべての作品を見る</MoreLink>
      </section>

      <section className="mt-32">
        <SectionHeading id="articles">Articles</SectionHeading>
        {articles.length > 0 ? (
          <ArticleList items={articles.slice(0, 5)} />
        ) : (
          <Empty text={articlesLoaded ? "記事を取得できませんでした。Qiita から直接ご覧ください。" : "記事を読み込んでいます"} />
        )}
        <MoreLink to="/articles">すべての記事を見る</MoreLink>
      </section>

      {skills.length > 0 && (
        <section className="mt-32">
          <SectionHeading id="skills">Skills</SectionHeading>
          <dl className="flex flex-col gap-5">
            {skills.map((c) => (
              <div key={c.category} className="grid grid-cols-1 sm:grid-cols-[9rem_1fr] gap-1 sm:gap-6">
                <dt className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                  {c.category}
                </dt>
                <dd className="text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {c.skills.map((s) => s.name).join(", ")}
                </dd>
              </div>
            ))}
          </dl>
          <MoreLink to="/skills">詳しく見る</MoreLink>
        </section>
      )}

      {timeline.length > 0 && (
        <section className="mt-32">
          <SectionHeading id="timeline">Timeline</SectionHeading>
          <Timeline items={timeline} />
        </section>
      )}
    </SiteLayout>
  );
};

/** 冒頭の自己紹介。名前クリックで nico ⇄ 本名を切り替える隠し機能（?id=real）を維持。 */
const Intro = ({ profile }: { profile: ProfileData }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isReal = searchParams.get("id") === "real";
  const displayName = isReal ? REAL_NAME : profile.name || "nico";

  const toggleName = () =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (isReal) next.delete("id");
        else next.set("id", "real");
        return next;
      },
      { replace: true }
    );

  const links = [
    { label: "Qiita", href: profile.qiitaUrl || QIITA_PROFILE_URL },
    { label: "GitHub", href: profile.githubUrl || "https://github.com/nico0748" },
    ...(profile.blogUrl ? [{ label: "Blog", href: profile.blogUrl }] : []),
  ];

  return (
    <section className="pt-20 sm:pt-28">
      <motion.img
        {...fadeUp(0)}
        src={profile.image || "/sns_icon_round.png"}
        alt=""
        className="w-16 h-16 rounded-full object-cover mb-10"
        style={{ border: "1px solid var(--avatar-border)" }}
      />
      <motion.h1 {...fadeUp(0.05)} className="text-[2.5rem] sm:text-5xl font-semibold tracking-tight leading-tight">
        <button
          type="button"
          onClick={toggleName}
          aria-label={`名前を${isReal ? "nico" : REAL_NAME}に切り替える`}
          className="text-left cursor-pointer"
          style={{ color: "var(--text-primary)" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={displayName}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="inline-block"
            >
              {displayName}
            </motion.span>
          </AnimatePresence>
        </button>
      </motion.h1>
      {profile.title && (
        <motion.p {...fadeUp(0.1)} className="mt-4 text-[15px]" style={{ color: "var(--text-muted)" }}>
          {profile.title}
        </motion.p>
      )}
      {profile.description && (
        <motion.p
          {...fadeUp(0.15)}
          className="mt-10 text-[15px] leading-[2.1] whitespace-pre-line"
          style={{ color: "var(--text-body)" }}
        >
          {profile.description}
        </motion.p>
      )}
      <motion.ul {...fadeUp(0.2)} className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noopener noreferrer" className="link-quiet">
              {l.label} <span aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </motion.ul>
    </section>
  );
};

/** 年ごとにまとめた静かな年表。year 列は "2026/05~" のような表記を想定。 */
const Timeline = ({ items }: { items: TimelineItem[] }) => {
  const groups: { year: string; rows: (TimelineItem & { when: string })[] }[] = [];
  items.forEach((item) => {
    const m = /^(\d{4})[/.-]?(.*)$/.exec(item.year.trim());
    const year = m ? m[1] : item.year;
    const when = (item.month || (m ? m[2] : "")).trim();
    const last = groups[groups.length - 1];
    const row = { ...item, when };
    if (last && last.year === year) last.rows.push(row);
    else groups.push({ year, rows: [row] });
  });

  return (
    <div className="flex flex-col gap-14">
      {groups.map((g) => (
        <div key={g.year}>
          <h3 className="text-[15px] font-medium mb-5" style={{ color: "var(--text-primary)" }}>
            {g.year}
          </h3>
          <ol className="flex flex-col gap-6">
            {g.rows.map((r, i) => {
              const title = r.title.trim();
              return (
                <li key={i} className="grid grid-cols-[4.5rem_1fr] gap-4">
                  <span className="text-[13px] tabular-nums pt-0.5" style={{ color: "var(--text-muted)" }}>
                    {formatWhen(r.when)}
                    {r.status === "upcoming" && " 予定"}
                  </span>
                  <div>
                    {r.href ? (
                      <a href={r.href} target="_blank" rel="noopener noreferrer" className="row-link text-[15px]">
                        <span className="row-title" style={{ color: "var(--text-primary)" }}>
                          {title}
                        </span>
                      </a>
                    ) : (
                      <p className="text-[15px]" style={{ color: "var(--text-primary)" }}>
                        {title}
                      </p>
                    )}
                    {r.description && (
                      <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        {r.description}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      ))}
    </div>
  );
};

/** "05~" → "5月〜", "04~07" → "4〜7月", "10" → "10月" */
const formatWhen = (when: string): string => {
  const m = /^(\d{1,2})\s*([~〜-])?\s*(\d{1,2})?$/.exec(when);
  if (!m) return when;
  const from = Number(m[1]);
  if (m[3]) return `${from}〜${Number(m[3])}月`;
  return m[2] ? `${from}月〜` : `${from}月`;
};

const Empty = ({ text }: { text: string }) => (
  <p className="py-4 text-sm" style={{ color: "var(--text-muted)" }}>
    {text}
  </p>
);

export default PortfolioPage;
