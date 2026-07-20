import { Link } from "react-router-dom";

/** ヘッダー上段に出す短い説明文。 */
const TAGLINE = "座学と実務をつなぐ、情報工学科のための教材ライブラリ";

interface Props {
  /** 上段のタグラインを出すか（false でタイトルのみ） */
  tagline?: boolean;
}

/** タグライン＋等幅の「nicoTech」＋ターミナル風カーソルで構成するヘッダーロゴ。 */
const NicoTechLogo = ({ tagline = true }: Props) => (
  <Link to="/nicotech" className="nt-logo" aria-label="nicoTech ホームへ">
    {tagline && <span className="nt-tagline">{TAGLINE}</span>}
    <span className="nt-title" aria-hidden="true">
      <span className="nt-name">nico</span>
      <span className="nt-tech">Tech</span>
      <span className="nt-cursor" />
    </span>
  </Link>
);

export default NicoTechLogo;
