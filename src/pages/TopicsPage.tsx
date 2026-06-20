import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import TerminalBackground from "../components/ui/TerminalBackground";
import TopicCard from "../components/ui/TopicCard";
import { getTopicCategoryStyle } from "../lib/topicCategories";
import { fetchSheetData } from "../lib/googleSheets";
import { mapTopicData } from "../lib/dataMapper";
import type { TopicItem } from "../lib/dataMapper";
import type { SheetRow } from "../lib/googleSheets";

const TopicsPage = () => {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  useEffect(() => {
    const load = async () => {
      if (!import.meta.env.VITE_GOOGLE_SHEETS_API_KEY) {
        setLoading(false);
        return;
      }
      try {
        const rows = await fetchSheetData<SheetRow>("Topics");
        if (rows.length > 0) setTopics(mapTopicData(rows));
      } catch {
        // fallback
      }
      setLoading(false);
    };
    load();
  }, []);

  // 出現するカテゴリ一覧（フィルタタブ用）
  const categories = useMemo(() => {
    const set = new Set(topics.map((t) => t.category.trim().toLowerCase()));
    return Array.from(set);
  }, [topics]);

  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? topics
        : topics.filter((t) => t.category.trim().toLowerCase() === activeCategory),
    [topics, activeCategory]
  );

  if (loading) {
    return (
      <TerminalBackground>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="w-10 h-10 rounded-full border-2 border-t-transparent"
            style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </TerminalBackground>
    );
  }

  return (
    <TerminalBackground>
      <div className="font-sans antialiased min-h-screen">
        {/* Header */}
        <header
          className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
          style={{
            background: "var(--header-bg)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>←</span>
              <span>Portfolio</span>
            </Link>
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-semibold tracking-[0.3em] uppercase"
                style={{
                  color: "var(--accent)",
                  fontFamily: "'JetBrains Mono', 'Noto Sans JP', monospace",
                }}
              >
                Topics
              </span>
            </div>
          </div>
        </header>

        <div className="h-16 sm:h-20" />

        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* Hero */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="text-xs font-semibold tracking-[0.2em] mb-3"
              style={{
                color: "var(--accent)",
                fontFamily: "'JetBrains Mono', 'Noto Sans JP', monospace",
              }}
            >
              <span style={{ color: "var(--accent)" }}>~/</span>topics
              <span style={{ color: "var(--text-secondary)" }}> ❯</span>
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
              style={{
                color: "var(--text-primary)",
                letterSpacing: "-0.02em",
                fontFamily: "'JetBrains Mono', 'Noto Sans JP', monospace",
              }}
            >
              Topics
            </h1>
            <p
              className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              セキュリティニュース・CVE分析・脆弱性解説をまとめています。
            </p>
          </motion.div>

          {/* カテゴリフィルタ */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {["all", ...categories].map((c) => {
                const isActive = activeCategory === c;
                const label = c === "all" ? "All" : getTopicCategoryStyle(c).label;
                return (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    className="px-3 py-1.5 rounded text-sm transition-all duration-200"
                    style={{
                      color: isActive ? "var(--accent)" : "var(--text-secondary)",
                      background: isActive ? "var(--accent-bg)" : "transparent",
                      border: `1px solid ${isActive ? "var(--accent-border)" : "var(--border-color)"}`,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Topic Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <TopicCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p
              className="text-center py-12 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              トピックがありません（Google Sheets の「Topics」シートを設定してください）
            </p>
          )}
        </main>

        {/* Footer */}
        <footer
          className="text-center py-10 mt-20"
          style={{
            borderTop: "1px solid var(--border-color)",
            background: "var(--footer-bg)",
          }}
        >
          <p
            className="text-sm"
            style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span style={{ color: "var(--accent)" }}>$</span> echo &copy;{" "}
            {new Date().getFullYear()} NICOLABO -にこラボ-. All Rights Reserved.
          </p>
        </footer>
      </div>
    </TerminalBackground>
  );
};

export default TopicsPage;
