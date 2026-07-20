import { Link, useLocation } from "react-router-dom";
import type { CSSProperties } from "react";

/** ヘッダー2段目のタブ。セクション（教材／経験録）ごとにページを切り替える。 */
interface TabDef {
  /** 主ラベル（英字・広い字間で表示） */
  label: string;
  /** 補助ラベル（日本語・英字の下に小さく表示） */
  sub: string;
  path: string;
  /** タブ固有のアクセント色（選択時はこの色のベタ塗りになる） */
  color: string;
}

/* 色はヘッダー帯のティール（#00707d）と分けたネイビー／スレート系。
   タブ同士は明度差だけの近い色にして、2つで1つのまとまりに見せる。 */
const NT_TABS: TabDef[] = [
  { label: "TECH LIBRARY", sub: "教材", path: "/nicotech", color: "#2c3e5c" },
  { label: "TRACK RECORD", sub: "経験録", path: "/nicotech/experience", color: "#47617f" },
];

const EXPERIENCE_PREFIX = "/nicotech/experience";

/** 経験録配下なら「経験録」、それ以外の /nicotech 配下はすべて「教材」を選択状態にする。 */
const isTabActive = (pathname: string, path: string) => {
  const onExperience = pathname.startsWith(EXPERIENCE_PREFIX);
  return path === EXPERIENCE_PREFIX ? onExperience : !onExperience;
};

const NicoTechTabs = () => {
  const { pathname } = useLocation();
  // 下の帯は選択中タブと同じ色にして、タブと地続きに見せる
  const activeTab = NT_TABS.find((t) => isTabActive(pathname, t.path)) ?? NT_TABS[0];

  return (
    <nav
      className="nt-tabs"
      aria-label="セクション"
      style={{ "--active-color": activeTab.color } as CSSProperties}
    >
      {NT_TABS.map((t) => {
        const active = isTabActive(pathname, t.path);
        return (
          <Link
            key={t.path}
            to={t.path}
            className={`nt-tab${active ? " active" : ""}`}
            style={{ "--tab-color": t.color } as CSSProperties}
            aria-current={active ? "page" : undefined}
          >
            <span className="nt-tab-en">{t.label}</span>
            <span className="nt-tab-ja">{t.sub}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default NicoTechTabs;
