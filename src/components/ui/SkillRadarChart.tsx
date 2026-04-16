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
  const chartData = skills.map((skill) => ({
    subject: skill.name,
    value: skill.level,
    fullMark: 5,
  }))

  return (
    <motion.div
      className="rounded-2xl p-6"
      style={{
        background: 'rgba(255,255,255,0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(99, 152, 219, 0.2)',
        boxShadow: '0 4px 24px rgba(37, 99, 235, 0.07)',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h3
        className="text-xl font-bold mb-6 text-center tracking-tight"
        style={{ color: '#1e293b' }}
      >
        {category}
      </h3>

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="rgba(99,152,219,0.25)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 5]}
              tick={{ fill: '#94a3b8', fontSize: 9 }}
            />
            <Radar
              name={category}
              dataKey="value"
              stroke="#2563eb"
              fill="#3b82f6"
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center gap-3">
            <span
              className="text-sm font-medium w-28 flex-shrink-0"
              style={{ color: '#475569' }}
            >
              {skill.name}
            </span>
            <div className="flex gap-1 flex-1">
              {[...Array(5)].map((_, levelIndex) => (
                <motion.div
                  key={levelIndex}
                  className="h-2 flex-1 rounded-full"
                  style={{
                    background: levelIndex < skill.level
                      ? 'linear-gradient(90deg, #3b82f6, #6366f1)'
                      : 'rgba(99,152,219,0.12)',
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 + levelIndex * 0.05 }}
                />
              ))}
            </div>
            <span
              className="text-xs w-8 text-right font-medium"
              style={{ color: '#94a3b8' }}
            >
              {skill.level}/5
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default SkillRadarChart
