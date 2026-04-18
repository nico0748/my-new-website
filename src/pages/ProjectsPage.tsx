import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import GraphPaperBackground from "../components/ui/GraphPaperBackground";
import ProjectCard from "../components/ui/ProjectCard";
import { fetchSheetData } from "../lib/googleSheets";
import { mapPortfolioData } from "../lib/dataMapper";
import type { PortfolioItem } from "../lib/dataMapper";
import type { SheetRow } from "../lib/googleSheets";

const ProjectsPage = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!import.meta.env.VITE_GOOGLE_SHEETS_API_KEY) {
        setLoading(false);
        return;
      }
      try {
        const rows = await fetchSheetData<SheetRow>("Projects");
        if (rows.length > 0) setPortfolio(mapPortfolioData(rows));
      } catch {
        // fallback
      }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <GraphPaperBackground>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="w-10 h-10 rounded-full border-2 border-t-transparent"
            style={{ borderColor: "#2563eb", borderTopColor: "transparent" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </GraphPaperBackground>
    );
  }

  return (
    <GraphPaperBackground>
      <div className="font-sans antialiased min-h-screen">
        {/* Header */}
        <header
          className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
          style={{
            background: "rgba(244, 246, 251, 0.85)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(99, 152, 219, 0.2)",
          }}
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:text-blue-600"
              style={{ color: "#64748b" }}
            >
              <span>←</span>
              <span>Portfolio</span>
            </Link>
            <span
              className="text-xs font-semibold tracking-[0.3em] uppercase"
              style={{
                color: "#2563eb",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            >
              // Projects
            </span>
          </div>
        </header>

        <div className="h-16 sm:h-20" />

        <main className="max-w-7xl mx-auto px-4 py-12">
          {/* Hero */}
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="text-xs font-semibold tracking-[0.3em] uppercase mb-3"
              style={{
                color: "#2563eb",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            >
              // All Works
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
              style={{ color: "#1e293b", letterSpacing: "-0.03em" }}
            >
              Projects
            </h1>
            <p
              className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: "#64748b" }}
            >
              これまでに取り組んだプロジェクトの一覧です。
              各プロジェクトをクリックすると詳細を確認できます。
            </p>
          </motion.div>

          {/* Project Grid */}
          {portfolio.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((item) => (
                <ProjectCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p
              className="text-center py-12 text-sm"
              style={{ color: "#94a3b8" }}
            >
              プロジェクトデータがありません（Google Sheets を設定してください）
            </p>
          )}
        </main>

        {/* Footer */}
        <footer
          className="text-center py-10 mt-20"
          style={{
            borderTop: "1px solid rgba(99, 152, 219, 0.2)",
            background: "rgba(244, 246, 251, 0.6)",
          }}
        >
          <p className="text-sm" style={{ color: "#94a3b8" }}>
            &copy; {new Date().getFullYear()} NICOLABO -にこラボ-. All Rights
            Reserved.
          </p>
        </footer>
      </div>
    </GraphPaperBackground>
  );
};

export default ProjectsPage;
