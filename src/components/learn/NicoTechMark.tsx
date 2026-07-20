/** nicoTech ロゴマーク（独立エンブレム）。
 *  フラワー・オブ・ライフ調のジオメトリ: 外円＋6つの重なり円のロゼッタ＋十字軸＋外周ドット。
 *  ブランドのティール線画。透過背景。
 *  ※ 現在ヘッダーでは使用していない（ヘッダーはタグライン＋四角囲みロゴのみ）。 */
const NicoTechMark = ({ size = 34 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    style={{ display: "block", flexShrink: 0 }}
  >
    {/* 十字軸（淡ティール） */}
    <g stroke="#8ed8cd" strokeWidth="0.9">
      <line x1="32" y1="2" x2="32" y2="62" />
      <line x1="2" y1="32" x2="62" y2="32" />
    </g>

    {/* 外円 */}
    <circle cx="32" cy="32" r="30" stroke="#22b0a0" strokeWidth="1.3" />

    {/* 6つの重なり円（ロゼッタ） */}
    <g stroke="#22b0a0" strokeWidth="1.15">
      <circle cx="32" cy="17" r="15" />
      <circle cx="19.01" cy="24.5" r="15" />
      <circle cx="19.01" cy="39.5" r="15" />
      <circle cx="32" cy="47" r="15" />
      <circle cx="44.99" cy="39.5" r="15" />
      <circle cx="44.99" cy="24.5" r="15" />
    </g>

    {/* 外周の交点ドット（濃ティール） */}
    <g fill="#0c8074">
      <circle cx="57.98" cy="32" r="1.9" />
      <circle cx="44.99" cy="9.5" r="1.9" />
      <circle cx="19.01" cy="9.5" r="1.9" />
      <circle cx="6.02" cy="32" r="1.9" />
      <circle cx="19.01" cy="54.5" r="1.9" />
      <circle cx="44.99" cy="54.5" r="1.9" />
    </g>
  </svg>
);

export default NicoTechMark;
