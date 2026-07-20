import { useEffect } from "react";
import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import NicoTechLogo from "../components/learn/NicoTechLogo";
import NicoTechTabs from "../components/learn/NicoTechTabs";
import OnboardingGuide from "../components/learn/OnboardingGuide";
import "../styles/learn.css";

import {
  getVisibleDomains,
  isDomainVisible,
  DOMAIN_STYLES,
  DOMAIN_SECTIONS,
  isAdvancedDomain,
  isPracticeDomain,
} from "../lib/learnCategories";
import type { LearnDomain } from "../lib/learnCategories";
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
    document.title = "nicoTech Learn — エンジニアのための体系的な教材";
    return () => {
      document.body.style.background = prev;
      document.title = "nicoTech Learn";
    };
  }, []);

  // 本番では公開コースのみ（dev / Preview は全コース表示）
  const visibleDomains = getVisibleDomains();

  const totalArticles = visibleDomains.reduce((n, d) => n + getDomainCount(d), 0);
  const last = getLastOpened();
  const lastEntry = last && isDomainVisible(last.domain) ? getEntry(last.domain, last.id) : undefined;

  const basicDomains = visibleDomains.filter((d) => !isAdvancedDomain(d) && !isPracticeDomain(d));
  const advancedDomains = visibleDomains.filter(isAdvancedDomain);
  const practiceDomains = visibleDomains.filter(isPracticeDomain);

  const renderCard = (domain: LearnDomain) => {
    const style = DOMAIN_STYLES[domain];
    const articles = getDomainCount(domain);
    const chapters = DOMAIN_SECTIONS[domain].length;
    const prog = getCourseProgress(domain);
    const isWip = articles === 0;
    return (
      <Link
        key={domain}
        to={`/nicotech/${domain}`}
        className={`course-card${isWip ? " course-card--wip" : ""}`}
        style={{ "--cc-accent": style.accent } as CSSProperties}
        aria-label={isWip ? `${style.label} コース（開発中）` : `${style.label} コース`}
      >
        <span className="cc-cover">
          <img src={style.cover} alt={`${style.label} コース`} loading="lazy" />
          {isWip && <span className="cc-wip">開発中</span>}
        </span>
        <span className="cc-body">
          <span className="cc-title">{style.label}</span>
          <span className="cc-desc">{style.description}</span>
          <span className="cc-meta">
            <LessonIcon />
            {isWip ? `全${chapters}章 · 準備中` : `全${chapters}章 · ${articles}記事`}
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
  };

  return (
    <div className="learn-docs">
      <div className="learn-landing">
        {/* Header */}
        <header className="landing-header">
          <div className="sh-main">
            <NicoTechLogo />
            <div className="lh-right">
              <button
                className="header-help"
                aria-label="使い方ガイドを開く"
                onClick={() => window.dispatchEvent(new CustomEvent("nicotech:guide-open"))}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" /><path d="M9.2 9.2a3 3 0 0 1 5.6 1c0 2-2.8 2.5-2.8 4" /><line x1="12" y1="17.5" x2="12" y2="17.51" />
                </svg>
              </button>
              <a href="#courses" className="btn-cta small">コースを見る</a>
            </div>
          </div>
          <NicoTechTabs />
        </header>

        {/* Hero: 左寄せ。右カラムは余白として空けておく */}
        <section className="hero">
          <div className="hero-copy">
            <h1>読んで終わりに、<br />しない教材。</h1>
            <p className="hero-sub">
              各章にコードと図解、理解を確かめる問い。手を動かして、実務で使える形にして持ち帰ってください。
            </p>
            {/* 統計と「続きから読む」を同じ行に並べる */}
            <div className="hero-stats">
              <span className="stat">
                <span className="num">{visibleDomains.length}</span>
                <span className="lbl">コース</span>
              </span>
              <span className="stat">
                <span className="num">{totalArticles}</span>
                <span className="lbl">記事</span>
              </span>
              {lastEntry && (
                <Link to={`/nicotech/${lastEntry.meta.domain}/${lastEntry.meta.id}`} className="btn-resume">
                  続きから読む
                  <span className="br-title">{lastEntry.meta.title}</span>
                </Link>
              )}
            </div>
          </div>

        </section>

        {/* Courses */}
        <section className="courses-section" id="courses">
          <div className="cs-head">
            <h2>コース一覧</h2>
            <p>まずは「基礎」で土台を固め、「応用」で実務レベルへ。学びたい分野を選んでください。</p>
          </div>

          {/* 本番では未公開コースが除かれるため、空のグループは見出しごと出さない */}
          {basicDomains.length > 0 && (
            <>
              <h3 className="course-group-label">基礎コース</h3>
              <div className="course-grid">{basicDomains.map(renderCard)}</div>
            </>
          )}

          {advancedDomains.length > 0 && (
            <>
              <h3 className="course-group-label">応用コース</h3>
              <div className="course-grid">{advancedDomains.map(renderCard)}</div>
            </>
          )}

          {practiceDomains.length > 0 && (
            <>
              <h3 className="course-group-label">実践コース</h3>
              <div className="course-grid">{practiceDomains.map(renderCard)}</div>
            </>
          )}
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          &copy; {new Date().getFullYear()} NICOLABO -にこラボ-. Learn Library.
        </footer>
      </div>
      <OnboardingGuide />
    </div>
  );
};

export default LearnPage;
