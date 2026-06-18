import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import TerminalParticles from "../../components/ui/TerminalParticles";

interface HeroSectionProps {
  name: string;
  title: string;
  onScrollDown?: () => void;
}

const REAL_NAME = "細澤 悠真";

/** 1文字ずつ表示するタイプライター。text が変わると打ち直す。 */
const useTypewriter = (text: string, speed = 90, startDelay = 400) => {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const start = setTimeout(function tick() {
      setOut(text.slice(0, i + 1));
      i += 1;
      if (i < text.length) timer = setTimeout(tick, speed);
    }, startDelay);
    return () => {
      clearTimeout(start);
      clearTimeout(timer);
    };
  }, [text, speed, startDelay]);
  return out;
};

const HeroSection = ({ name, title, onScrollDown }: HeroSectionProps) => {
  const [searchParams] = useSearchParams();
  const isReal = searchParams.get("id") === "real";
  const displayName = isReal ? REAL_NAME : name || "Portfolio";
  const typedName = useTypewriter(displayName, 95, 500);
  const nameDone = typedName.length === displayName.length;

  return (
    <section className="relative h-screen min-h-[640px] flex flex-col items-center justify-center overflow-hidden px-4">
      {/* 降るグリフ — 背景にゆっくり落ちる */}
      <TerminalParticles count={18} />

      {/* ターミナルウィンドウ */}
      <motion.div
        className="relative z-10 w-full max-w-2xl rounded-lg overflow-hidden"
        style={{
          background: "var(--card-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid var(--card-border)",
          boxShadow: "0 8px 40px var(--card-shadow), 0 0 60px var(--accent-shadow)",
          fontFamily: "'JetBrains Mono', monospace",
        }}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* タイトルバー */}
        <div
          className="flex items-center gap-2 px-4 py-2.5"
          style={{ borderBottom: "1px solid var(--border-color)", background: "var(--surface)" }}
        >
          <span className="w-3 h-3 rounded-full" style={{ background: "#ff5f56" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#ffbd2e" }} />
          <span className="w-3 h-3 rounded-full" style={{ background: "#27c93f" }} />
          <span
            className="ml-3 text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            bash — portfolio — 80×24
          </span>
        </div>

        {/* ターミナル本文 */}
        <div className="px-5 py-6 sm:px-8 sm:py-8 text-left leading-relaxed">
          {/* whoami */}
          <p className="text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
            <span style={{ color: "var(--accent)" }}>visitor@portfolio</span>
            <span style={{ color: "var(--text-muted)" }}>:</span>
            <span style={{ color: "var(--accent-gold)" }}>~</span>
            <span style={{ color: "var(--text-muted)" }}>$ </span>
            whoami
          </p>

          <h1
            className="my-2 text-3xl sm:text-5xl md:text-6xl font-bold break-words"
            style={{ color: "var(--text-primary)", letterSpacing: "0.02em" }}
          >
            {typedName}
            {!nameDone && (
              <span className="terminal-cursor" style={{ color: "var(--accent)" }}>
                _
              </span>
            )}
          </h1>

          {/* role */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: nameDone ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="mt-4 text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--accent)" }}>visitor@portfolio</span>
              <span style={{ color: "var(--text-muted)" }}>:</span>
              <span style={{ color: "var(--accent-gold)" }}>~</span>
              <span style={{ color: "var(--text-muted)" }}>$ </span>
              cat role.txt
            </p>
            <p
              className="mt-1 text-base sm:text-xl md:text-2xl"
              style={{ color: "var(--accent)" }}
            >
              {title}
              <span className="terminal-cursor ml-0.5">_</span>
            </p>
          </motion.div>
        </div>
      </motion.div>

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
