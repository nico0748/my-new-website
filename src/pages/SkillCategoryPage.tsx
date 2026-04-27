import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import GraphPaperBackground from "../components/ui/GraphPaperBackground";
import ThemeToggle from "../components/ui/ThemeToggle";
import CornerMarks from "../components/ui/CornerMarks";
import { fetchSheetData } from "../lib/googleSheets";
import { mapSkillsData, mapPortfolioData } from "../lib/dataMapper";
import type { SkillCategory, Skill, PortfolioItem } from "../lib/dataMapper";
import type { SheetRow } from "../lib/googleSheets";

const levelLabels: Record<number, { label: string; color: string; desc: string }> = {
  1: { label: "Introductory", color: "#94a3b8", desc: "基本概念を理解し、参照しながら作業できる" },
  2: { label: "Beginner", color: "#64748b", desc: "小規模なタスクを遂行できる" },
  3: { label: "Intermediate", color: "#f59e0b", desc: "一般的な業務を自力でこなせる" },
  4: { label: "Advanced", color: "#22c55e", desc: "複雑な課題にも対応し、設計判断を主導できる" },
  5: { label: "Expert", color: "#b03eb6ff", desc: "高度な設計・最適化に取り組める" },
};

const SkillCategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const decodedCategory = decodeURIComponent(category ?? "");

  const [allCategories, setAllCategories] = useState<SkillCategory[]>([]);
  const [currentCategory, setCurrentCategory] = useState<SkillCategory | null>(
    null
  );
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!import.meta.env.VITE_GOOGLE_SHEETS_API_KEY) {
        setLoading(false);
        return;
      }
      try {
        const [skillRows, projectRows] = await Promise.all([
          fetchSheetData<SheetRow>("Skills"),
          fetchSheetData<SheetRow>("Projects"),
        ]);
        const cats = mapSkillsData(skillRows);
        setAllCategories(cats);
        setCurrentCategory(
          cats.find((c) => c.category === decodedCategory) ?? null
        );
        if (projectRows.length > 0) setProjects(mapPortfolioData(projectRows));
      } catch {
        // fallback
      }
      setLoading(false);
    };
    load();
  }, [decodedCategory]);

  const findRelatedProjects = (skill: Skill): PortfolioItem[] => {
    const skillLower = skill.name.toLowerCase();
    return projects.filter((p) =>
      p.tags.some((t) => t.toLowerCase() === skillLower)
    );
  };

  if (loading) {
    return (
      <GraphPaperBackground>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="w-10 h-10 rounded-full border-2 border-t-transparent"
            style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </GraphPaperBackground>
    );
  }

  if (!currentCategory) {
    return (
      <GraphPaperBackground>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <p className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
            カテゴリが見つかりません
          </p>
          <Link
            to="/skills"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--accent)" }}
          >
            ← スキル一覧に戻る
          </Link>
        </div>
      </GraphPaperBackground>
    );
  }

  const sortedSkills = [...currentCategory.skills].sort(
    (a, b) => b.level - a.level
  );

  const avgLevel =
    currentCategory.skills.reduce((s, sk) => s + sk.level, 0) /
    currentCategory.skills.length;

  return (
    <GraphPaperBackground>
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
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <button
              onClick={() => navigate("/skills")}
              className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
              style={{ color: "var(--text-secondary)" }}
            >
              <span>←</span>
              <span>Skills</span>
            </button>

            <div className="flex items-center gap-3">
              {/* Category tabs */}
              <nav className="hidden md:flex gap-1 overflow-x-auto">
                {allCategories.map((cat) => (
                  <Link
                    key={cat.category}
                    to={`/skills/${encodeURIComponent(cat.category)}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap"
                    style={{
                      color:
                        cat.category === decodedCategory ? "var(--accent)" : "var(--text-secondary)",
                      background:
                        cat.category === decodedCategory
                          ? "var(--accent-bg)"
                          : "transparent",
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                  >
                    {cat.category}
                  </Link>
                ))}
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="h-16 sm:h-20" />

        <main className="max-w-5xl mx-auto px-4 py-12">
          {/* Hero */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className="text-xs font-semibold tracking-[0.3em] uppercase mb-3"
              style={{
                color: "var(--accent)",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            >
              // スキルカテゴリ
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
            >
              {decodedCategory}
            </h1>

            {/* Summary bar */}
            <div className="flex flex-wrap items-center gap-4 mt-6">
              {[
                { label: "スキル数", value: currentCategory.skills.length },
                { label: "平均レベル", value: avgLevel.toFixed(1) + "/5" },
                {
                  label: "最高レベル",
                  value:
                    Math.max(...currentCategory.skills.map((s) => s.level)) +
                    "/5",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <span
                    className="text-sm font-bold"
                    style={{ color: "var(--accent)" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-xs font-medium"
                    style={{
                      color: "var(--text-muted)",
                      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Level Legend (compact) */}
          <motion.div
            className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 px-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
          >
            <span
              className="text-[10px] font-semibold tracking-[0.2em] uppercase"
              style={{
                color: "var(--text-muted)",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            >
              レベル基準:
            </span>
            {[1, 2, 3, 4, 5].map((lv) => {
              const l = levelLabels[lv];
              return (
                <div key={lv} className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background:
                            i < lv ? l.color : "var(--skill-bar-empty)",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-[11px] font-medium"
                    style={{ color: l.color }}
                  >
                    {l.label}
                  </span>
                </div>
              );
            })}
          </motion.div>

          {/* Skill Cards */}
          <div className="space-y-5">
            {sortedSkills.map((skill, i) => {
              const related = findRelatedProjects(skill);
              const lvl = levelLabels[skill.level] ?? levelLabels[1];

              return (
                <motion.div
                  key={skill.name}
                  className="relative rounded-2xl p-6"
                  style={{
                    background: "var(--card-bg)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    border: "1px solid var(--card-border)",
                    boxShadow: "0 4px 20px var(--card-shadow)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                >
                  <CornerMarks size={8} offset={-4} />

                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Left: Skill info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          className="text-lg font-bold tracking-tight"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {skill.name}
                        </h3>
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            color: lvl.color,
                            background: `${lvl.color}15`,
                            border: `1px solid ${lvl.color}30`,
                          }}
                        >
                          {lvl.label}
                        </span>
                        {skill.experienceYears && (
                          <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{
                              background: "var(--skill-bar-empty)",
                              color: "var(--text-secondary)",
                              fontFamily:
                                "'JetBrains Mono', 'Fira Code', monospace",
                            }}
                          >
                            {skill.experienceYears}年
                          </span>
                        )}
                      </div>

                      {/* Level bar */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex gap-1 flex-1 max-w-xs">
                          {[...Array(5)].map((_, li) => (
                            <div
                              key={li}
                              className="h-2 flex-1 rounded-full"
                              style={{
                                background:
                                  li < skill.level
                                    ? lvl.color
                                    : "var(--skill-bar-empty)",
                              }}
                            />
                          ))}
                        </div>
                        <span
                          className="text-xs font-medium w-8 text-right"
                          style={{
                            color: "var(--text-muted)",
                            fontFamily:
                              "'JetBrains Mono', 'Fira Code', monospace",
                          }}
                        >
                          {skill.level}/5
                        </span>
                      </div>

                      {/* Description */}
                      {skill.description && (
                        <p
                          className="text-sm leading-relaxed mb-3"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {skill.description}
                        </p>
                      )}

                      {/* Libraries / Frameworks */}
                      {skill.libraries && skill.libraries.length > 0 && (
                        <div className="mb-3">
                          <div
                            className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-2"
                            style={{
                              color: "var(--text-muted)",
                              fontFamily:
                                "'JetBrains Mono', 'Fira Code', monospace",
                            }}
                          >
                            ライブラリ / フレームワーク
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {skill.libraries.map((lib) => (
                              <span
                                key={lib}
                                className="text-xs font-medium px-2.5 py-1 rounded-lg"
                                style={{
                                  background: "var(--skill-bar-empty)",
                                  color: "var(--text-body)",
                                  border: "1px solid var(--border-color)",
                                }}
                              >
                                {lib}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Proficiency Comment */}
                      {skill.comment && (
                        <div
                          className="rounded-lg px-4 py-3 mb-3"
                          style={{
                            background: "var(--blockquote-bg)",
                            borderLeft: `3px solid ${lvl.color}`,
                          }}
                        >
                          <div
                            className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1"
                            style={{
                              color: "var(--text-muted)",
                              fontFamily:
                                "'JetBrains Mono', 'Fira Code', monospace",
                            }}
                          >
                            熟練度コメント
                          </div>
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: "var(--text-body)" }}
                          >
                            {skill.comment}
                          </p>
                        </div>
                      )}

                      {/* Related Projects */}
                      {related.length > 0 && (
                        <div>
                          <div
                            className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-2"
                            style={{
                              color: "var(--text-muted)",
                              fontFamily:
                                "'JetBrains Mono', 'Fira Code', monospace",
                            }}
                          >
                            関連プロジェクト
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {related.map((proj) => (
                              <Link
                                key={proj.id}
                                to={`/projects/${proj.id}`}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                                style={{
                                  background: "var(--accent-bg)",
                                  color: "var(--text-body)",
                                  border: "1px solid var(--accent-border)",
                                }}
                              >
                                {proj.thumbnail && (
                                  <img
                                    src={proj.thumbnail}
                                    alt=""
                                    className="w-4 h-4 rounded object-cover"
                                  />
                                )}
                                <span>{proj.title}</span>
                                <span style={{ color: "var(--accent)" }}>
                                  →
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Visual level indicator */}
                    <div className="hidden sm:flex flex-col items-center justify-center w-20 flex-shrink-0">
                      <svg width="64" height="64" viewBox="0 0 64 64">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke="var(--skill-bar-empty)"
                          strokeWidth="4"
                        />
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          fill="none"
                          stroke={lvl.color}
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={`${(skill.level / 5) * 175.9} 175.9`}
                          transform="rotate(-90 32 32)"
                          style={{ transition: "stroke-dasharray 0.6s ease" }}
                        />
                        <text
                          x="32"
                          y="36"
                          textAnchor="middle"
                          fill={lvl.color}
                          fontSize="16"
                          fontWeight="700"
                          fontFamily="'JetBrains Mono', 'Fira Code', monospace"
                        >
                          {skill.level}
                        </text>
                      </svg>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation between categories */}
          <div className="flex items-center justify-between mt-16">
            {(() => {
              const idx = allCategories.findIndex(
                (c) => c.category === decodedCategory
              );
              const prev = idx > 0 ? allCategories[idx - 1] : null;
              const next =
                idx < allCategories.length - 1 ? allCategories[idx + 1] : null;
              return (
                <>
                  {prev ? (
                    <Link
                      to={`/skills/${encodeURIComponent(prev.category)}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                      style={{
                        background: "var(--card-bg)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <span>←</span>
                      <span>{prev.category}</span>
                    </Link>
                  ) : (
                    <div />
                  )}
                  {next ? (
                    <Link
                      to={`/skills/${encodeURIComponent(next.category)}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                      style={{
                        background: "var(--card-bg)",
                        color: "var(--text-secondary)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <span>{next.category}</span>
                      <span>→</span>
                    </Link>
                  ) : (
                    <div />
                  )}
                </>
              );
            })()}
          </div>
        </main>

        {/* Footer */}
        <footer
          className="text-center py-10 mt-20"
          style={{
            borderTop: "1px solid var(--border-color)",
            background: "var(--footer-bg)",
          }}
        >
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} NICOLABO -にこラボ-. All Rights
            Reserved.
          </p>
        </footer>
      </div>
    </GraphPaperBackground>
  );
};

export default SkillCategoryPage;
