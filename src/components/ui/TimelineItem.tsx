"use client"

import { motion } from "framer-motion"

interface TimelineItemProps {
  year: string
  title: string
  description: string
  type?: "education" | "work" | "project" | "other"
}

const TimelineItem = ({ year, title, description, type = "other" }: TimelineItemProps) => {
  const getTypeColor = () => {
    switch (type) {
      case "education":
        return "bg-blue-500"
      case "work":
        return "bg-green-500"
      case "project":
        return "bg-purple-500"
      default:
        return "bg-[#8b7355]"
    }
  }

  return (
    <motion.div
      className="relative pl-8 pb-8 border-l-2 border-[#d4c4a8] last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* タイムラインのドット */}
      <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${getTypeColor()} border-4 border-[#f1e6d1]`} />

      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow">
        <div className="text-sm font-semibold text-[#8b7355] mb-1">{year}</div>
        <h3 className="text-xl font-bold text-[#333] mb-2">{title}</h3>
        <p className="text-[#666] leading-relaxed">{description}</p>
      </div>
    </motion.div>
  )
}

export default TimelineItem
