import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import GraphPaperBackground from "../components/ui/GraphPaperBackground";
import CornerMarks from "../components/ui/CornerMarks";
import { fetchSheetData } from "../lib/googleSheets";
import { mapPortfolioData } from "../lib/dataMapper";
import type { PortfolioItem } from "../lib/dataMapper";
import type { SheetRow } from "../lib/googleSheets";

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [mdError, setMdError] = useState(false);

  // プロジェクトデータを取得
  useEffect(() => {
    const load = async () => {
      let items: PortfolioItem[] = [];

      if (import.meta.env.VITE_GOOGLE_SHEETS_API_KEY) {
        try {
          const rows = await fetchSheetData<SheetRow>("Projects");
          if (rows.length > 0) items = mapPortfolioData(rows);
        } catch {
          // fallback
        }
      }

      const found = items.find((p) => p.id === id);
      setProject(found ?? null);

      // Markdown を fetch
      const mdPath = found?.markdownFile ?? `/projects/${id}.md`;
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
      <GraphPaperBackground>
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="w-10 h-10 rounded-full border-2 border-t-transparent"
            style={{ borderColor: '#2563eb', borderTopColor: 'transparent' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </GraphPaperBackground>
    );
  }

  return (
    <GraphPaperBackground>
      {/* ヘッダー */}
      <header
        className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        style={{
          background: 'rgba(244, 246, 251, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(99, 152, 219, 0.2)',
        }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:text-blue-600"
          style={{ color: '#64748b' }}
        >
          <span>←</span>
          <span>戻る</span>
        </button>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-28 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* プロジェクトヘッダー */}
          {project && (
            <div className="mb-10">
              {/* サムネイル */}
              {project.thumbnail && (
                <div className="rounded-2xl overflow-hidden mb-8 shadow-md" style={{ boxShadow: '0 8px 32px rgba(37,99,235,0.1)' }}>
                  <img src={project.thumbnail} alt={project.title} className="w-full h-64 object-cover" />
                </div>
              )}

              {/* タグ */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{
                      background: 'rgba(37, 99, 235, 0.08)',
                      color: '#2563eb',
                      border: '1px solid rgba(37, 99, 235, 0.15)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* タイトル */}
              <h1
                className="text-4xl sm:text-5xl font-bold tracking-tight mb-3"
                style={{ color: '#1e293b', letterSpacing: '-0.03em' }}
              >
                {project.title}
              </h1>
              <p className="text-lg mb-6" style={{ color: '#64748b' }}>
                {project.description}
              </p>

              {/* リンク */}
              <div className="flex gap-4">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:opacity-90"
                    style={{
                      background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                      color: '#fff',
                      boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
                    }}
                  >
                    サイトを見る ↗
                  </a>
                )}
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background: 'rgba(255,255,255,0.8)',
                      color: '#1e293b',
                      border: '1px solid rgba(99,152,219,0.3)',
                    }}
                  >
                    GitHub
                  </a>
                )}
              </div>

              {/* 区切り線 */}
              <div className="mt-10 h-px" style={{ background: 'rgba(99,152,219,0.2)' }} />
            </div>
          )}

          {/* Markdown コンテンツ */}
          <div
            className="relative rounded-2xl p-8"
            style={{
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(99, 152, 219, 0.22)',
              boxShadow: '0 4px 24px rgba(37, 99, 235, 0.06)',
            }}
          >
            <CornerMarks size={12} offset={-6} />
            {mdError ? (
              <div className="text-center py-12">
                <p className="text-2xl mb-2">📄</p>
                <p className="font-semibold mb-1" style={{ color: '#1e293b' }}>
                  コンテンツが見つかりません
                </p>
                <p className="text-sm" style={{ color: '#94a3b8' }}>
                  <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(99,152,219,0.1)' }}>
                    public/projects/{id}.md
                  </code>{" "}
                  にMarkdownファイルを配置してください。
                </p>
              </div>
            ) : (
              <div className="prose-custom">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdown}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </GraphPaperBackground>
  );
};

export default ProjectDetailPage;
