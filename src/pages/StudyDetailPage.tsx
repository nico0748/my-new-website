import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import TerminalBackground from "../components/ui/TerminalBackground";
import CornerMarks from "../components/ui/CornerMarks";
import { getStudyCategoryStyle } from "../lib/studyCategories";
import { fetchSheetData } from "../lib/googleSheets";
import { mapStudyData } from "../lib/dataMapper";
import type { StudyItem } from "../lib/dataMapper";
import type { SheetRow } from "../lib/googleSheets";

const StudyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [study, setStudy] = useState<StudyItem | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [mdError, setMdError] = useState(false);

  useEffect(() => {
    const load = async () => {
      let items: StudyItem[] = [];

      if (import.meta.env.VITE_GOOGLE_SHEETS_API_KEY) {
        try {
          const rows = await fetchSheetData<SheetRow>("Study");
          if (rows.length > 0) items = mapStudyData(rows);
        } catch {
          // fallback
        }
      }

      const found = items.find((s) => s.id === id) ?? null;
      setStudy(found);

      const mdPath = found?.markdownFile ?? `/study/${id}.md`;
      try {
        const res = await fetch(mdPath);
        if (res.ok) {
          setMarkdown(await res.text());
        } else {
          setMdError(true);
        }
      } catch {
        setMdError(true);
      }

      setLoading(false);
    };

    load();
  }, [id]);

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

  const cat = study ? getStudyCategoryStyle(study.category) : null;
  // md が無い場合でも、参考リンク or 説明があればフォールバック表示する
  const hasFallback = mdError && !!study && (!!study.externalUrl || !!study.description);

  return (
    <TerminalBackground>
      {/* ヘッダー */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{
          background: "var(--header-bg)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-medium transition-colors duration-200"
            style={{ color: "var(--text-secondary)" }}
          >
            <span>←</span>
            <span>戻る</span>
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-28 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* 学習記録ヘッダー */}
          {study && cat && (
            <div className="mb-10">
              {/* カテゴリバッジ + 日付 */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded"
                  style={{
                    background: `${cat.color}1a`,
                    color: cat.color,
                    border: `1px solid ${cat.color}55`,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  <span aria-hidden>{cat.emoji}</span>
                  {cat.label}
                </span>
                {study.date && (
                  <span
                    className="text-xs"
                    style={{ color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}
                  >
                    {study.date}
                  </span>
                )}
                {study.author && (
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    by {study.author}
                  </span>
                )}
              </div>

              {/* タイトル */}
              <h1
                className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
                style={{
                  color: "var(--text-primary)",
                  letterSpacing: "-0.02em",
                  fontFamily: "'JetBrains Mono', 'Noto Sans JP', monospace",
                }}
              >
                {study.title}
              </h1>
              <p className="text-base mb-6" style={{ color: "var(--text-secondary)" }}>
                {study.description}
              </p>

              {/* タグ */}
              {study.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {study.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-semibold px-3 py-1 rounded-full"
                      style={{
                        background: "var(--tag-bg)",
                        color: "var(--tag-color)",
                        border: "1px solid var(--tag-border)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* 参考リンク */}
              {study.externalUrl && (
                <a
                  href={study.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
                  style={{
                    background: "var(--accent-bg)",
                    color: "var(--accent)",
                    border: "1px solid var(--accent-border)",
                  }}
                >
                  参考リンク ↗
                </a>
              )}

              {/* 区切り線 */}
              <div className="mt-10 h-px" style={{ background: "var(--border-color)" }} />
            </div>
          )}

          {/* 本文 */}
          <div
            className="relative rounded-2xl p-8"
            style={{
              background: "var(--card-bg)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid var(--card-border)",
              boxShadow: "0 4px 24px var(--card-shadow)",
            }}
          >
            <CornerMarks size={12} offset={-6} />
            {mdError && !hasFallback ? (
              <div className="text-center py-12">
                <p className="text-2xl mb-2">📄</p>
                <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                  コンテンツが見つかりません
                </p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: "var(--code-bg)" }}>
                    public/study/{id}.md
                  </code>{" "}
                  に Markdown ファイルを配置してください。
                </p>
              </div>
            ) : mdError && hasFallback ? (
              <div className="prose-custom">
                <p>{study?.description}</p>
                {study?.externalUrl && (
                  <p>
                    詳細は{" "}
                    <a href={study.externalUrl} target="_blank" rel="noopener noreferrer">
                      こちらの参考リンク
                    </a>{" "}
                    を参照してください。
                  </p>
                )}
              </div>
            ) : (
              <div className="prose-custom">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </TerminalBackground>
  );
};

export default StudyDetailPage;
