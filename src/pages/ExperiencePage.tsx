import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import NicoTechLogo from "../components/learn/NicoTechLogo";
import NicoTechTabs from "../components/learn/NicoTechTabs";
import "../styles/learn.css";

import { EXPERIENCE_ENTRIES } from "../lib/experienceRegistry";
import { getExperienceCategoryStyle } from "../lib/experienceCategories";
import { isExperienceAccessible } from "../lib/learnRegistry";

/** 経験録の一覧ページ。教材が体系順なのに対し、こちらは新しい順のフロー型。 */
const ExperiencePage = () => {
  // 本番では経験録を非公開にする（dev / Preview では表示）。hooks を条件分岐させないため定数で持つ
  const blocked = !isExperienceAccessible();

  // ポートフォリオのダーク body を隠して白背景に
  useEffect(() => {
    if (blocked) return;
    const prev = document.body.style.background;
    document.body.style.background = "#ffffff";
    document.title = "経験録 | nicoTech";
    return () => {
      document.body.style.background = prev;
      document.title = "nicoTech";
    };
  }, [blocked]);

  if (blocked) return <Navigate to="/nicotech" replace />;

  return (
    <div className="learn-docs">
      <div className="learn-landing">
        <header className="landing-header">
          <div className="sh-main">
            <NicoTechLogo />
          </div>
          <NicoTechTabs />
        </header>

        {/* Hero: 教材と同じ構成のまま、左右を反転して右カラムに寄せる */}
        <section className="hero hero--right">
          <div className="hero-copy">
            <h1>やってみて、<br />はじめて分かったこと。</h1>
            <p className="hero-sub">
              インターン、個人開発、学習の過程で実際にぶつかったこと。教材が整理された結論なら、こちらはその過程の記録です。
            </p>
            <div className="hero-stats">
              <span className="stat">
                <span className="num">{EXPERIENCE_ENTRIES.length}</span>
                <span className="lbl">記事</span>
              </span>
            </div>
            <div className="hero-cta-row">
              <a href="#entries" className="btn-cta">記事を読む</a>
            </div>
          </div>
        </section>

        <section className="exp-section" id="entries">
          {EXPERIENCE_ENTRIES.length === 0 ? (
            <p className="exp-empty">記事を準備中です。</p>
          ) : (
            <div className="exp-list">
              {EXPERIENCE_ENTRIES.map(({ meta }) => {
                const cat = getExperienceCategoryStyle(meta.category);
                return (
                  <Link key={meta.id} to={`/nicotech/experience/${meta.id}`} className="exp-card">
                    <div className="exp-card-head">
                      <span className="exp-badge" style={{ color: cat.color, background: cat.bg }}>
                        {cat.label}
                      </span>
                      <span className="exp-date">{meta.date}</span>
                      {meta.minutes && <span className="exp-date">約{meta.minutes}分</span>}
                    </div>
                    <h2>{meta.title}</h2>
                    <p>{meta.description}</p>
                    {meta.tags.length > 0 && (
                      <div className="exp-tags">
                        {meta.tags.map((t) => (
                          <span key={t} className="exp-tag">{t}</span>
                        ))}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ExperiencePage;
