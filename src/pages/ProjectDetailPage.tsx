import { useEffect, useLayoutEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import SiteLayout, { Loading } from "../components/layouts/SiteLayout";
import { fetchProjects, getCachedProjects, projectVtName } from "../lib/projects";
import type { PortfolioItem } from "../lib/dataMapper";

const isUrl = (u?: string): u is string => !!u && /^https?:\/\//.test(u);
const isImage = (u?: string): u is string => !!u && /\.(png|jpe?g|webp|gif|svg|avif)$/i.test(u);

/** サムネイル + 追加画像。1 枚目だけを一覧カードとモーフさせる。 */
const Gallery: React.FC<{ project: PortfolioItem }> = ({ project }) => {
  const images = [project.thumbnail, ...(project.images ?? [])].filter(isImage);
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, images.length]);

  if (images.length === 0) {
    return (
      <div
        className="aspect-[16/10] rounded-lg flex items-center justify-center text-[2.5rem] font-semibold"
        style={{ background: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border-color)" }}
        aria-hidden
      >
        {project.title.replace(/^[^\p{L}\p{N}]+/u, "").charAt(0)}
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full overflow-hidden rounded-lg cursor-zoom-in"
        style={{ border: "1px solid var(--border-color)", background: "var(--surface)" }}
        aria-label="画像を拡大する"
      >
        <img
          src={images[index]}
          alt={index === 0 ? `${project.title} のサムネイル` : `${project.title} の画面 ${index + 1}`}
          className="aspect-[16/10] w-full object-cover"
          style={index === 0 ? { viewTransitionName: projectVtName("img", project.id) } : undefined}
        />
      </button>

      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1} 枚目を表示`}
                aria-current={i === index}
                className="block w-full overflow-hidden rounded transition-opacity"
                style={{
                  border: `1px solid ${i === index ? "var(--text-secondary)" : "var(--border-color)"}`,
                  opacity: i === index ? 1 : 0.55,
                }}
              >
                <img src={src} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10 cursor-zoom-out"
            style={{ background: "var(--overlay)" }}
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="画像の拡大表示"
          >
            <img src={images[index]} alt="" className="max-h-full max-w-full rounded-md" />
            {images.length > 1 && (
              <p className="absolute bottom-6 left-0 right-0 text-center text-[13px]" style={{ color: "var(--text-secondary)" }}>
                {index + 1} / {images.length} · ← → で切り替え · Esc で閉じる
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Meta: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="mt-6 first:mt-0">
    <dt className="text-[12px] font-medium uppercase tracking-[0.16em]" style={{ color: "var(--text-muted)" }}>
      {label}
    </dt>
    <dd className="mt-2 text-[15px]" style={{ color: "var(--text-body)" }}>
      {children}
    </dd>
  </div>
);

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  // 遷移先は常に先頭から見せる（View Transition の新しいスナップショットも先頭位置で撮らせる）
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // 一覧から来た場合はキャッシュ済みなので、最初の描画から画像とタイトルを出せる（View Transition のモーフに必要）
  const [projects, setProjects] = useState<PortfolioItem[] | null>(() => getCachedProjects());
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [mdError, setMdError] = useState(false);

  useEffect(() => {
    if (projects) return;
    if (!import.meta.env.VITE_GOOGLE_SHEETS_API_KEY) {
      setProjects([]);
      return;
    }
    fetchProjects().then(setProjects);
  }, [projects]);

  const index = projects?.findIndex((p) => p.id === id) ?? -1;
  const project = index >= 0 ? projects![index] : null;
  const prev = index > 0 ? projects![index - 1] : null;
  const next = projects && index >= 0 && index < projects.length - 1 ? projects[index + 1] : null;

  useEffect(() => {
    if (!projects) return;
    let cancelled = false;
    setMarkdown(null);
    setMdError(false);
    const mdPath = project?.markdownFile ?? `/projects/${id}.md`;
    fetch(mdPath)
      .then(async (res) => {
        const text = await res.text();
        // SPA リライトで index.html が返ってきた場合も「無い」とみなす
        if (!res.ok || /^\s*<!doctype html/i.test(text)) throw new Error("not found");
        if (!cancelled) setMarkdown(text);
      })
      .catch(() => !cancelled && setMdError(true));
    return () => {
      cancelled = true;
    };
  }, [projects, project?.markdownFile, id]);

  if (!projects) {
    return (
      <SiteLayout>
        <Loading />
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <article className="pt-8 md:pt-12">
        <Link to="/projects" viewTransition className="text-[15px] link-quiet">
          ← Works
        </Link>

        {project ? (
          <header className="mt-8 md:mt-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_280px] md:gap-12 lg:gap-16 items-start">
            <div className="order-2 md:order-1">
              <Gallery key={project.id} project={project} />
            </div>

            <div className="order-1 md:order-2">
              <h1
                className="inline-block text-[1.75rem] sm:text-[2rem] font-semibold tracking-tight leading-snug"
                style={{ color: "var(--text-primary)", viewTransitionName: projectVtName("title", project.id) }}
              >
                {project.title}
              </h1>
              {project.description && (
                <p className="mt-4 text-[15px] leading-[1.9]" style={{ color: "var(--text-secondary)" }}>
                  {project.description}
                </p>
              )}

              <dl className="mt-8">
                {project.period && <Meta label="期間">{project.period}</Meta>}
                {project.tags.length > 0 && (
                  <Meta label="技術構成">
                    <ul className="flex flex-wrap gap-2">
                      {project.tags.map((t) => (
                        <li
                          key={t}
                          className="rounded px-2.5 py-1 text-[13px]"
                          style={{ background: "var(--surface)", color: "var(--text-body)", border: "1px solid var(--border-color)" }}
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </Meta>
                )}
                {(isUrl(project.liveUrl) || isUrl(project.repoUrl)) && (
                  <Meta label="リンク">
                    <ul className="flex flex-col gap-1.5">
                      {isUrl(project.liveUrl) && (
                        <li>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="link-quiet">
                            Website ↗
                          </a>
                        </li>
                      )}
                      {isUrl(project.repoUrl) && (
                        <li>
                          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="link-quiet break-all">
                            {project.repoUrl.replace(/^https:\/\/github\.com\//, "GitHub: ")} ↗
                          </a>
                        </li>
                      )}
                    </ul>
                  </Meta>
                )}
              </dl>
            </div>
          </header>
        ) : (
          <p className="mt-12 text-[15px]" style={{ color: "var(--text-muted)" }}>
            この作品は見つかりませんでした。
          </p>
        )}

        <div className="h-px my-16" style={{ background: "var(--border-color)" }} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: markdown || mdError ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-[760px] min-h-[40vh]"
        >
          {mdError ? (
            <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
              詳しい紹介は準備中です。
            </p>
          ) : (
            markdown && (
              <div className="prose-custom">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
              </div>
            )
          )}
        </motion.div>

        {project && (
          <nav aria-label="作品ナビゲーション" className="mt-24 grid grid-cols-[1fr_auto_1fr] gap-3 text-[15px]">
            {prev ? (
              <Link
                to={`/projects/${prev.id}`}
                viewTransition
                rel="prev"
                className="group rounded-lg px-4 py-3 border border-white/[0.08] hover:border-white/[0.18] transition-colors"
              >
                <span className="block text-[12px]" style={{ color: "var(--text-muted)" }}>
                  ← 前の作品
                </span>
                <span className="mt-1 block truncate" style={{ color: "var(--text-body)" }}>
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            <Link
              to="/projects"
              viewTransition
              className="flex items-center rounded-lg px-4 py-3 border border-white/[0.08] hover:border-white/[0.18] transition-colors"
              style={{ color: "var(--text-body)" }}
            >
              すべての作品
            </Link>
            {next ? (
              <Link
                to={`/projects/${next.id}`}
                viewTransition
                rel="next"
                className="group rounded-lg px-4 py-3 text-right border border-white/[0.08] hover:border-white/[0.18] transition-colors"
              >
                <span className="block text-[12px]" style={{ color: "var(--text-muted)" }}>
                  次の作品 →
                </span>
                <span className="mt-1 block truncate" style={{ color: "var(--text-body)" }}>
                  {next.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </article>
    </SiteLayout>
  );
};

export default ProjectDetailPage;
