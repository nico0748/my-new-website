import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import SiteLayout, { SectionHeading, MoreLink, READABLE_WIDTH } from "../components/layouts/SiteLayout";
import ArticleList from "../components/ui/ArticleList";
import WorkList from "../components/ui/WorkList";
import SkillRadarChart from "../components/ui/SkillRadarChart";
import { skillColor } from "../lib/skillColors";
import Timeline from "../components/ui/Timeline";
import OffHoursBoard from "../components/ui/OffHoursBoard";
import Reveal from "../components/ui/Reveal";
import SocialLinks from "../components/ui/SocialLinks";
import type { SocialLink } from "../components/ui/SocialLinks";

import { fetchSheetData } from "../lib/googleSheets";
import type { SheetRow } from "../lib/googleSheets";
import { mapProfileData, mapSkillsData, mapTimelineData } from "../lib/dataMapper";
import { fetchProjects, getCachedProjects } from "../lib/projects";
import type { ProfileData, SkillCategory, TimelineItem, PortfolioItem, ArticleItem } from "../lib/dataMapper";
import { fetchArticles, QIITA_PROFILE_URL } from "../lib/articles";
import { fetchOffHours, getCachedOffHours } from "../lib/offHours";
import type { OffHoursItem } from "../lib/dataMapper";

const REAL_NAME = "細澤 悠真";

const PortfolioPage = () => {
  const [profile, setProfile] = useState<ProfileData>({ name: "", title: "", description: "", image: "" });
  const [works, setWorks] = useState<PortfolioItem[]>(() => getCachedProjects() ?? []);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [articlesLoaded, setArticlesLoaded] = useState(false);
  const [offHours, setOffHours] = useState<OffHoursItem[]>(() => getCachedOffHours() ?? []);
  // Profile シートを読み終えたか（ソーシャルリンクを全件そろってからフェードインさせるため）
  const [profileReady, setProfileReady] = useState(!import.meta.env.VITE_GOOGLE_SHEETS_API_KEY);

  useEffect(() => {
    fetchArticles()
      .then(setArticles)
      .finally(() => setArticlesLoaded(true));
    // 趣味の記録は Profile 等とは別に読む（待たせるとソーシャルリンクの表示まで遅れるため）
    fetchOffHours().then(setOffHours);

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
      } finally {
        setProfileReady(true);
      }
    })();
  }, []);

  return (
    <SiteLayout>
      <Intro profile={profile} ready={profileReady} />

      <section className="mt-24 md:mt-32">
        <Reveal>
          <SectionHeading id="works">Works</SectionHeading>
        </Reveal>
        {works.length > 0 ? <WorkList items={works.slice(0, 6)} /> : <Empty text="作品を読み込んでいます" />}
        <Reveal>
          <MoreLink to="/projects">すべての作品を見る</MoreLink>
        </Reveal>
      </section>

      <section className="mt-24 md:mt-32">
        <Reveal>
          <SectionHeading id="articles">Articles</SectionHeading>
        </Reveal>
        {articles.length > 0 ? (
          <ArticleList items={articles.slice(0, 6)} />
        ) : (
          <Empty text={articlesLoaded ? "記事を取得できませんでした。Qiita から直接ご覧ください。" : "記事を読み込んでいます"} />
        )}
        <Reveal>
          <MoreLink to="/articles">すべての記事を見る</MoreLink>
        </Reveal>
      </section>

      {skills.length > 0 && (
        <section className="mt-24 md:mt-32">
          <Reveal>
            <SectionHeading id="skills">Skills</SectionHeading>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {skills.slice(0, 4).map((c, i) => (
              <Reveal key={c.category} className="h-full">
                <SkillRadarChart category={c.category} skills={c.skills} color={skillColor(c.category, i)} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <MoreLink to="/skills">すべてのスキルを見る</MoreLink>
          </Reveal>
        </section>
      )}

      {timeline.length > 0 && (
        <section className="mt-24 md:mt-32">
          <Reveal>
            <SectionHeading id="timeline">Timeline</SectionHeading>
          </Reveal>
          <Timeline items={timeline} />
        </section>
      )}

      {offHours.length > 0 && (
        <section className="mt-24 md:mt-32">
          <Reveal>
            <SectionHeading id="off-hours">Off-hours</SectionHeading>
          </Reveal>
          <Reveal
            className={`-mt-3 md:-mt-4 mb-8 md:mb-10 ${READABLE_WIDTH} text-[15px] leading-[1.9]`}
            style={{ color: "var(--text-secondary)" }}
          >
            <p>コードの外で、観て、聴いて、手に取って、足を運んだもの。</p>
          </Reveal>
          <OffHoursBoard items={offHours} />
        </section>
      )}
    </SiteLayout>
  );
};

/** 冒頭の自己紹介。名前クリックで nico ⇄ 本名を切り替える隠し機能（?id=real）を維持。 */
const Intro = ({ profile, ready }: { profile: ProfileData; ready: boolean }) => {
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
    <section className="pt-12 md:pt-20">
      {/* Profile → WORKS → … の順に、画面に入ったものから下からフェードインする（Reveal） */}
      <Reveal>
        <img
          src={profile.image || "/sns_icon_round.png"}
          alt=""
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-8 md:mb-10"
          style={{ border: "1px solid var(--avatar-border)" }}
        />
      </Reveal>
      {/* 左: 名前・肩書・紹介文 / 右: ソーシャルリンクのカード（名前と同じ高さから始める）。タブレット未満では下に回す */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_300px] md:gap-14 lg:gap-20 md:items-start">
        <div>
          <Reveal>
            <h1 className="text-[2.75rem] sm:text-[3.5rem] font-semibold tracking-tight leading-tight">
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
            </h1>
          </Reveal>
          {profile.title && (
            <Reveal className="mt-4 text-[17px]" style={{ color: "var(--text-muted)" }}>
              {/* 「A | B」の肩書は区切りの位置で折り返す（単語の途中で改行しない） */}
              {profile.title.split("|").map((part, i) => (
                <span key={i}>
                  {i > 0 && <span className="mx-2.5 opacity-50">|</span>}
                  <span className="inline-block">{part.trim()}</span>
                </span>
              ))}
            </Reveal>
          )}
          {profile.description && (
            <Reveal
              className={`mt-8 md:mt-10 ${READABLE_WIDTH} text-[17px] leading-[2.1] whitespace-pre-line`}
              style={{ color: "var(--text-body)" }}
            >
              <p>{profile.description}</p>
            </Reveal>
          )}
          {profile.blogUrl && (
            <a href={profile.blogUrl} target="_blank" rel="noopener noreferrer" className="link-quiet mt-8 inline-block text-[15px]">
              Blog ↗
            </a>
          )}
        </div>
        {ready && (
          <Reveal>
            <SocialLinks links={socials} />
          </Reveal>
        )}
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
