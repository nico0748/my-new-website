import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import SakuraPetals from "../../components/ui/SakuraPetals";

interface HeroSectionProps {
  name: string;
  title: string;
  onScrollDown?: () => void;
}

const REAL_NAME = "細澤 悠真";

const HeroSection = ({ name, title, onScrollDown }: HeroSectionProps) => {
  const [searchParams] = useSearchParams();
  const isReal = searchParams.get("id") === "real";
  const displayName = isReal ? REAL_NAME : name || "Portfolio";
  return (
    <section className="relative h-screen min-h-[640px] flex flex-col items-center justify-center overflow-hidden px-4">
      {/* 桜吹雪 — 背景にゆっくり舞い落ちる */}
      <SakuraPetals count={14} />

      {/* 装飾SVG — 月 + 雲 + 鳥居（極薄） */}
      <motion.div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.6 }}
      >
        <svg
          viewBox="0 0 800 800"
          className="w-[90vmin] h-[90vmin]"
          style={{ color: 'var(--accent-fox)' }}
        >
          {/* 月（満月） */}
          <motion.circle
            cx="400"
            cy="290"
            r="160"
            fill="currentColor"
            fillOpacity="0.06"
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
          />
          <circle
            cx="400"
            cy="290"
            r="160"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
          {/* 雲（横一文字） */}
          <path
            d="M 60 360 Q 200 340 320 360 T 540 360 T 740 360"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 100 400 Q 220 384 340 400 T 560 400 T 720 400"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.07"
            strokeWidth="1"
            strokeLinecap="round"
          />
          {/* 鳥居（torii）シルエット */}
          <g stroke="var(--seal-red)" strokeOpacity="0.18" fill="var(--seal-red)" fillOpacity="0.08">
            {/* 笠木（上の梁） */}
            <path d="M 270 500 Q 400 470 530 500 L 540 514 Q 400 484 260 514 Z" />
            {/* 島木 */}
            <rect x="278" y="520" width="244" height="10" />
            {/* 貫（中央の横棒） */}
            <rect x="298" y="560" width="204" height="7" />
            {/* 左柱 */}
            <rect x="306" y="514" width="14" height="200" />
            {/* 右柱 */}
            <rect x="480" y="514" width="14" height="200" />
            {/* 額束（中央の小さな板） */}
            <rect x="392" y="534" width="16" height="22" />
          </g>
        </svg>
      </motion.div>

      {/* コピー */}
      <div className="relative z-10 text-center max-w-3xl">
        <motion.div
          className="inline-flex items-center gap-3 mb-6 text-[11px] tracking-[0.5em] uppercase"
          style={{
            color: "var(--accent)",
            fontFamily: "'Hina Mincho', 'Shippori Mincho B1', serif",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span
            className="h-px w-10"
            style={{ background: "var(--accent-border)" }}
          />
          <span>welcome</span>
          <span
            className="h-px w-10"
            style={{ background: "var(--accent-border)" }}
          />
        </motion.div>

        <motion.h1
          className="text-6xl sm:text-7xl md:text-8xl font-bold"
          style={{
            color: "var(--text-primary)",
            letterSpacing: "0.06em",
            fontFamily: "'Hina Mincho', 'Shippori Mincho B1', serif",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={displayName}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block"
            >
              {displayName}
            </motion.span>
          </AnimatePresence>
        </motion.h1>

        {/* 朱の細線 */}
        <motion.div
          className="flex items-center justify-center gap-2 mt-6"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          <span
            className="h-px"
            style={{ width: 80, background: "var(--accent)" }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--seal-red)" }}
          />
          <span
            className="h-px"
            style={{ width: 80, background: "var(--accent)" }}
          />
        </motion.div>

        <motion.p
          className="mt-6 text-lg sm:text-xl md:text-2xl"
          style={{
            color: "var(--text-secondary)",
            fontFamily: "'Shippori Mincho B1', 'Noto Serif JP', serif",
            letterSpacing: "0.1em",
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
        >
          {title}
        </motion.p>
      </div>

      {/* スクロール誘導ボタン */}
      <motion.button
        type="button"
        onClick={onScrollDown}
        className="absolute bottom-12 z-10 rounded-full p-3 transition-all duration-200 hover:scale-105"
        style={{
          background: "var(--card-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid var(--accent-border)",
          color: "var(--accent)",
          boxShadow: "0 4px 16px var(--accent-shadow)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        aria-label="次のセクションへスクロール"
      >
        <motion.svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </motion.svg>
      </motion.button>
    </section>
  );
};

export default HeroSection;
