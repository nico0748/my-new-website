import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import TerminalBackground from "../components/ui/TerminalBackground";
import TopicCard from "../components/ui/TopicCard";
import { getTopicCategoryStyle } from "../lib/topicCategories";
import { splitByRecency } from "../lib/recentWindow";
import { fetchSheetData } from "../lib/googleSheets";
import { mapTopicData } from "../lib/dataMapper";
import type { TopicItem } from "../lib/dataMapper";
import type { SheetRow } from "../lib/googleSheets";

// 表示チューニング（直近ウィンドウ日数 / 最低表示件数 / 1回の表示増分）
const RECENT_DAYS = 14;
const MIN_RECENT = 12;
const PAGE_SIZE = 24;

const TopicsPage = () => {
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showArchive, setShowArchive] = useState(false); // 過去分も表示するか
  const [limit, setLimit] = useState(PAGE_SIZE);          // 段階的な表示件数

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

  // カテゴリ絞り込み（全件に対して）
  const filtered = useMemo(
    () =>
      activeCategory === "all"
        ? topics
        : topics.filter((t) => t.category.trim().toLowerCase() === activeCategory),
    [topics, activeCategory]
  );

  // 直近ウィンドウと過去分に分割（同期の無い日でも最低 MIN_RECENT 件は出る）
  const { recent, archived } = useMemo(
    () => splitByRecency(filtered, { days: RECENT_DAYS, minRecent: MIN_RECENT }),
    [filtered]
  );

  // 表示プール（過去分トグルで全件へ切替）と、段階表示の可視スライス
  const pool = showArchive ? filtered : recent;
  const visible = pool.slice(0, limit);
  const hasMore = pool.length > limit;

  // カテゴリ／過去分トグルが変わったら表示件数をリセット
  useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [activeCategory, showArchive]);

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

          {/* 表示状況の注記 */}
          {filtered.length > 0 && (
            <p
              className="text-center text-xs mb-6"
              style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}
            >
              {showArchive
                ? `全 ${filtered.length} 件中 ${visible.length} 件を表示`
                : `直近 ${RECENT_DAYS} 日の ${recent.length} 件中 ${visible.length} 件を表示`}
              {!showArchive && archived.length > 0 && `（過去 ${archived.length} 件は非表示）`}
            </p>
          )}

          {/* Topic Grid */}
          {filtered.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visible.map((item) => (
                  <TopicCard key={item.id} item={item} />
                ))}
              </div>

              {/* 表示コントロール */}
              <div className="flex flex-col items-center gap-3 mt-10">
                {hasMore && (
                  <button
                    onClick={() => setLimit((n) => n + PAGE_SIZE)}
                    className="px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
                    style={{
                      background: "var(--card-bg)",
                      color: "var(--accent)",
                      border: "1px solid var(--accent-border)",
                      boxShadow: "0 2px 12px var(--accent-shadow)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    もっと見る（残り {pool.length - visible.length} 件）
                  </button>
                )}
                {!showArchive && archived.length > 0 && (
                  <button
                    onClick={() => setShowArchive(true)}
                    className="text-sm transition-colors duration-200 hover:opacity-90"
                    style={{
                      color: "var(--text-secondary)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    過去の記事も表示する（+{archived.length} 件） ↓
                  </button>
                )}
                {showArchive && (
                  <button
                    onClick={() => setShowArchive(false)}
                    className="text-sm transition-colors duration-200 hover:opacity-90"
                    style={{
                      color: "var(--text-secondary)",
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    直近 {RECENT_DAYS} 日だけに戻す ↑
                  </button>
                )}
              </div>
            </>
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
