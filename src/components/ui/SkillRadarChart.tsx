"use client"

import { motion } from "framer-motion"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface Skill {
  name: string
  level: number
}

interface SkillRadarChartProps {
  category: string
  skills: Skill[]
}

const SkillRadarChart = ({ category, skills }: SkillRadarChartProps) => {
  // Rechartsのデータ形式に変換
  const chartData = skills.map((skill) => ({
    subject: skill.name,
    value: skill.level,
    fullMark: 5,
  }))

  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold text-[#333] mb-6 text-center">{category}</h3>

      {/* レーダーチャート */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="#d1c4b0" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#333", fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: "#666", fontSize: 10 }} />
            <Radar name={category} dataKey="value" stroke="#8b7355" fill="#8b7355" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* スキル上達度の表 */}
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#333] w-28 flex-shrink-0">{skill.name}</span>
            <div className="flex gap-1 flex-1">
              {[...Array(5)].map((_, levelIndex) => (
                <motion.div
                  key={levelIndex}
                  className={`h-3 flex-1 rounded-full ${levelIndex < skill.level ? "bg-[#8b7355]" : "bg-gray-300"}`}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 + levelIndex * 0.05 }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 w-8 text-right">{skill.level}/5</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default SkillRadarChart
