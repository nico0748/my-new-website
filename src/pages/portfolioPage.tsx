import Header2 from "../components/layouts/header/Header2";
import Footer2 from "../components/layouts/footer/Footer2";
import HeroSection from "../features/hero/HeroSection";
import Profile2 from "../features/profile/Profile2";
import TerminalBackground from "../components/ui/TerminalBackground";

import ProjectCard from "../components/ui/ProjectCard";
import SectionWrapper from "../components/ui/SectionWrapper";
import SkillRadarChart from "../components/ui/SkillRadarChart";
import TimelineItemComponent from "../components/ui/TimelineItem";

import { fetchSheetData } from "../lib/googleSheets";
import { mapProfileData, mapPortfolioData, mapSkillsData, mapTimelineData } from "../lib/dataMapper";
import type { ProfileData, SkillCategory, TimelineItem as TimelineItemType, PortfolioItem } from "../lib/dataMapper";
import type { SheetRow } from "../lib/googleSheets";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const PortfolioPage = () => {
  const [activeSection, setActiveSection] = useState<string>("profile");

  const [profile, setProfile] = useState<ProfileData>({ name: "", title: "", description: "", image: "" });
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [timeline, setTimeline] = useState<TimelineItemType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!import.meta.env.VITE_GOOGLE_SHEETS_API_KEY) return;

      try {
        const [profileRows, portfolioRows, skillsRows, timelineRows] = await Promise.all([
          fetchSheetData<SheetRow>("Profile"),
          fetchSheetData<SheetRow>("Projects"),
          fetchSheetData<SheetRow>("Skills"),
          fetchSheetData<SheetRow>("Timeline"),
        ]);

        if (profileRows.length > 0) setProfile(mapProfileData(profileRows));
        if (portfolioRows.length > 0) setPortfolio(mapPortfolioData(portfolioRows));
        if (skillsRows.length > 0) setSkills(mapSkillsData(skillsRows));
        if (timelineRows.length > 0) setTimeline(mapTimelineData(timelineRows));
      } catch (error) {
        console.error("Failed to fetch data from Google Sheets", error);
      }
    };

    fetchData();
  }, []);

  const scrollToSection = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const sections = ["profile", "projects", "skills", "timeline"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <TerminalBackground>
      <div className="font-sans antialiased overflow-x-hidden min-h-screen">
        <Header2 activeSection={activeSection} scrollToSection={scrollToSection} />

        {/* Hero — フルスクリーン（profile.name + profile.title）*/}
        <HeroSection
          name={profile.name}
          title={profile.title}
          onScrollDown={() => scrollToSection("profile")}
        />

        <main className="container mx-auto px-4 w-full max-w-full overflow-x-hidden">
          {/* About me（既存の profile セクション） */}
          <SectionWrapper
            id="profile"
            title="About me"
            index={1}
            label="Profile"
            subtitle="自己紹介と、これまでに歩んできた背景・関心の方向性をまとめています。"
          >
            <Profile2 data={profile} />
          </SectionWrapper>

          {/* Works */}
          <SectionWrapper
            id="projects"
            title="Works"
            index={2}
            label="Projects"
            subtitle="腕によりをかけて制作した、愛すべき成果物たちをご紹介します。"
          >
            {portfolio.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolio.slice(0, 6).map((item) => (
                    <ProjectCard key={item.id} item={item} />
                  ))}
                </div>
                {portfolio.length > 6 && (
                  <div className="flex justify-center mt-8">
                    <Link
                      to="/projects"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
                      style={{
                        background: 'var(--card-bg)',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent-border)',
                        boxShadow: '0 2px 12px var(--accent-shadow)',
                      }}
                    >
                      すべてのプロジェクトを見る →
                    </Link>
                  </div>
                )}
              </>
            ) : (
              <p className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
                プロジェクトデータがありません（Google Sheets を設定してください）
              </p>
            )}
          </SectionWrapper>

          {/* Skills */}
          <SectionWrapper
            id="skills"
            title="Skills"
            index={3}
            label="Stack"
            subtitle="日々の制作で使っている技術スタックを、得意分野ごとにレーダーチャートで可視化しています。"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {skills.slice(0, 3).map((category, index) => (
                <SkillRadarChart key={index} category={category.category} skills={category.skills} />
              ))}
            </div>
            <div className="flex justify-center mt-8">
              <Link
                to="/skills"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  background: 'var(--card-bg)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent-border)',
                  boxShadow: '0 2px 12px var(--accent-shadow)',
                }}
              >
                すべてのスキルを見る →
              </Link>
            </div>
          </SectionWrapper>

          {/* Timeline */}
          <SectionWrapper
            id="timeline"
            title="Timeline"
            index={4}
            label="History"
            subtitle="学業・仕事・制作・資格など、これまでの歩みを時系列で振り返ります。"
          >
            <TimelineSection items={timeline} />
          </SectionWrapper>
        </main>

        <Footer2 />

        {/* APIキー未設定警告 */}
        {!import.meta.env.VITE_GOOGLE_SHEETS_API_KEY && (
          <div
            className="fixed bottom-4 right-4 p-4 rounded-2xl z-50 max-w-sm pointer-events-none"
            style={{
              background: 'var(--warning-bg)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(239,68,68,0.3)',
              boxShadow: '0 8px 24px rgba(239,68,68,0.12)',
            }}
          >
            <h4 className="font-bold text-sm flex items-center gap-1.5" style={{ color: '#ef4444' }}>
              ⚠️ Google Sheets API 未設定
            </h4>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              <code className="px-1 py-0.5 rounded text-xs" style={{ background: 'rgba(239,68,68,0.08)' }}>
                .env.local
              </code>{" "}
              を作成してAPIキーを設定してください。
            </p>
          </div>
        )}
      </div>
    </TerminalBackground>
  );
};

