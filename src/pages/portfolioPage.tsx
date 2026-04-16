import Header2 from "../components/layouts/header/Header2";
import Footer2 from "../components/layouts/footer/Footer2";
import Profile2 from "../features/profile/Profile2";
import GraphPaperBackground from "../components/ui/GraphPaperBackground";

import ProjectCard from "../components/ui/ProjectCard";
import SectionWrapper from "../components/ui/SectionWrapper";
import SkillRadarChart from "../components/ui/SkillRadarChart";
import TimelineItem from "../components/ui/TimelineItem";

import { fetchSheetData } from "../lib/googleSheets";
import { mapProfileData, mapPortfolioData, mapSkillsData, mapTimelineData } from "../lib/dataMapper";
import type { ProfileData, SkillCategory, TimelineItem as TimelineItemType, PortfolioItem } from "../lib/dataMapper";
import type { SheetRow } from "../lib/googleSheets";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
          <SectionWrapper id="projects" title="Projects">
            {portfolio.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((item) => (
                  <ProjectCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="text-center py-12 text-sm" style={{ color: '#94a3b8' }}>
                プロジェクトデータがありません（Google Sheets を設定してください）
              </p>
            )}
          </SectionWrapper>

          {/* Skills */}
          <SectionWrapper id="skills" title="Skills">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {skills.map((category, index) => (
                <SkillRadarChart key={index} category={category.category} skills={category.skills} />
              ))}
            </div>
          </SectionWrapper>

          {/* Timeline */}
          <SectionWrapper id="timeline" title="Timeline">
            <div className="max-w-3xl mx-auto">
              {timeline.map((item, index) => (
                <TimelineItem
                  key={index}
                  year={item.year}
                  title={item.title}
                  description={item.description}
                  type={item.type}
                />
              ))}
            </div>
          </SectionWrapper>
        </main>

        <Footer2 />

        {/* APIキー未設定警告 */}
        {!import.meta.env.VITE_GOOGLE_SHEETS_API_KEY && (
          <div
            className="fixed bottom-4 right-4 p-4 rounded-2xl z-50 max-w-sm pointer-events-none"
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(239,68,68,0.3)',
              boxShadow: '0 8px 24px rgba(239,68,68,0.12)',
            }}
          >
            <h4 className="font-bold text-sm flex items-center gap-1.5" style={{ color: '#ef4444' }}>
              ⚠️ Google Sheets API 未設定
            </h4>
            <p className="text-xs mt-1" style={{ color: '#64748b' }}>
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

export default PortfolioPage;
