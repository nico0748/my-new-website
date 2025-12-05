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
      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-2xl font-bold text-white mb-6 text-center tracking-wide">{category}</h3>

      {/* レーダーチャート */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="#444" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "#ccc", fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: "#888", fontSize: 10 }} />
            <Radar name={category} dataKey="value" stroke="#d4af37" fill="#d4af37" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* スキル上達度の表 */}
      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-300 w-28 flex-shrink-0">{skill.name}</span>
            <div className="flex gap-1 flex-1">
              {[...Array(5)].map((_, levelIndex) => (
                <motion.div
                  key={levelIndex}
                  className={`h-2 flex-1 rounded-full ${levelIndex < skill.level ? "bg-[#d4af37] shadow-[0_0_5px_#d4af37]" : "bg-gray-800"}`}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 + levelIndex * 0.05 }}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 w-8 text-right">{skill.level}/5</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default SkillRadarChart
