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
        return "bg-blue-600"
    }
  }

  return (
    <motion.div
      className="relative pl-8 pb-8 border-l-2 border-gray-800 last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* タイムラインのドット */}
      <div className={`absolute left-[-9px] top-0 w-4 h-4 rounded-full ${getTypeColor()} border-4 border-[#0B0C10] shadow-sm`} />

      <motion.div
        className="bg-[#1F2833] border border-gray-800 rounded-xl p-6 shadow-md"
        whileHover={{ 
          scale: 1.05, 
          y: -5,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
          borderColor: "rgba(59, 130, 246, 0.5)",
          zIndex: 20
        }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <div className="text-sm font-semibold text-blue-400 mb-1 tracking-wider">{year}</div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
      </motion.div>
    </motion.div>
  )
}

export default TimelineItem
