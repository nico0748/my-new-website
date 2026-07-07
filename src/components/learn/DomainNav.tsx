import { Link } from "react-router-dom";
import type { LearnDomain } from "../../lib/learnCategories";
import { getSectionLabel } from "../../lib/learnCategories";
import { getSectionedEntries } from "../../lib/learnRegistry";
import { isArticleDone, useProgressTick } from "../../lib/learnProgress";

interface Props {
  domain: LearnDomain;
  /** 現在表示中の記事 id（詳細ページで active 表示） */
  activeId?: string;
}

const DoneMark = () => (
  <svg className="nav-done" viewBox="0 0 16 16" fill="none" aria-label="読了" role="img">
    <circle cx="8" cy="8" r="8" fill="currentColor" />
    <path d="M4.5 8.2l2.2 2.2 4.8-5.2" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** サイドバー用: 分野内の章＋記事リスト。章は区切りラベルで表示。
 *  読了した記事には完了マークを表示（nicotech:done）。 */
const DomainNav = ({ domain, activeId }: Props) => {
  const groups = getSectionedEntries(domain);
  useProgressTick(); // 進捗変化で再描画

  return (
    <nav aria-label="教材ナビゲーション">
      {groups.map((g) => (
        <div key={g.section}>
          <div className="sidebar-chapter">{getSectionLabel(domain, g.section)}</div>
          <ul className="sidebar-nav">
            {g.entries.map((e) => {
              const done = isArticleDone(domain, e.meta.id);
              return (
                <li key={e.meta.id}>
                  <Link
                    to={`/nicotech/${domain}/${e.meta.id}`}
                    className={`nav-item${activeId === e.meta.id ? " active" : ""}${done ? " done" : ""}`}
                  >
                    <span className="nav-mark">{done && <DoneMark />}</span>
                    <span className="nav-title">{e.meta.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default DomainNav;
