import { useMemo } from "react";
import { motion } from "framer-motion";

interface SakuraPetalsProps {
  count?: number;
}

// 和の伝統色から薄桜系をピックアップ
const SAKURA_COLORS = [
  "#fdeff2", // 桜色
  "#f5c4c8", // 桃色
  "#e8b4ba", // 退紅
  "#fbd9dc", // 灰桜
];

// 桜花弁の輪郭（先端に切れ込み付き）
const PETAL_PATH =
  "M 0 -10 C 4.5 -6 5 -2 4.5 2 C 4 5 2 7 0 9 C -2 7 -4 5 -4.5 2 C -5 -2 -4.5 -6 0 -10 Z M 0 -10 L -1 -8 L 1 -8 Z";

/**
 * 桜吹雪 — Hero 背景にゆっくり舞い落ちる花びら。
 * 各花弁は独立した速度・揺れ幅・回転で循環する。
 */
const SakuraPetals = ({ count = 14 }: SakuraPetalsProps) => {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        startX: (i * 100) / count + (Math.random() * 10 - 5), // 横方向に均等＋ジッター
        delay: Math.random() * 14,             // 初期発生のばらつき
        duration: 14 + Math.random() * 12,     // 14〜26秒
        size: 10 + Math.random() * 9,          // 10〜19px
        sway: 40 + Math.random() * 50,         // 横揺れ幅
        rotateStart: Math.random() * 360,
        rotateAmount: 360 + Math.random() * 540, // 1〜2.5回転
        color: SAKURA_COLORS[i % SAKURA_COLORS.length],
        peakOpacity: 0.4 + Math.random() * 0.25, // 0.4〜0.65
      })),
    [count]
  );

  return (
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none overflow-hidden"
    >
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute will-change-transform"
          style={{
            left: `${p.startX}%`,
            top: "-12%",
            width: p.size,
            height: p.size,
          }}
          initial={{ y: 0, x: 0, rotate: p.rotateStart, opacity: 0 }}
          animate={{
            y: ["0vh", "115vh"],
            x: [0, p.sway, -p.sway * 0.7, p.sway * 0.4, 0],
            rotate: [p.rotateStart, p.rotateStart + p.rotateAmount],
            opacity: [0, p.peakOpacity, p.peakOpacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
            opacity: {
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
              times: [0, 0.12, 0.88, 1],
            },
            x: {
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <svg
            viewBox="-10 -12 20 24"
            width="100%"
            height="100%"
            style={{ overflow: "visible" }}
          >
            <path
              d={PETAL_PATH}
              fill={p.color}
              fillOpacity={0.85}
              stroke="#c8443c"
              strokeOpacity={0.18}
              strokeWidth={0.4}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default SakuraPetals;
