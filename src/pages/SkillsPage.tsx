import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import GraphPaperBackground from "../components/ui/GraphPaperBackground";
import ThemeToggle from "../components/ui/ThemeToggle";
import CornerMarks from "../components/ui/CornerMarks";
import { fetchSheetData } from "../lib/googleSheets";
import { mapSkillsData, mapPortfolioData } from "../lib/dataMapper";
import type { SkillCategory, Skill, PortfolioItem } from "../lib/dataMapper";
import type { SheetRow } from "../lib/googleSheets";

const categoryColors: Record<string, string> = {
  Frontend: "#2563eb",
  Backend: "#22c55e",
  Infrastructure: "#f59e0b",
  DevOps: "#8b5cf6",
  Database: "#ef4444",
  Mobile: "#06b6d4",
  Design: "#ec4899",
  Other: "#64748b",
};

const levelLabels: Record<number, { label: string; color: string }> = {
  1: { label: "Introductory", color: "#94a3b8" },
  2: { label: "Beginner", color: "#64748b" },
  3: { label: "Intermediate", color: "#f59e0b" },
  4: { label: "Advanced", color: "#22c55e" },
  5: { label: "Expert", color: "#b03eb6" },
};

const SkillsPage = () => {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [projects, setProjects] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<{
    categoryIndex: number;
    skillIndex: number;
  } | null>(null);

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
        if (skillRows.length > 0) setSkills(mapSkillsData(skillRows));
        if (projectRows.length > 0) setProjects(mapPortfolioData(projectRows));
      } catch {
        // fallback
      }
      setLoading(false);
    };
    load();
  }, []);

  const findRelatedProjects = (skill: Skill): PortfolioItem[] => {
    const skillLower = skill.name.toLowerCase();
    return projects.filter((p) =>
      p.tags.some((t) => t.toLowerCase() === skillLower)
    );
  };

  const isSelected = (catIdx: number, skillIdx: number) =>
    selectedSkill?.categoryIndex === catIdx &&
    selectedSkill?.skillIndex === skillIdx;

  const toggleSkill = (catIdx: number, skillIdx: number) => {
    if (isSelected(catIdx, skillIdx)) {
      setSelectedSkill(null);
    } else {
      setSelectedSkill({ categoryIndex: catIdx, skillIndex: skillIdx });
    }
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
                  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
              >
                // Skills
              </span>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="h-16 sm:h-20" />

        <main className="max-w-5xl mx-auto px-4 py-12">
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
                color: "var(--accent)",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            >
              // Tech Stack
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold tracking-tight mb-4"
              style={{ color: "var(--text-primary)", letterSpacing: "-0.03em" }}
            >
              技術スタック
            </h1>
            <p
              className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              これまでに使用した技術・ツールの一覧です。
              各スキルをクリックすると、使用経験の詳細を確認できます。
            </p>
          </motion.div>

          {/* Category Rows */}
          <div className="space-y-6">
            {skills.map((cat, catIdx) => {
              const catColor =
                categoryColors[cat.category] ?? categoryColors.Other;

              return (
                <motion.div
                  key={cat.category}
                  className="relative rounded-2xl overflow-hidden"
                  style={{
                    background: "var(--card-bg)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    border: "1px solid var(--border-color)",
                    boxShadow: "0 2px 16px var(--card-shadow)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: catIdx * 0.06 }}
                >
                  {/* Category color accent (left border) */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                    style={{ background: catColor }}
                  />

                  <div className="pl-5 pr-5 py-5 sm:pl-6 sm:pr-6 sm:py-6">
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <h2
                        className="text-lg font-bold tracking-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {cat.category}
                      </h2>
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background: `${catColor}12`,
                          color: catColor,
                          border: `1px solid ${catColor}30`,
                          fontFamily:
                            "'JetBrains Mono', 'Fira Code', monospace",
                        }}
                      >
                        {cat.skills.length}
                      </span>
                    </div>

                    {/* Skill Cards Grid */}
                    <div className="flex flex-wrap gap-3">
                      {cat.skills.map((skill, skillIdx) => {
                        const selected = isSelected(catIdx, skillIdx);
                        return (
                          <button
                            key={skill.name}
                            onClick={() => toggleSkill(catIdx, skillIdx)}
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-left"
                            style={{
                              background: selected
                                ? `${catColor}12`
                                : "var(--card-bg)",
                              border: selected
                                ? `1.5px solid ${catColor}50`
                                : "1px solid var(--border-color)",
                              boxShadow: selected
                                ? `0 4px 16px ${catColor}18`
                                : "0 1px 4px var(--card-shadow)",
                            }}
                          >
                            {/* Logo or Fallback */}
                            {skill.logo ? (
                              <img
                                src={skill.logo}
                                alt={skill.name}
                                className="w-7 h-7 object-contain flex-shrink-0"
                              />
                            ) : (
                              <div
                                className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                                style={{ background: catColor }}
                              >
                                {skill.name.slice(0, 2)}
                              </div>
                            )}
                            <span
                              className="text-sm font-medium whitespace-nowrap"
                              style={{
                                color: selected ? catColor : "var(--text-primary)",
                              }}
                            >
                              {skill.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Expanded Detail Panel */}
                    <AnimatePresence>
                      {selectedSkill?.categoryIndex === catIdx && (() => {
                        const skill =
                          cat.skills[selectedSkill.skillIndex];
                        if (!skill) return null;
                        const lvl =
                          levelLabels[skill.level] ?? levelLabels[1];
                        const related = findRelatedProjects(skill);

                        return (
                          <motion.div
                            key={skill.name}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div
                              className="relative mt-4 rounded-xl p-5"
                              style={{
                                background: "var(--card-bg)",
                                border: "1px solid var(--border-color)",
                              }}
                            >
                              <CornerMarks
                                size={8}
                                offset={-4}
                                color={`${catColor}60`}
                              />

                              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                {/* Left: Detail info */}
                                <div className="flex-1 min-w-0">
                                  {/* Title + Level */}
                                  <div className="flex items-center gap-3 mb-3">
                                    {skill.logo && (
                                      <img
                                        src={skill.logo}
                                        alt=""
                                        className="w-8 h-8 object-contain"
                                      />
                                    )}
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

                                  {/* Proficiency Comment */}
                                  {skill.comment && (
                                    <div
                                      className="rounded-lg px-4 py-3 mb-3"
                                      style={{
                                        background: `${catColor}06`,
                                        borderLeft: `3px solid ${catColor}`,
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
                                        使用経験・コメント
                                      </div>
                                      <p
                                        className="text-sm leading-relaxed"
                                        style={{ color: "var(--text-body)" }}
                                      >
                                        {skill.comment}
                                      </p>
                                    </div>
                                  )}

                                  {/* Libraries / Frameworks */}
                                  {skill.libraries &&
                                    skill.libraries.length > 0 && (
                                      <div className="mb-3">
                                        <div
                                          className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-2"
                                          style={{
                                            color: "var(--text-muted)",
                                            fontFamily:
                                              "'JetBrains Mono', 'Fira Code', monospace",
                                          }}
                                        >
                                          関連ライブラリ / フレームワーク
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
                                        使用プロジェクト
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

                                  {/* Fallback: no detail data */}
                                  {!skill.description &&
                                    !skill.comment &&
                                    (!skill.libraries ||
                                      skill.libraries.length === 0) &&
                                    related.length === 0 && (
                                      <p
                                        className="text-sm"
                                        style={{ color: "var(--text-muted)" }}
                                      >
                                        詳細情報は Google Sheets の
                                        Skills シートに追記すると表示されます。
                                      </p>
                                    )}
                                </div>

                                {/* Right: Circle indicator */}
                                <div className="hidden sm:flex flex-col items-center justify-center w-20 flex-shrink-0">
                                  <svg
                                    width="64"
                                    height="64"
                                    viewBox="0 0 64 64"
                                  >
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
                                      style={{
                                        transition:
                                          "stroke-dasharray 0.6s ease",
                                      }}
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
                            </div>
                          </motion.div>
                        );
                      })()}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Level Legend */}
          <motion.div
            className="relative rounded-2xl p-6 sm:p-8 mt-12 max-w-4xl mx-auto"
            style={{
              background: "var(--card-bg)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid var(--card-border)",
              boxShadow: "0 4px 20px var(--card-shadow)",
            }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <CornerMarks size={8} offset={-4} />
            <div
              className="text-xs font-semibold tracking-[0.2em] uppercase mb-4"
              style={{
                color: "var(--accent)",
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              }}
            >
              // スキルレベルの基準
            </div>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              各スキルは 1〜5
              の5段階で自己評価しています。以下の基準に基づき、実務経験や学習状況を踏まえて設定しています。
            </p>
            <div className="space-y-4">
              {[
                {
                  level: 1,
                  label: "Introductory",
                  color: "#94a3b8",
                  desc: "基本的な概念や用語を理解している段階です。公式ドキュメントやチュートリアルを参照しながら、簡単なセットアップや基礎的な操作を行うことができます。個人の学習プロジェクトで触れた経験があります。",
                },
                {
                  level: 2,
                  label: "Beginner",
                  color: "#64748b",
                  desc: "基本的な機能を使って小規模なタスクを自力で遂行できます。頻出するパターンやAPIを把握しており、先輩エンジニアのサポートがあれば実務プロジェクトに参加できるレベルです。個人開発や学習課題で複数回使用した経験があります。",
                },
                {
                  level: 3,
                  label: "Intermediate",
                  color: "#f59e0b",
                  desc: "一般的な開発業務を独力でこなせるレベルです。標準的な設計パターンや実装手法を理解し、日常的な機能開発・バグ修正・テスト作成を自走して進められます。チーム開発や実務プロジェクトでの使用経験があり、一定規模のアプリケーション構築に携わっています。",
                },
                {
                  level: 4,
                  label: "Advanced",
                  color: "#22c55e",
                  desc: "複雑な技術課題にも対応でき、設計判断やコードレビューを主導できるレベルです。ベストプラクティスを踏まえたアーキテクチャ設計、パフォーマンスを意識した実装、チームメンバーへの技術指導・ナレッジ共有ができます。複数の実務プロジェクトで中心的に活用した実績があります。",
                },
                {
                  level: 5,
                  label: "Expert",
                  color: "#b03eb6",
                  desc: "深い専門知識を持ち、高度な課題解決に取り組めるレベルです。大規模なアーキテクチャ設計、パフォーマンス最適化、技術選定の意思決定を主導できます。内部実装への理解も深く、トラブルシューティングやチューニングにおいて的確な判断ができます。最も得意とする技術領域です。",
                },
              ].map((item) => (
                <div key={item.level} className="flex items-start gap-4">
                  <div className="flex items-center gap-2 flex-shrink-0 w-32 sm:w-40 pt-0.5">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 rounded-full"
                          style={{
                            background:
                              i < item.level
                                ? item.color
                                : "var(--skill-bar-empty)",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-xs font-bold whitespace-nowrap"
                      style={{ color: item.color }}
                    >
                      {item.label}
                    </span>
                  </div>
                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
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

export default SkillsPage;
