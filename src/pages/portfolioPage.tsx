"use client"

import Header from "../components/layouts/header/Header"
import Footer from "../components/layouts/footer/Footer"
import Profile from "../features/profile/Profile"

// データインポート
import { portfolioData } from "../data/portfolioData/portfolioData"
import { profileData } from "../data/profileData/profileData"
import { skillsData } from "../data/skillsData/skillsData"
import { timelineData } from "../data/timelineData/timelineData"

// UIコンポーネント
import ProjectCard from "../components/ui/ProjectCard"
import SectionWrapper from "../components/ui/SectionWrapper"
import SkillRadarChart from "../components/ui/SkillRadarChart"
import TimelineItem from "../components/ui/TimelineItem"

//ライブラリインポート
import { motion } from "framer-motion"

const PortfolioPage = () => {
  return (
    <div className="bg-[#f1e6d1] text-[#333] font-sans antialiased overflow-x-hidden min-h-screen">
      <Header activeSection="portfolio" scrollToSection={() => {}} />

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
          <Profile data={profileData} />
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
              <SkillRadarChart key={index} category={category.category} skills={category.skills} />
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

      <Footer />
    </div>
  )
}

export default PortfolioPage