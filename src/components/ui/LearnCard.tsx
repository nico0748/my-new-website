import { Link } from "react-router-dom";
import type { LearnMeta } from "../../lib/learnCategories";
import { getLevelStyle } from "../../lib/learnCategories";

interface Props {
  meta: LearnMeta;
  /** 章内の連番 */
  index?: number;
}

/** 分野ページの記事一覧アイテム（Docs 調）。 */
const LearnCard = ({ meta, index }: Props) => {
  const level = getLevelStyle(meta.level);
  return (
    <Link to={`/learn/${meta.domain}/${meta.id}`} className="article-item">
      {typeof index === "number" && <span className="ai-num">{String(index).padStart(2, "0")}</span>}
      <span className="ai-body">
        <span className="ai-title">{meta.title}</span>
        <span className="ai-desc">{meta.description}</span>
      </span>
      <span className={`ai-level level-badge level-${meta.level}`}>{level.label}</span>
    </Link>
  );
};

export default LearnCard;
