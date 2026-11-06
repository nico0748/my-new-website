import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

import SiteLayout, { PageTitle, Loading } from "../components/layouts/SiteLayout";
import Reveal from "../components/ui/Reveal";
import { fetchSheetData } from "../lib/googleSheets";
import { mapSkillsData, mapPortfolioData } from "../lib/dataMapper";
import type { SkillCategory, Skill, PortfolioItem } from "../lib/dataMapper";
import type { SheetRow } from "../lib/googleSheets";
import { skillColor } from "../lib/skillColors";

/** CSS 変数の色を薄めて使う（var() には 16 進の透明度を付け足せないため）。 */
const tint = (color: string, percent: number) => `color-mix(in srgb, ${color} ${percent}%, transparent)`;

// レベルは淡いグレー → 副テキストのグレー → サンドの順に明るくする（凡例も同じ色）
const levelLabels: Record<number, { label: string; color: string }> = {
  1: { label: "Introductory", color: "var(--text-muted)" },
  2: { label: "Beginner", color: "color-mix(in srgb, var(--text-muted), var(--text-secondary))" },
  3: { label: "Intermediate", color: "var(--text-secondary)" },
  4: { label: "Advanced", color: "var(--accent)" },
  5: { label: "Expert", color: "var(--accent-hover)" },
};

