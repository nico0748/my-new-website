import { motion } from "framer-motion"

interface TimelineItemProps {
  month?: string
  title: string
  description?: string
  href?: string
  status?: "done" | "upcoming"
  index?: number
}

const TimelineItem = ({
  month,
  title,
  description,
  href,
  status = "done",
  index = 0,
}: TimelineItemProps) => {
  return (
    <motion.div
      className="grid grid-cols-[5.5rem_1fr] sm:grid-cols-[7rem_1fr] gap-3 sm:gap-4 items-baseline px-4 py-3 rounded-lg"
      style={{ background: 'var(--card-bg)' }}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
    >
      <span
        className="text-xs sm:text-sm font-medium tabular-nums"
        style={{ color: 'var(--text-muted)' }}
      >
        {month ?? ''}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-2">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm sm:text-base font-medium underline-offset-4 hover:underline transition-colors duration-200"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
            >
              {title}
            </a>
          ) : (
            <span
              className="text-sm sm:text-base font-medium"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </span>
          )}

          {status === "upcoming" && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
              style={{
                background: 'rgba(34, 197, 94, 0.12)',
                color: '#16a34a',
                border: '1px solid rgba(34, 197, 94, 0.25)',
              }}
            >
              Upcoming
            </span>
          )}
        </div>

        {description && (
          <p
            className="mt-0.5 text-xs sm:text-sm leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            {description}
          </p>
        )}
      </div>
    </motion.div>
  )
}

export default TimelineItem
