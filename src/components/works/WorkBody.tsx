import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getWorkArticleLoader, preloadWorkArticle } from "../../lib/worksRegistry";
import type { PortfolioItem } from "../../lib/dataMapper";
import WorkArticle from "./WorkArticle";

/**
 * 作品詳細の本文。表示の優先順位は
 *   1. src/content/works/<id>.tsx（記事テンプレート）
 *   2. シートの markdownFile / public/projects/<id>.md（従来の Markdown 表示）
 *   3. 「詳しい紹介は準備中です。」
 * ヘッダー（画像・タイトルのモーフ）はページ側でキャッシュから同期描画するので、
 * Suspense はこの本文だけに巻く（ページ全体を待たせると View Transition のモーフが壊れる）。
 */
const WorkBody: React.FC<{ id: string; project: PortfolioItem | null; preload?: (string | undefined)[] }> = ({
  id,
  project,
  preload = [],
}) => {
  const loader = getWorkArticleLoader(id);
  const Article = useMemo(() => (loader ? lazy(loader) : null), [loader]);

  // 前後の作品の記事を先読みしておく（同じルートで id だけ変わる遷移で、旧記事が居残らないように）
  const preloadKey = preload.join(",");
  useEffect(() => {
    preloadKey.split(",").forEach((p) => preloadWorkArticle(p || undefined));
  }, [preloadKey]);

  if (Article) {
    return (
      <div className="min-h-[40vh]">
        <Suspense fallback={null}>
          <WorkArticle>
            <Article />
          </WorkArticle>
        </Suspense>
      </div>
    );
  }

  return <MarkdownBody id={id} markdownFile={project?.markdownFile} />;
};

/** 記事テンプレートの無い作品は、今までどおり Markdown を表示する。 */
const MarkdownBody: React.FC<{ id: string; markdownFile?: string }> = ({ id, markdownFile }) => {
  const [markdown, setMarkdown] = useState<string | null>(null);
  const [mdError, setMdError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setMarkdown(null);
    setMdError(false);
    fetch(markdownFile ?? `/projects/${id}.md`)
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
  }, [markdownFile, id]);

  return (
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
  );
};

export default WorkBody;
