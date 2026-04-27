import Header2 from "../components/layouts/header/Header2";
import Footer2 from "../components/layouts/footer/Footer2";
import Profile2 from "../features/profile/Profile2";
import GraphPaperBackground from "../components/ui/GraphPaperBackground";

import ProjectCard from "../components/ui/ProjectCard";
import SectionWrapper from "../components/ui/SectionWrapper";
import SkillRadarChart from "../components/ui/SkillRadarChart";
import TimelineItemComponent from "../components/ui/TimelineItem";

import { fetchSheetData } from "../lib/googleSheets";
import { mapProfileData, mapPortfolioData, mapSkillsData, mapTimelineData } from "../lib/dataMapper";
import type { ProfileData, SkillCategory, TimelineItem as TimelineItemType, PortfolioItem } from "../lib/dataMapper";
import type { SheetRow } from "../lib/googleSheets";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
    <GraphPaperBackground>
      <div className="font-sans antialiased overflow-x-hidden min-h-screen">
        <Header2 activeSection={activeSection} scrollToSection={scrollToSection} />

        {/* ヘッダー分のスペーサー */}
        <div className="h-16 sm:h-20" />

        <main className="container mx-auto py-12 px-4 w-full max-w-full overflow-x-hidden">
          {/* Profile */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <SectionWrapper id="profile" title="">
              <Profile2 data={profile} />
            </SectionWrapper>
          </motion.div>

          {/* Projects */}
          <SectionWrapper id="projects" title="Projects" index={1} label="Works">
            {portfolio.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolio.slice(0, 3).map((item) => (
                    <ProjectCard key={item.id} item={item} />
                  ))}
                </div>
                {portfolio.length > 3 && (
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
          <SectionWrapper id="skills" title="Skills" index={2} label="Stack">
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
          <SectionWrapper id="timeline" title="Timeline" index={3} label="History">
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
    </GraphPaperBackground>
  );
};

/** Scroll-linked timeline with gradient vertical line */
const TimelineSection = ({ items }: { items: TimelineItemType[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end end"],
  });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  // Determine which items are the first occurrence of their year
  const seenYears = new Set<string>();
  const firstOfYear = items.map((item) => {
    if (item.year && !seenYears.has(item.year)) {
      seenYears.add(item.year);
      return true;
    }
    return false;
  });

  return (
    <div className="max-w-2xl mx-auto">
      <div ref={ref} className="relative">
        {/* Background track */}
        <div
          className="pointer-events-none absolute bottom-0 left-[7px] top-[12px] w-px"
          style={{ background: 'var(--border-color)' }}
        />
        {/* Scroll-linked gradient line */}
        <motion.div
          style={{ scaleY, background: 'linear-gradient(to bottom, #2563eb, #8b5cf6, #06b6d4)' }}
          className="pointer-events-none absolute bottom-0 left-[7px] top-[12px] w-px origin-top"
        />

        {items.map((item, index) => (
          <TimelineItemComponent
            key={index}
            year={item.year}
            title={item.title}
            description={item.description}
            type={item.type}
            href={item.href}
            status={item.status}
            index={index}
            isFirstOfYear={firstOfYear[index]}
          />
        ))}
      </div>
    </div>
  );
};

export default PortfolioPage;
