import { Suspense, lazy, useEffect, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";

import LearnLayout from "../components/learn/LearnLayout";
import DomainNav from "../components/learn/DomainNav";
import { TechStackProvider } from "../components/learn/TechStackPanel";
import {
  DOMAIN_STYLES,
  getSectionLabel,
  getLevelStyle,
  isLearnDomain,
} from "../lib/learnCategories";
import type { LearnDomain, LearnMeta } from "../lib/learnCategories";
import { getEntry, getAdjacent } from "../lib/learnRegistry";
import { setLastOpened } from "../lib/learnProgress";

const Spinner = () => (
  <p style={{ color: "var(--color-text-secondary)", padding: "24px 0" }}>読み込み中…</p>
);

const FooterLink = ({ meta, dir }: { meta: LearnMeta; dir: "prev" | "next" }) => (
  <Link to={`/nicotech/${meta.domain}/${meta.id}`} className={dir}>
    <span className="nav-label">{dir === "prev" ? "← 前の記事" : "次の記事 →"}</span>
    <span className="nav-title">{meta.title}</span>
  </Link>
);

const LearnDetailPage = () => {
  const { domain, id } = useParams<{ domain: string; id: string }>();
  const entry = domain && id ? getEntry(domain, id) : undefined;

  const ArticleBody = useMemo(() => (entry ? lazy(entry.load) : null), [entry]);

  const validDomain = isLearnDomain(domain);
  const d = (validDomain ? domain : "web") as LearnDomain;
  const meta = entry?.meta;
  const { prev, next } = meta ? getAdjacent(d, meta.id) : { prev: undefined, next: undefined };

  // document.title を記事名に（ブックマーク・共有・SEO 用）
  useEffect(() => {
    const base = "nicoTech Learn";
    document.title = meta ? `${meta.title} | ${base}` : `記事が見つかりません | ${base}`;
    return () => {
      document.title = base;
    };
  }, [meta]);

  // 「続きから読む」用に最後に開いた記事を記録
  useEffect(() => {
    if (validDomain && meta) setLastOpened(d, meta.id);
  }, [validDomain, d, meta]);

  if (!validDomain) return <Navigate to="/nicotech" replace />;
  const style = DOMAIN_STYLES[d];

  if (!entry || !ArticleBody || !meta) {
    return (
      <LearnLayout activeDomain={d} sidebar={<DomainNav domain={d} />}>
        <div className="breadcrumb">
          <Link to={`/nicotech/${d}`}>{style.label}</Link> / 見つかりません
        </div>
        <h1>記事が見つかりません</h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          お探しの記事 <code>{id}</code> は存在しないか、移動・削除された可能性があります。
          左のナビ、または下のボタンから {style.label} コースの記事を探してください。
        </p>
        <p style={{ marginTop: 20 }}>
          <Link to={`/nicotech/${d}`} className="btn-cta small">{style.label} コースの一覧へ</Link>
        </p>
        <p style={{ marginTop: 12 }}>
          <Link to="/nicotech">← すべてのコースへ戻る</Link>
        </p>
      </LearnLayout>
    );
  }

  const level = getLevelStyle(meta.level);

  return (
    <LearnLayout
      activeDomain={d}
      sidebar={<DomainNav domain={d} activeId={meta.id} />}
      toc
    >
      {/* パンくず（コースから開始） */}
      <div className="breadcrumb">
        <Link to={`/nicotech/${d}`}>{style.label}</Link> / {meta.id}
      </div>

      {/* 記事ヘッダー */}
      <span className="section-number">{getSectionLabel(d, meta.section)}</span>
      <h1>{meta.title}</h1>

      <div className="article-meta">
        <span className={`level-badge level-${meta.level}`}>{level.label}</span>
        {meta.minutes && <span className="meta-time">約{meta.minutes}分で読めます</span>}
        {meta.updated && (
          <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
            updated {meta.updated}
          </span>
        )}
      </div>

      <p className="lead">{meta.description}</p>

      {meta.tags.length > 0 && (
        <div className="article-tags">
          {meta.tags.map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      )}

      <hr />

      {/* 本文（TSX）。技術スタックの解説ドロワーを提供（stack コースは技術名を自動リンク） */}
      <TechStackProvider autoLink={d === "stack"}>
        <div className="prose ld-article">
          <Suspense fallback={<Spinner />}>
            <ArticleBody />
          </Suspense>
        </div>
      </TechStackProvider>

      {/* 前後ナビ */}
      {(prev || next) && (
        <div className="chapter-footer">
          {prev ? <FooterLink meta={prev} dir="prev" /> : <span style={{ flex: 1 }} />}
          {next ? <FooterLink meta={next} dir="next" /> : <span style={{ flex: 1 }} />}
        </div>
      )}
    </LearnLayout>
  );
};

export default LearnDetailPage;
