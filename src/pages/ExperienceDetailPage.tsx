import { Suspense, lazy, useEffect, useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import NicoTechLogo from "../components/learn/NicoTechLogo";
import "../styles/learn.css";

import { getExperienceEntry, getExperienceAdjacent } from "../lib/experienceRegistry";
import { isExperienceAccessible } from "../lib/learnRegistry";
import { getExperienceCategoryStyle } from "../lib/experienceCategories";
import type { ExperienceMeta } from "../lib/experienceCategories";

const Spinner = () => (
  <p style={{ color: "var(--color-text-secondary)", padding: "24px 0" }}>読み込み中…</p>
);

const FooterLink = ({ meta, dir }: { meta: ExperienceMeta; dir: "prev" | "next" }) => (
  <Link to={`/nicotech/experience/${meta.id}`} className={dir}>
    <span className="nav-label">{dir === "prev" ? "← 新しい記事" : "古い記事 →"}</span>
    <span className="nav-title">{meta.title}</span>
  </Link>
);

/** 経験録の記事詳細。本文は content/experience の TSX を lazy 読み込みする。 */
const ExperienceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const entry = id ? getExperienceEntry(id) : undefined;
  const meta = entry?.meta;

  const ArticleBody = useMemo(() => (entry ? lazy(entry.load) : null), [entry]);
  const { prev, next } = meta ? getExperienceAdjacent(meta.id) : { prev: undefined, next: undefined };

  useEffect(() => {
    const prevBg = document.body.style.background;
    document.body.style.background = "#ffffff";
    document.title = meta ? `${meta.title} | 経験録` : "記事が見つかりません | 経験録";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.background = prevBg;
      document.title = "nicoTech";
    };
  }, [meta]);

  // 本番では経験録を非公開にする（dev / Preview では表示）
  if (!isExperienceAccessible()) return <Navigate to="/nicotech" replace />;

  return (
    <div className="learn-docs">
      <div className="learn-landing">
        <header className="landing-header">
          <div className="sh-main">
            <NicoTechLogo />
          </div>
        </header>

        <main className="exp-detail">
          {!entry || !ArticleBody || !meta ? (
            <>
              <h1>記事が見つかりません</h1>
              <p style={{ color: "var(--color-text-secondary)" }}>
                お探しの記事 <code>{id}</code> は存在しないか、移動・削除された可能性があります。
              </p>
              <p style={{ marginTop: 20 }}>
                <Link to="/nicotech/experience" className="btn-cta small">経験録の一覧へ</Link>
              </p>
            </>
          ) : (
            <>
              <div className="exp-card-head">
                {(() => {
                  const cat = getExperienceCategoryStyle(meta.category);
                  return (
                    <span className="exp-badge" style={{ color: cat.color, background: cat.bg }}>
                      {cat.label}
                    </span>
                  );
                })()}
                <span className="exp-date">{meta.date}</span>
                {meta.minutes && <span className="exp-date">約{meta.minutes}分</span>}
              </div>

              <h1>{meta.title}</h1>
              <p className="lead">{meta.description}</p>

              {meta.tags.length > 0 && (
                <div className="exp-tags">
                  {meta.tags.map((t) => (
                    <span key={t} className="exp-tag">{t}</span>
                  ))}
                </div>
              )}

              <hr />

              <div className="prose ld-article">
                <Suspense fallback={<Spinner />}>
                  <ArticleBody />
                </Suspense>
              </div>

              {(prev || next) && (
                <div className="chapter-footer">
                  {prev ? <FooterLink meta={prev} dir="prev" /> : <span style={{ flex: 1 }} />}
                  {next ? <FooterLink meta={next} dir="next" /> : <span style={{ flex: 1 }} />}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ExperienceDetailPage;
