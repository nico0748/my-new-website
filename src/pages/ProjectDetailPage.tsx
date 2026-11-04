import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import SiteLayout, { Loading } from "../components/layouts/SiteLayout";
import { fetchSheetData } from "../lib/googleSheets";
import { mapPortfolioData } from "../lib/dataMapper";
import type { PortfolioItem } from "../lib/dataMapper";
import type { SheetRow } from "../lib/googleSheets";

// 一覧カード側と一致させる view-transition-name（共有要素モーフ用）
const vtName = (prefix: string, id: string) =>
  `${prefix}-${String(id).replace(/[^\w-]/g, "-")}`;

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const [project, setProject] = useState<PortfolioItem | null>(null);
  const [markdown, setMarkdown] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [mdError, setMdError] = useState(false);

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
      <SiteLayout>
        <Loading />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <motion.article
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="pt-12"
      >
        <Link to="/projects" className="text-sm link-quiet">
          ← Works
        </Link>

        {project && (
          <header className="mt-12 mb-14">
            <h1
              className="text-3xl sm:text-4xl font-semibold tracking-tight leading-snug"
              style={{ color: "var(--text-primary)", viewTransitionName: vtName("project-title", project.id) }}
            >
              {project.title}
            </h1>
            {project.description && (
              <p className="mt-5 text-[15px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {project.description}
              </p>
            )}
            {project.tags.length > 0 && (
              <p className="mt-4 text-[12px] tracking-wide" style={{ color: "var(--text-muted)" }}>
                {project.tags.join(" / ")}
              </p>
            )}
            {(isUrl(project.liveUrl) || isUrl(project.repoUrl)) && (
              <ul className="mt-8 flex gap-6 text-sm">
                {isUrl(project.liveUrl) && (
                  <li>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="link-quiet">
                      Website ↗
                    </a>
                  </li>
                )}
                {isUrl(project.repoUrl) && (
                  <li>
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="link-quiet">
                      GitHub ↗
                    </a>
                  </li>
                )}
              </ul>
            )}
            {project.thumbnail && /\.(png|jpe?g|webp|gif|svg)$/i.test(project.thumbnail) && (
              <img
                src={project.thumbnail}
                alt=""
                className="mt-12 w-full rounded-md"
                style={{ border: "1px solid var(--border-color)", viewTransitionName: vtName("project-img", project.id) }}
              />
            )}
          </header>
        )}

        <div className="h-px mb-12" style={{ background: "var(--border-color)" }} />

        {mdError ? (
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            詳しい紹介は準備中です。
          </p>
        ) : (
          <div className="prose-custom">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
          </div>
        )}
      </motion.article>
    </SiteLayout>
  );
};

const isUrl = (u?: string): u is string => !!u && /^https?:\/\//.test(u);

export default ProjectDetailPage;
