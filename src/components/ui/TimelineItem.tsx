"use client"

import { motion } from "framer-motion"

interface TimelineItemProps {
  year: string
  title: string
  description: string
  type?: "education" | "work" | "project" | "other" | "certification"
}

const TimelineItem = ({ year, title, description, type = "other" }: TimelineItemProps) => {
  const getTypeColor = () => {
    switch (type) {
      case "other":
        return "bg-blue-500"
      case "education":
        return "bg-green-500"
      case "project":
        return "bg-purple-500"
      case "work":
        return "bg-red-500"
      case "certification":
        return "bg-yellow-500"
      default:
        return "bg-[#d4af37]"
    }
  }

  return (
    <motion.div
      className="relative pl-8 pb-8 border-l-2 border-white/20 last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* タイムラインのドット */}
      <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${getTypeColor()} border-4 border-black shadow-[0_0_10px_currentColor]`} />

      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-lg hover:bg-white/10 transition-colors">
        <div className="text-sm font-semibold text-[#d4af37] mb-1 tracking-wider">{year}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-300 leading-relaxed text-sm">{description}</p>
      </div>
    </motion.div>
  )
}

export default TimelineItem
