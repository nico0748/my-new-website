import { motion, useInView } from "framer-motion"
import { useRef } from "react"

export type TimelineEventType =
  | "education"
  | "work"
  | "project"
  | "certification"
  | "other"

interface TypeStyle {
  label: string
  color: string
  bg: string
  border: string
  shadow: string
}

const TYPE_STYLES: Record<TimelineEventType, TypeStyle> = {
  // 紺青 (konjou)
  education: {
    label: "Education",
    color: "#5d6dad",
    bg: "rgba(93, 109, 173, 0.10)",
    border: "rgba(93, 109, 173, 0.30)",
    shadow: "rgba(93, 109, 173, 0.18)",
  },
  // 藍 (ai)
  work: {
    label: "Work",
    color: "#1f4e79",
    bg: "rgba(31, 78, 121, 0.10)",
    border: "rgba(31, 78, 121, 0.30)",
    shadow: "rgba(31, 78, 121, 0.18)",
  },
  // 緋色 (hi-iro)
  project: {
    label: "Project",
    color: "#c8443c",
    bg: "rgba(200, 68, 60, 0.10)",
    border: "rgba(200, 68, 60, 0.30)",
    shadow: "rgba(200, 68, 60, 0.18)",
  },
  // 山吹 (yamabuki)
  certification: {
    label: "Certification",
    color: "#c89b3c",
    bg: "rgba(200, 155, 60, 0.12)",
    border: "rgba(200, 155, 60, 0.32)",
    shadow: "rgba(200, 155, 60, 0.20)",
  },
  // 利休鼠 (rikyu-nezumi)
  other: {
    label: "Other",
    color: "#787276",
    bg: "rgba(120, 114, 118, 0.10)",
    border: "rgba(120, 114, 118, 0.28)",
    shadow: "rgba(120, 114, 118, 0.16)",
  },
}

interface TimelineItemProps {
  month?: string
  title: string
  description?: string
  href?: string
  status?: "done" | "upcoming"
  type?: TimelineEventType
  index?: number
}

const TimelineItem = ({
  month,
  title,
  description,
  href,
  status = "done",
  type = "other",
  index = 0,
}: TimelineItemProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, {
    margin: "-30% 0px -30% 0px",
  })

  const isLeft = index % 2 === 0
  const typeStyle = TYPE_STYLES[type] ?? TYPE_STYLES.other

  const card = (
    <Card
      month={month}
      title={title}
      description={description}
      href={href}
      status={status}
      typeStyle={typeStyle}
      align={isLeft ? "right" : "left"}
      inView={inView}
    />
  )

  return (
    <div ref={ref} className="relative">
      {/* Desktop: zigzag (left/right alternating) */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-12 items-center">
        {isLeft ? (
          <>
            <div className="flex justify-end">
              <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
              >
                {card}
              </motion.div>
            </div>
            <div />
          </>
        ) : (
          <>
            <div />
            <div className="flex justify-start">
              <motion.div
                className="w-full max-w-md"
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.04 }}
              >
                {card}
              </motion.div>
            </div>
          </>
        )}
      </div>

      {/* Center node (desktop only) */}
      <div
        className="absolute top-1/2 left-1/2 hidden md:block pointer-events-none"
        style={{ transform: "translate(-50%, -50%)" }}
      >
        <Node inView={inView} typeStyle={typeStyle} />
      </div>

      {/* Mobile: single column with left line */}
      <motion.div
        className="md:hidden relative pl-12"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.5, delay: index * 0.04 }}
      >
        <div
          className="absolute top-3 -translate-x-1/2 pointer-events-none"
          style={{ left: "1rem" }}
        >
          <Node inView={inView} typeStyle={typeStyle} small />
        </div>
        <Card
          month={month}
          title={title}
          description={description}
          href={href}
          status={status}
          typeStyle={typeStyle}
          align="left"
          inView={inView}
        />
      </motion.div>
    </div>
  )
}

interface NodeProps {
  inView: boolean
  typeStyle: TypeStyle
  small?: boolean
}

const Node = ({ inView, typeStyle, small = false }: NodeProps) => {
  const size = small ? 14 : 18
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{ scale: inView ? 1.1 : 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          left: 0,
          top: 0,
        }}
        animate={{
          boxShadow: inView
            ? `0 0 0 6px ${typeStyle.bg}, 0 0 18px ${typeStyle.shadow}`
            : "0 0 0 0 transparent",
        }}
        transition={{ duration: 0.4 }}
      />
      {/* Core */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: size,
          height: size,
          left: 0,
          top: 0,
          border: `2px solid ${typeStyle.color}`,
        }}
        animate={{
          background: inView ? typeStyle.color : "var(--bg)",
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}

interface CardProps {
  month?: string
  title: string
  description?: string
  href?: string
  status?: "done" | "upcoming"
  typeStyle: TypeStyle
  align: "left" | "right"
  inView: boolean
}

const Card = ({
  month,
  title,
  description,
  href,
  status,
  typeStyle,
  align,
  inView,
}: CardProps) => {
  return (
    <motion.div
      className="relative rounded-xl px-5 py-4 overflow-hidden"
      style={{
        background: "var(--card-bg)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        border: "1px solid var(--card-border)",
      }}
      animate={{
        boxShadow: inView
          ? `0 8px 28px ${typeStyle.shadow}`
          : "0 2px 12px var(--card-shadow)",
        borderColor: inView ? typeStyle.border : "var(--card-border)",
      }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -3 }}
    >
      {/* Left accent stripe (type color) */}
      <span
        aria-hidden
        className="absolute top-0 bottom-0 left-0"
        style={{ width: 3, background: typeStyle.color }}
      />
      {/* Pointer arrow toward center line (desktop) */}
      <span
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 w-3 h-3 rotate-45 ${
          align === "right" ? "-right-1.5" : "-left-1.5"
        }`}
        style={{
          background: "var(--card-bg)",
          borderTop:
            align === "right" ? "none" : "1px solid var(--card-border)",
          borderLeft:
            align === "right" ? "none" : "1px solid var(--card-border)",
          borderRight:
            align === "right" ? "1px solid var(--card-border)" : "none",
          borderBottom:
            align === "right" ? "1px solid var(--card-border)" : "none",
        }}
      />

      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
        {month && (
          <span
            className="text-xs font-semibold tabular-nums"
            style={{
              color: typeStyle.color,
              fontFamily: "'Hina Mincho', 'Shippori Mincho B1', serif",
              letterSpacing: '0.05em',
            }}
          >
            {month}
          </span>
        )}
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide"
          style={{
            background: typeStyle.bg,
            color: typeStyle.color,
            border: `1px solid ${typeStyle.border}`,
          }}
        >
          {typeStyle.label}
        </span>
        {status === "upcoming" && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
            style={{
              background: "rgba(34, 197, 94, 0.12)",
              color: "#16a34a",
              border: "1px solid rgba(34, 197, 94, 0.25)",
            }}
          >
            Upcoming
          </span>
        )}
      </div>

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-base sm:text-lg font-bold underline-offset-4 hover:underline transition-colors duration-200 block"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--accent)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-primary)"
          }}
        >
          {title}
        </a>
      ) : (
        <h4
          className="text-base sm:text-lg font-bold"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}
        >
          {title}
        </h4>
      )}

      {description && (
        <p
          className="mt-1 text-xs sm:text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          {description}
        </p>
      )}
    </motion.div>
  )
}

export default TimelineItem