/** レベルリングの円周（2π × r28）。tailwind.config.js の ring-draw と同じ値。 */
const RING_LENGTH = 175.9;

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
      <SiteLayout>
        <Loading />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
        <div>
          <PageTitle
            title="Skills"
            lead="これまでに使用した技術・ツールの一覧です。各スキルを選ぶと、使用経験の詳細を確認できます。"
          />

          {/* Category Rows */}
          <div className="space-y-6">
            {skills.map((cat, catIdx) => {
              // トップのレーダーチャートと同じ色（Frontend=緑 / Backend=青 / Database=黄 / Infrastructure=紫）
              const catColor = skillColor(cat.category, catIdx);

              return (
                <Reveal
                  key={cat.category}
                  className="relative rounded-lg overflow-hidden"
                  style={{
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                  }}
                >

                  <div className="pl-5 pr-5 py-5 sm:pl-6 sm:pr-6 sm:py-6">
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <h2
                        className="text-[17px] font-semibold tracking-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {cat.category}
                      </h2>
                      <span
                        className="text-[13px] font-medium px-2 py-0.5 rounded-full"
                        style={{
                          background: tint(catColor, 7),
                          color: catColor,
                          border: `1px solid ${tint(catColor, 19)}`,
                          fontFamily:
                            "var(--font-sans)",
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
                            type="button"
                            aria-pressed={selected}
                            onClick={() => toggleSkill(catIdx, skillIdx)}
                            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-colors duration-200 text-left"
                            style={{
                              // 選択中は枠線の色だけで示す（影・光は付けない。太さも変えずに位置をずらさない）
                              background: "var(--card-bg)",
                              border: `1px solid ${selected ? catColor : "var(--border-color)"}`,
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
                                className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 text-[13px] font-semibold"
                                style={{ background: tint(catColor, 13), color: catColor }}
                              >
                                {skill.name.slice(0, 2)}
                              </div>
                            )}
                            <span
                              className="text-[15px] font-medium whitespace-nowrap"
                              style={{ color: "var(--text-primary)" }}
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
                                      className="text-[17px] font-semibold tracking-tight"
                                      style={{ color: "var(--text-primary)" }}
                                    >
                                      {skill.name}
                                    </h3>
                                    <span
                                      className="text-[13px] font-semibold px-2 py-0.5 rounded-full"
                                      style={{
                                        color: lvl.color,
                                        background: tint(lvl.color, 8),
                                        border: `1px solid ${tint(lvl.color, 19)}`,
                                      }}
                                    >
                                      {lvl.label}
                                    </span>
                                    {skill.experienceYears && (
                                      <span
                                        className="text-[13px] font-medium px-2 py-0.5 rounded-full"
                                        style={{
                                          background: "var(--skill-bar-empty)",
                                          color: "var(--text-secondary)",
                                          fontFamily:
                                            "var(--font-sans)",
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
                                      className="text-[13px] font-medium w-8 text-right"
                                      style={{
                                        color: "var(--text-muted)",
                                        fontFamily:
                                          "var(--font-sans)",
                                      }}
                                    >
                                      {skill.level}/5
                                    </span>
                                  </div>

                                  {/* Description */}
                                  {skill.description && (
                                    <p
                                      className="text-[15px] leading-relaxed mb-3"
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
                                        background: tint(catColor, 2),
                                        borderLeft: `3px solid ${catColor}`,
                                      }}
                                    >
                                      <div
                                        className="text-[13px] font-medium tracking-wide mb-1"
                                        style={{
                                          color: "var(--text-muted)",
                                          fontFamily:
                                            "var(--font-sans)",
                                        }}
                                      >
                                        使用経験・コメント
                                      </div>
                                      <p
                                        className="text-[15px] leading-relaxed"
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
                                          className="text-[13px] font-medium tracking-wide mb-2"
                                          style={{
                                            color: "var(--text-muted)",
                                            fontFamily:
                                              "var(--font-sans)",
                                          }}
                                        >
                                          関連ライブラリ / フレームワーク
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                          {skill.libraries.map((lib) => (
                                            <span
                                              key={lib}
                                              className="text-[13px] font-medium px-2.5 py-1 rounded-lg"
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
                                        className="text-[13px] font-medium tracking-wide mb-2"
                                        style={{
                                          color: "var(--text-muted)",
                                          fontFamily:
                                            "var(--font-sans)",
                                        }}
                                      >
                                        使用プロジェクト
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {related.map((proj) => (
                                          <Link
                                            key={proj.id}
                                            to={`/projects/${proj.id}`}
                                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all duration-200"
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
                                        className="text-[15px]"
                                        style={{ color: "var(--text-muted)" }}
                                      >
                                        詳細情報は Google Sheets の
                                        Skills シートに追記すると表示されます。
                                      </p>
                                    )}
                                </div>

                                {/* Right: Circle indicator（スマホでは出さない） */}
                                <div className="hidden sm:flex flex-col items-center justify-center w-20 flex-shrink-0">
                                  <svg
                                    width="64"
                                    height="64"
                                    viewBox="0 0 64 64"
                                    aria-hidden="true"
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
                                      strokeDasharray={`${(skill.level / 5) * RING_LENGTH} ${RING_LENGTH}`}
                                      transform="rotate(-90 32 32)"
                                      // パネルが開くたび（スキルごとに key で作り直される）に 0 から今のレベルまで線を引く。
                                      // 動きを減らす設定では遅延も残さず最初から表示する
                                      className="animate-ring-draw motion-reduce:animate-none"
                                    />
                                    <text
                                      x="32"
                                      y="36"
                                      textAnchor="middle"
                                      fill={lvl.color}
                                      fontSize="16"
                                      fontWeight="600"
                                      fontFamily="var(--font-sans)"
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
                </Reveal>
              );
            })}
          </div>

          {/* Level Legend */}
          <Reveal
            className="relative rounded-lg p-6 sm:p-8 mt-12 max-w-4xl mx-auto"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
            }}
          >
            <div
              className="text-[13px] font-semibold tracking-[0.2em] uppercase mb-4"
              style={{
                color: "var(--text-muted)",
                fontFamily: "var(--font-sans)",
              }}
            >
              スキルレベルの基準
            </div>
            <p
              className="text-[15px] leading-relaxed mb-6"
              style={{ color: "var(--text-secondary)" }}
            >
              各スキルは 1〜5
              の5段階で自己評価しています。以下の基準に基づき、実務経験や学習状況を踏まえて設定しています。
            </p>
            {/* 色と名前は levelLabels と共通 */}
            <div className="space-y-4">
              {[
                {
                  level: 1,
                  desc: "基本的な概念や用語を理解している段階です。公式ドキュメントやチュートリアルを参照しながら、簡単なセットアップや基礎的な操作を行うことができます。個人の学習プロジェクトで触れた経験があります。",
                },
                {
                  level: 2,
                  desc: "基本的な機能を使って小規模なタスクを自力で遂行できます。頻出するパターンやAPIを把握しており、先輩エンジニアのサポートがあれば実務プロジェクトに参加できるレベルです。個人開発や学習課題で複数回使用した経験があります。",
                },
                {
                  level: 3,
                  desc: "一般的な開発業務を独力でこなせるレベルです。標準的な設計パターンや実装手法を理解し、日常的な機能開発・バグ修正・テスト作成を自走して進められます。チーム開発や実務プロジェクトでの使用経験があり、一定規模のアプリケーション構築に携わっています。",
                },
                {
                  level: 4,
                  desc: "複雑な技術課題にも対応でき、設計判断やコードレビューを主導できるレベルです。ベストプラクティスを踏まえたアーキテクチャ設計、パフォーマンスを意識した実装、チームメンバーへの技術指導・ナレッジ共有ができます。複数の実務プロジェクトで中心的に活用した実績があります。",
                },
                {
                  level: 5,
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
                                ? levelLabels[item.level].color
                                : "var(--skill-bar-empty)",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-[13px] font-semibold whitespace-nowrap"
                      style={{ color: levelLabels[item.level].color }}
                    >
                      {levelLabels[item.level].label}
                    </span>
                  </div>
                  <p
                    className="text-[15px] leading-relaxed flex-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
    </SiteLayout>
  );
};

export default SkillsPage;
