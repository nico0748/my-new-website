import Header2 from "../components/layouts/header/Header2";
import Footer2 from "../components/layouts/footer/Footer2";
import Profile2 from "../features/profile/Profile2";
import CircuitBoardBackground from "../components/ui/CircuitBoardBackground";

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

//ライブラリインポート
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const PortfolioPage = () => {
  const [activeSection, setActiveSection] = useState<string>("profile");

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
    <CircuitBoardBackground>
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
              <Profile2 data={profileData2} />
            </SectionWrapper>
          </motion.div>

          {/* Projects Section */}
          <SectionWrapper id="projects" title="Projects">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioData.map((item) => (
                <ProjectCard key={item.id} item={item} />
              ))}
            </div>
          </SectionWrapper>

          {/* Skills Section */}
          <SectionWrapper id="skills" title="Skills">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {skillsData.map((category, index) => (
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
              {timelineData.map((item, index) => (
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
      </div>
    </CircuitBoardBackground>
  );
};

export default PortfolioPage;
