import { Suspense, lazy, useEffect, useState } from "react";
import type { ComponentType, LazyExoticComponent } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getWorkArticleLoader, preloadWorkArticle } from "../../lib/worksRegistry";
import type { PortfolioItem } from "../../lib/dataMapper";
import WorkArticle from "./WorkArticle";

/**
 * 作品 id ごとの lazy コンポーネントをモジュール内に持っておく。
 * 2 回目以降（戻る / 進む・前後の作品から戻る）は読み込み済みとして同期で描画されるので、
 * ScrollRestoration がスクロール位置を戻す時点で本文の高さがそろっている。
 * 記事のチャンクが読めない（デプロイ前から開いていたタブで、古いチャンクが消えているなど）ときは、
 * 1 度だけページを読み込み直して新しい版を取りに行く。それでも読めなければその旨を出す
 * （記事のある作品の Markdown は消してあるので、Markdown に戻すと「準備中」と誤って出てしまう）。
 */
const lazyArticles = new Map<string, LazyExoticComponent<ComponentType>>();
const getLazyArticle = (id: string) => {
  const loader = getWorkArticleLoader(id);
  if (!loader) return null;
  let Article = lazyArticles.get(id);
  if (!Article) {
    Article = lazy(() =>
      loader().catch(() =>
        reloadOnce() ? new Promise<never>(() => {}) : { default: ArticleLoadError }
      )
    );
    lazyArticles.set(id, Article);
  }
  return Article;
};

/** 直近 30 秒以内に読み込み直していなければ読み込み直す（失敗が続くときに繰り返さない）。 */
const RELOAD_KEY = "works-article-reloaded-at";
const reloadOnce = () => {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
    if (Date.now() - last < 30_000) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
};

const ArticleLoadError: React.FC = () => (
  <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
    本文を読み込めませんでした。
    <button type="button" className="link-quiet ml-2 underline underline-offset-4" onClick={() => window.location.reload()}>
      再読み込み
    </button>
  </p>
);

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
  const Article = getLazyArticle(id);

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
