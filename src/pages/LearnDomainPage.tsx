import { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";

import LearnLayout from "../components/learn/LearnLayout";
import DomainNav from "../components/learn/DomainNav";
import {
  DOMAIN_STYLES,
  getSectionLabel,
  getLevelStyle,
  isLearnDomain,
} from "../lib/learnCategories";
import { getSectionedEntries, getEntry } from "../lib/learnRegistry";
import {
  getCourseProgress,
  getLastOpenedInDomain,
  isArticleDone,
  useProgressTick,
} from "../lib/learnProgress";

const CheckMark = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="15" height="15">
    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LearnDomainPage = () => {
  const { domain } = useParams<{ domain: string }>();
  useProgressTick();

  useEffect(() => {
    if (isLearnDomain(domain)) {
      document.title = `${DOMAIN_STYLES[domain].label} コース | nicoTech Learn`;
    }
    return () => { document.title = "nicoTech Learn"; };
  }, [domain]);

  if (!isLearnDomain(domain)) return <Navigate to="/learn" replace />;

  const style = DOMAIN_STYLES[domain];
  const groups = getSectionedEntries(domain);
  const progress = getCourseProgress(domain);

  // 「続きから読む」: このコースで最後に開いた記事（無ければ最初の記事）
  const lastId = getLastOpenedInDomain(domain);
  const lastEntry = lastId ? getEntry(domain, lastId) : undefined;
  const firstEntry = groups[0]?.entries[0];
  const resume = lastEntry ?? firstEntry;

  let counter = 0;

  return (
    <LearnLayout activeDomain={domain} sidebar={<DomainNav domain={domain} />}>
      {/* Course hero */}
      <div className="course-hero">
        <div className="ch-cover" style={{ borderColor: style.accent }}>
          <img src={style.cover} alt={`${style.label} コース`} />
        </div>
        <div className="ch-info">
          <span className="section-number">Course</span>
          <h1>{style.label}</h1>
          <p className="lead">{style.description}</p>
          {progress.total > 0 && (
            <div className="course-progress">
              <div className="cp-bar">
                <div className="cp-fill" style={{ width: `${progress.percent}%` }} />
              </div>
              <span className="cp-label">
                {progress.done}/{progress.total} 記事 完了（{progress.percent}%）
              </span>
            </div>
          )}
          {resume && (
            <div className="resume-row">
              <Link to={`/learn/${domain}/${resume.meta.id}`} className="btn-cta small">
                {lastEntry ? "続きから読む" : "コースを始める"}
              </Link>
              <span className="resume-title">{resume.meta.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Learning path */}
      {groups.length > 0 ? (
        groups.map((g) => (
          <div className="path-group" key={g.section}>
            <div className="sidebar-chapter path-chapter">{getSectionLabel(domain, g.section)}</div>
            <div className="path-list">
              {g.entries.map((e) => {
                counter += 1;
                const done = isArticleDone(domain, e.meta.id);
                const level = getLevelStyle(e.meta.level);
                return (
                  <Link
                    key={e.meta.id}
                    to={`/learn/${domain}/${e.meta.id}`}
                    className={`path-item${done ? " done" : ""}`}
                  >
                    <span className="path-num" style={done ? { background: style.accent, borderColor: style.accent } : undefined}>
                      {done ? <CheckMark /> : counter}
                    </span>
                    <span className="path-body">
                      <span className="path-title">{e.meta.title}</span>
                      <span className="path-desc">{e.meta.description}</span>
                      <span className="path-meta">
                        <span className={`level-badge level-${e.meta.level}`}>{level.label}</span>
                        {e.meta.minutes && <span className="path-time">約{e.meta.minutes}分</span>}
                        {done && <span className="path-done-tag">完了</span>}
                      </span>
                    </span>
                    <span className="path-go" aria-hidden>→</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))
      ) : (
        <div className="tip-box">
          このコースの記事はまだありません。<code>src/content/learn/{domain}/&lt;id&gt;.tsx</code> を追加すると自動で表示されます。
        </div>
      )}
    </LearnLayout>
  );
};

export default LearnDomainPage;
