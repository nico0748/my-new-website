"use client"

import { motion } from "framer-motion"

interface SkillCardProps {
  name: string
  level: number // 1-5 のレベル
  icon?: string
}

const SkillCard = ({ name, level, icon }: SkillCardProps) => {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-3">
        {icon && <span className="text-2xl">{icon}</span>}
        <h3 className="font-semibold text-lg text-[#333]">{name}</h3>
      </div>
      <div className="flex gap-1">
        {[...Array(5)].map((_, index) => (
          <div key={index} className={`h-2 flex-1 rounded-full ${index < level ? "bg-[#8b7355]" : "bg-gray-300"}`} />
        ))}
      </div>
    </motion.div>
  )
}

export default SkillCard