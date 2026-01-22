import Header2 from "../components/layouts/header/Header2";
import Footer2 from "../components/layouts/footer/Footer2";
import Profile2 from "../features/profile/Profile2";
import StarryBackground from "../components/ui/StarryBackground";

// データインポート
import { portfolioData } from "../data/portfolioData/portfolioData";
import { profileData2 } from "../data/profileData/profileData2";
import { skillsData } from "../data/skillsData/skillsData";
import { timelineData } from "../data/timelineData/timelineData";

// UIコンポーネント
import ProjectCard from "../components/ui/ProjectCard";
import SectionWrapper from "../components/ui/SectionWrapper";
import SkillRadarChart from "../components/ui/SkillRadarChart";
import TimelineItem from "../components/ui/TimelineItem";

// Custom hooks / utils
import { fetchSheetData } from "../lib/googleSheets";
import { mapProfileData, mapPortfolioData, mapSkillsData, mapTimelineData } from "../lib/dataMapper";
import type { ProfileData, SkillCategory, TimelineItem as TimelineItemType } from "../lib/dataMapper";
import type { SheetRow } from "../lib/googleSheets";
import type { PortfolioItem } from "../data/portfolioData/portfolioData";

//ライブラリインポート
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PortfolioPage = () => {
  const [activeSection, setActiveSection] = useState<string>("profile");
  
  // Data States
  const [profile, setProfile] = useState<ProfileData>(profileData2);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(portfolioData);
  const [skills, setSkills] = useState<SkillCategory[]>(skillsData);
  const [timeline, setTimeline] = useState<TimelineItemType[]>(timelineData);

  useEffect(() => {
    const fetchData = async () => {
      // If no API key is present, just stick to local data (already set as initial state)
      if (!import.meta.env.VITE_GOOGLE_SHEETS_API_KEY) return;

      try {
        const [profileRows, portfolioRows, skillsRows, timelineRows] = await Promise.all([
            fetchSheetData<SheetRow>("Profile"),
            fetchSheetData<SheetRow>("Projects"),
            fetchSheetData<SheetRow>("Skills"),
            fetchSheetData<SheetRow>("Timeline")
        ]);

        if (profileRows.length > 0) setProfile(mapProfileData(profileRows));
        if (portfolioRows.length > 0) setPortfolio(mapPortfolioData(portfolioRows));
        if (skillsRows.length > 0) setSkills(mapSkillsData(skillsRows));
        if (timelineRows.length > 0) setTimeline(mapTimelineData(timelineRows));

      } catch (error) {
        console.error("Failed to fetch data from Google Sheets, falling back to local data", error);
        // No action needed as state is initialized with local data
      }
    };

    fetchData();
  }, []);

  const scrollToSection = (id: string): void => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth",
      });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const sections = [
      "profile",
      "projects",
      "skills",
      "timeline",
    ];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
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
    <StarryBackground>
      <div className="font-sans antialiased overflow-x-hidden min-h-screen">
        <Header2
          activeSection={activeSection}
          scrollToSection={scrollToSection}
        />

        {/* ヘッダーの高さ分のスペーサー */}
        <div className="h-16 sm:h-20"></div>

        <main className="container mx-auto py-12 px-4 w-full max-w-full overflow-x-hidden">
          {/* Profile Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SectionWrapper id="profile" title="">
              <Profile2 data={profile} />
            </SectionWrapper>
          </motion.div>

          {/* Projects Section */}
          <SectionWrapper id="projects" title="Projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolio.map((item) => (
                <ProjectCard key={item.id} item={item} />
              ))}
            </div>
          </SectionWrapper>

          {/* Skills Section */}
          <SectionWrapper id="skills" title="Skills">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {skills.map((category, index) => (
                <SkillRadarChart
                  key={index}
                  category={category.category}
                  skills={category.skills}
                />
              ))}
            </div>
          </SectionWrapper>

          {/* Timeline Section */}
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
        
        {/* Debug Warning for Missing API Key */}
        {!import.meta.env.VITE_GOOGLE_SHEETS_API_KEY && (
          <div className="fixed bottom-4 right-4 bg-red-900/90 text-white p-4 rounded-lg shadow-lg border border-red-500 z-50 max-w-md pointer-events-none">
            <h4 className="font-bold flex items-center gap-2 text-sm">
               ⚠️ Google Sheets API 未設定
            </h4>
            <p className="text-xs mt-1">
              APIキーが設定されていないため、ローカルデータを表示しています。
              スプレッドシートの変更を反映させるには <code>.env.local</code> ファイルを作成してください。
            </p>
          </div>
        )}
      </div>
    </StarryBackground>
  );
};

export default PortfolioPage;
