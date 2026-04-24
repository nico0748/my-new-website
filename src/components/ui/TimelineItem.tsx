import { motion } from "framer-motion"

interface TimelineItemProps {
  year: string
  title: string
  description: string
  type?: "education" | "work" | "project" | "other" | "certification"
  href?: string
  status?: "done" | "upcoming"
  index?: number
  isFirstOfYear?: boolean
}

const typeConfig = {
  education:     { color: '#22c55e', label: 'Education' },
  work:          { color: '#ef4444', label: 'Work' },
  project:       { color: '#8b5cf6', label: 'Project' },
  certification: { color: '#f59e0b', label: 'Cert' },
  other:         { color: '#3b82f6', label: 'Other' },
}

const TimelineItem = ({
  year,
  title,
  description,
  type = "other",
  href,
  status = "done",
  index = 0,
  isFirstOfYear = false,
}: TimelineItemProps) => {
  const cfg = typeConfig[type] ?? typeConfig.other

  return (
    <motion.div
      className={`relative pl-10 last:mb-0 ${isFirstOfYear && index > 0 ? "mt-6 mb-10" : "mb-10"}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      {/* Dot */}
      <span
        className="absolute left-0 top-[5px] flex h-4 w-4 items-center justify-center rounded-full"
        style={{
          background: 'var(--dot-bg)',
          boxShadow: `0 0 0 2px ${cfg.color}`,
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: cfg.color }}
        />
      </span>

      {/* Year label */}
      {year && isFirstOfYear && (
        <span
          className="font-bold text-2xl md:text-3xl tracking-tight block"
          style={{ color: 'var(--text-primary)', letterSpacing: '-0.03em' }}
        >
          {year}
        </span>
      )}

      {/* Title + badges */}
      <h3 className="mt-2 flex flex-wrap items-center gap-2.5 text-lg font-bold md:text-xl tracking-tight">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 underline-offset-[5px] transition-colors duration-200"
            style={{
              color: 'var(--text-primary)',
              textDecorationColor: 'var(--accent-border)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent)'
              e.currentTarget.style.textDecorationColor = 'var(--accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)'
              e.currentTarget.style.textDecorationColor = 'var(--accent-border)'
            }}
          >
            {title}
          </a>
        ) : (
          <span style={{ color: 'var(--text-primary)' }}>{title}</span>
        )}

        {/* Type badge */}
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
          style={{
            color: cfg.color,
            background: `${cfg.color}15`,
            border: `1px solid ${cfg.color}30`,
          }}
        >
          {cfg.label}
        </span>

        {/* Upcoming badge */}
        {status === "upcoming" && (
          <span
            className="rounded-full px-3 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
            style={{
              background: 'rgba(34, 197, 94, 0.12)',
              color: '#16a34a',
              border: '1px solid rgba(34, 197, 94, 0.25)',
            }}
          >
            Upcoming
          </span>
        )}
      </h3>

      {/* Description */}
      {description && (
        <p
          className="mt-1.5 text-sm leading-relaxed md:text-base"
          style={{ color: 'var(--text-secondary)' }}
        >
          {description}
        </p>
      )}
    </motion.div>
  )
}

export default TimelineItem
