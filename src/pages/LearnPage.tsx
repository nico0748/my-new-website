import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import NicoTechMark from "../components/learn/NicoTechMark";
import "../styles/learn.css";

import {
  DOMAIN_ORDER,
  DOMAIN_STYLES,
  DOMAIN_SECTIONS,
} from "../lib/learnCategories";
import { getDomainCount, getEntry } from "../lib/learnRegistry";
import { getCourseProgress, getLastOpened, useProgressTick } from "../lib/learnProgress";

const LessonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const LearnPage = () => {
  useProgressTick();
  // ポートフォリオのダーク body を隠して白背景に
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = "#ffffff";
    document.title = "nicoTech Learn — Web・インフラ・セキュリティの教材";
    return () => {
      document.body.style.background = prev;
      document.title = "nicoTech Learn";
    };
  }, []);

  const totalArticles = DOMAIN_ORDER.reduce((n, d) => n + getDomainCount(d), 0);
  const last = getLastOpened();
  const lastEntry = last ? getEntry(last.domain, last.id) : undefined;

  return (
    <div className="learn-docs">
      <div className="learn-landing">
        {/* Header */}
        <header className="landing-header">
          <Link to="/learn" className="logo">
            <NicoTechMark size={38} />
            <span className="logo-text">nico<span className="accent">Tech</span></span>
          </Link>
          <div className="lh-right">
            <Link to="/" className="lh-link">← Portfolio</Link>
            <a href="#courses" className="btn-cta small">コースを見る</a>
          </div>
        </header>

        {/* Hero */}
        <section className="hero">
          <h1>体系立てて学ぶ、<br />Web・インフラ・セキュリティ</h1>
          <p className="hero-sub">
            断片的な知識ではなく、章の順に積み上げて理解する教材ライブラリ。
          </p>
          <div className="hero-stats">
            <span className="stat">
              <span className="num">{DOMAIN_ORDER.length}</span>
              <span className="lbl">コース</span>
            </span>
            <span className="stat">
              <span className="num">{totalArticles}</span>
              <span className="lbl">記事</span>
            </span>
          </div>
          <div className="hero-cta-row">
            <a href="#courses" className="btn-cta">まずはコースを見る</a>
            {lastEntry && (
              <Link to={`/learn/${lastEntry.meta.domain}/${lastEntry.meta.id}`} className="btn-resume">
                続きから読む
                <span className="br-title">{lastEntry.meta.title}</span>
              </Link>
            )}
          </div>
        </section>

        {/* Mint band */}
        <section className="mint-band">
          <h2>初心者から、創れる人に</h2>
          <p>
            それぞれのコースは「入門 → 基礎 → 実践」の順に構成。手を動かしながら、実務で通用する土台を固めます。
          </p>
        </section>

        {/* Courses */}
        <section className="courses-section" id="courses">
          <div className="cs-head">
            <h2>コース一覧</h2>
            <p>学びたい分野を選んでください。各コースは章ごとに整理された記事で構成されています。</p>
          </div>

          <div className="course-grid">
            {DOMAIN_ORDER.map((domain) => {
              const style = DOMAIN_STYLES[domain];
              const articles = getDomainCount(domain);
              const chapters = DOMAIN_SECTIONS[domain].length;
              const prog = getCourseProgress(domain);
              return (
                <Link
                  key={domain}
                  to={`/learn/${domain}`}
                  className="course-card"
                  style={{ "--cc-accent": style.accent } as CSSProperties}
                >
                  <span className="cc-cover">
                    <img src={style.cover} alt={`${style.label} コース`} loading="lazy" />
                  </span>
                  <span className="cc-body">
                    <span className="cc-title">{style.label}</span>
                    <span className="cc-desc">{style.description}</span>
                    <span className="cc-meta">
                      <LessonIcon />
                      全{chapters}章 · {articles}記事
                    </span>
                    {prog.total > 0 && (
                      <span className="cc-progress">
                        <span className="cc-progress-bar">
                          <span className="cc-progress-fill" style={{ width: `${prog.percent}%` }} />
                        </span>
                        <span className="cc-progress-label">
                          {prog.done > 0 ? `完了 ${prog.done}/${prog.total}` : "未着手"}
                        </span>
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          &copy; {new Date().getFullYear()} NICOLABO -にこラボ-. Learn Library.
        </footer>
      </div>
    </div>
  );
};

export default LearnPage;
