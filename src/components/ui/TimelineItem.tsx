"use client"

import { motion } from "framer-motion"

interface TimelineItemProps {
  year: string
  title: string
  description: string
  type?: "education" | "work" | "project" | "other" | "certification"
}

const typeConfig = {
  education:     { color: '#22c55e', label: 'Education', bg: 'rgba(34,197,94,0.1)' },
  work:          { color: '#ef4444', label: 'Work',      bg: 'rgba(239,68,68,0.1)' },
  project:       { color: '#8b5cf6', label: 'Project',   bg: 'rgba(139,92,246,0.1)' },
  certification: { color: '#f59e0b', label: 'Cert',      bg: 'rgba(245,158,11,0.1)' },
  other:         { color: '#3b82f6', label: 'Other',     bg: 'rgba(59,130,246,0.1)' },
}

const TimelineItem = ({ year, title, description, type = "other" }: TimelineItemProps) => {
  const cfg = typeConfig[type] ?? typeConfig.other

  return (
    <motion.div
      className="relative pl-10 pb-8 last:pb-0"
      style={{ borderLeft: '2px solid rgba(99, 152, 219, 0.25)' }}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* ドット */}
      <div
        className="absolute left-[-9px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm"
        style={{ background: cfg.color }}
      />

      <motion.div
        className="rounded-2xl p-5"
        style={{
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(99, 152, 219, 0.18)',
          boxShadow: '0 2px 12px rgba(37, 99, 235, 0.05)',
        }}
        whileHover={{
          y: -4,
          boxShadow: '0 12px 28px rgba(37, 99, 235, 0.12)',
        }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
            style={{ color: cfg.color, background: cfg.bg }}
          >
            {cfg.label}
          </span>
          <span
            className="text-sm font-semibold tracking-wide"
            style={{ color: '#2563eb' }}
          >
            {year}
          </span>
        </div>
        <h3
          className="text-lg font-bold mb-1.5 tracking-tight"
          style={{ color: '#1e293b' }}
        >
          {title}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
          {description}
        </p>
      </motion.div>
    </motion.div>
  )
}

export default TimelineItem