/** Zigzag vertical timeline with center line, year banners, and animated nodes. */
const TimelineSection = ({ items }: { items: TimelineItemType[] }) => {
  // Group consecutive items sharing the same year.
  const groups: { year: string; yearLabel?: string; items: TimelineItemType[] }[] = [];
  items.forEach((item) => {
    const last = groups[groups.length - 1];
    if (last && last.year === item.year) {
      last.items.push(item);
      if (!last.yearLabel && item.yearLabel) last.yearLabel = item.yearLabel;
    } else {
      groups.push({ year: item.year, yearLabel: item.yearLabel, items: [item] });
    }
  });

  return (
    <div className="relative max-w-4xl mx-auto pb-8">
      {/* Center line (desktop) */}
      <div
        className="absolute top-0 bottom-0 hidden md:block w-px"
        style={{
          left: '50%',
          transform: 'translateX(-50%)',
          background:
            'linear-gradient(to bottom, transparent 0%, var(--border-color) 8%, var(--border-color) 92%, transparent 100%)',
        }}
      />
      {/* Left line (mobile) */}
      <div
        className="absolute top-0 bottom-0 md:hidden w-px"
        style={{
          left: '1rem',
          background:
            'linear-gradient(to bottom, transparent 0%, var(--border-color) 6%, var(--border-color) 94%, transparent 100%)',
        }}
      />

      {groups.map((group, gi) => {
        const startIdx = groups
          .slice(0, gi)
          .reduce((acc, g) => acc + g.items.length, 0);
        return (
          <div key={`${group.year}-${gi}`} className="relative">
            {/* Year banner — sits on top of the center line */}
            <div className="relative flex justify-start md:justify-center pl-12 md:pl-0 mb-8 md:mb-10 mt-2 md:mt-4">
              <div
                className="relative z-10 inline-flex items-baseline gap-2 px-4 py-1.5 rounded-full"
                style={{
                  background: 'var(--card-bg-solid)',
                  border: '1.5px solid var(--accent-border)',
                }}
              >
                <span
                  className="text-lg md:text-xl font-bold tracking-tight tabular-nums"
                  style={{
                    color: 'var(--accent)',
                    letterSpacing: '0.06em',
                    fontFamily: "'JetBrains Mono', 'Noto Sans JP', monospace",
                  }}
                >
                  {group.year}
                </span>
                {group.yearLabel && (
                  <span
                    className="text-[11px] sm:text-xs font-medium"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {group.yearLabel}
                  </span>
                )}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-8 md:space-y-12 mb-12">
              {group.items.map((item, ii) => (
                <TimelineItemComponent
                  key={`${gi}-${ii}`}
                  month={item.month}
                  title={item.title}
                  description={item.description}
                  href={item.href}
                  status={item.status}
                  type={item.type}
                  index={startIdx + ii}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PortfolioPage;
