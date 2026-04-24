"use client"

import { motion } from "framer-motion"
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"
import CornerMarks from "./CornerMarks"

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
      className="relative rounded-2xl p-6"
      style={{
        background: 'var(--card-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid var(--card-border)',
        boxShadow: '0 4px 24px var(--card-shadow)',
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <CornerMarks />
      <div
        className="text-[10px] font-semibold tracking-[0.3em] uppercase mb-1 text-center"
        style={{
          color: 'var(--accent)',
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          opacity: 0.7,
        }}
      >
        // category
      </div>
      <h3
        className="text-xl font-bold mb-6 text-center tracking-tight"
        style={{ color: 'var(--text-primary)' }}
      >
        {category}
      </h3>

      <div className="mb-6">
        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={chartData}>
            <PolarGrid stroke="var(--border-color)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: 'var(--text-secondary)', fontSize: 11, fontWeight: 500 }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 5]}
              tick={{ fill: 'var(--text-muted)', fontSize: 9 }}
            />
            <Radar
              name={category}
              dataKey="value"
              stroke="var(--accent)"
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
              style={{ color: 'var(--text-body)' }}
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
                      : 'var(--skill-bar-empty)',
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
              style={{ color: 'var(--text-muted)' }}
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
