import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import SiteLayout, { SectionHeading, MoreLink } from "../components/layouts/SiteLayout";
import ArticleList from "../components/ui/ArticleList";
import WorkList from "../components/ui/WorkList";
import SkillRadarChart from "../components/ui/SkillRadarChart";
import { skillColor } from "../lib/skillColors";
import Timeline from "../components/ui/Timeline";
import SocialLinks from "../components/ui/SocialLinks";
import type { SocialLink } from "../components/ui/SocialLinks";

import { fetchSheetData } from "../lib/googleSheets";
import type { SheetRow } from "../lib/googleSheets";
import { mapProfileData, mapSkillsData, mapTimelineData } from "../lib/dataMapper";
import { fetchProjects, getCachedProjects } from "../lib/projects";
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
  const [works, setWorks] = useState<PortfolioItem[]>(() => getCachedProjects() ?? []);
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
        const [profileRows, worksItems, skillsRows, timelineRows] = await Promise.all([
          fetchSheetData<SheetRow>("Profile"),
          fetchProjects(),
          fetchSheetData<SheetRow>("Skills"),
          fetchSheetData<SheetRow>("Timeline"),
        ]);
        if (profileRows.length > 0) setProfile(mapProfileData(profileRows));
        if (worksItems.length > 0) setWorks(worksItems);
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
        {works.length > 0 ? <WorkList items={works.slice(0, 4)} /> : <Empty text="作品を読み込んでいます" />}
        <MoreLink to="/projects">すべての作品を見る</MoreLink>
      </section>

      <section className="mt-32">
        <SectionHeading id="articles">Articles</SectionHeading>
        {articles.length > 0 ? (
          <ArticleList items={articles.slice(0, 4)} />
        ) : (
          <Empty text={articlesLoaded ? "記事を取得できませんでした。Qiita から直接ご覧ください。" : "記事を読み込んでいます"} />
        )}
        <MoreLink to="/articles">すべての記事を見る</MoreLink>
      </section>

      {skills.length > 0 && (
        <section className="mt-32">
          <SectionHeading id="skills">Skills</SectionHeading>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {skills.slice(0, 4).map((c, i) => (
              <SkillRadarChart
                key={c.category}
                category={c.category}
                skills={c.skills}
                color={skillColor(c.category, i)}
              />
            ))}
          </div>
          <MoreLink to="/skills">すべてのスキルを見る</MoreLink>
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

  // Profile シートの各 URL から表示。Qiita だけは記事取得と同じユーザーを既定値にする
  const candidates: { kind: SocialLink["kind"]; url?: string; label?: string }[] = [
    { kind: "x", url: profile.xUrl },
    { kind: "github", url: profile.githubUrl },
    { kind: "qiita", url: profile.qiitaUrl || QIITA_PROFILE_URL },
    // LinkedIn は URL の ID が「名-姓」になるため、表示名は Profile シートの linkedinLabel を優先
    { kind: "linkedin", url: profile.linkedinUrl, label: profile.linkedinLabel },
  ];
  const socials = candidates.filter((l): l is SocialLink => !!l.url);

  return (
    <section className="pt-20 sm:pt-28">
      <motion.img
        {...fadeUp(0)}
        src={profile.image || "/sns_icon_round.png"}
        alt=""
        className="w-16 h-16 rounded-full object-cover mb-10"
        style={{ border: "1px solid var(--avatar-border)" }}
      />
      {/* 左: 名前・肩書・紹介文 / 右: ソーシャルリンクのカード（名前と同じ高さから始める）。スマホでは下に回す */}
      <div className="grid grid-cols-1 gap-12 sm:grid-cols-[minmax(0,1fr)_240px] sm:gap-10 sm:items-start">
        <div>
          <motion.h1 {...fadeUp(0.05)} className="text-[2.75rem] sm:text-[3.5rem] font-semibold tracking-tight leading-tight">
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
            <motion.p {...fadeUp(0.1)} className="mt-4 text-[17px]" style={{ color: "var(--text-muted)" }}>
              {/* 「A | B」の肩書は区切りの位置で折り返す（単語の途中で改行しない） */}
              {profile.title.split("|").map((part, i) => (
                <span key={i}>
                  {i > 0 && <span className="mx-2.5 opacity-50">|</span>}
                  <span className="inline-block">{part.trim()}</span>
                </span>
              ))}
            </motion.p>
          )}
          {profile.description && (
            <motion.p
              {...fadeUp(0.15)}
              className="mt-10 text-[17px] leading-[2.1] whitespace-pre-line"
              style={{ color: "var(--text-body)" }}
            >
              {profile.description}
            </motion.p>
          )}
          {profile.blogUrl && (
            <a href={profile.blogUrl} target="_blank" rel="noopener noreferrer" className="link-quiet mt-8 inline-block text-[15px]">
              Blog ↗
            </a>
          )}
        </div>
        <motion.div {...fadeUp(0.2)}>
          <SocialLinks links={socials} />
        </motion.div>
      </div>
    </section>
  );
};

const Empty = ({ text }: { text: string }) => (
  <p className="py-4 text-[15px]" style={{ color: "var(--text-muted)" }}>
    {text}
  </p>
);

export default PortfolioPage;
