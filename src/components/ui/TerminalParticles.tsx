import { useMemo } from "react";
import { motion } from "framer-motion";

interface TerminalParticlesProps {
  count?: number;
}

// ターミナルを思わせるグリフ群
const GLYPHS = ["0", "1", "{", "}", ";", "/", ">", "$", "_", "<", "*", "=", "+", "#"];

/**
 * 降るグリフ — Hero 背景にゆっくり落ちる等幅文字。
 * 各グリフは独立した速度・横揺れ・点滅で循環する（旧 SakuraPetals の後継）。
 */
const TerminalParticles = ({ count = 18 }: TerminalParticlesProps) => {
  const glyphs = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        startX: (i * 100) / count + (Math.random() * 8 - 4),
        delay: Math.random() * 14,
        duration: 12 + Math.random() * 12,    // 12〜24秒
        size: 12 + Math.random() * 8,         // 12〜20px
        sway: 20 + Math.random() * 40,
        char: GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
        peakOpacity: 0.18 + Math.random() * 0.22, // 0.18〜0.40
      })),
    [count]
  );

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {glyphs.map((g) => (
        <motion.span
          key={g.id}
          className="absolute will-change-transform"
          style={{
            left: `${g.startX}%`,
            top: "-8%",
            fontSize: g.size,
            fontFamily: "'JetBrains Mono', monospace",
            color: "var(--accent)",
            textShadow: "0 0 8px var(--accent)",
          }}
          initial={{ y: 0, x: 0, opacity: 0 }}
          animate={{
            y: ["0vh", "112vh"],
            x: [0, g.sway, -g.sway * 0.6, g.sway * 0.3, 0],
            opacity: [0, g.peakOpacity, g.peakOpacity, 0],
          }}
          transition={{
            duration: g.duration,
            delay: g.delay,
            repeat: Infinity,
            ease: "linear",
            opacity: {
              duration: g.duration,
              delay: g.delay,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.12, 0.88, 1],
            },
            x: {
              duration: g.duration,
              delay: g.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {g.char}
        </motion.span>
      ))}
    </div>
  );
};

export default TerminalParticles;
