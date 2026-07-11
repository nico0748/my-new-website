/** 技術スタック解説の右ドロワー（「技術スタック一覧」コース専用）。
 *  記事内の <Tech id="react">React</Tech> をクリックすると、右から解説パネルが出る。
 *
 *  - TechStackProvider: 選択状態を持ち、ドロワーとオーバーレイを描画する
 *  - useTechStack:      子孫から openTech(id) を呼ぶためのフック
 *  - Tech:              本文中のインラインの技術名（クリック可能なチップ）
 *
 *  ⚠️ すべて .learn-docs 配下のクラス（src/styles/learn.css）に対応。絵文字は使わない。 */

import React, { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { getTech, getAutoLinkMatches } from "../../lib/techStacks";

/* ── 自動リンク: 辞書の技術名（name + aliases）を本文中で拾ってクリック可能にする ── */
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** 一致文字列（小文字）→ id の対応表 */
const buildMatchMap = (): Map<string, string> => {
  const map = new Map<string, string>();
  for (const m of getAutoLinkMatches()) {
    const key = m.text.toLowerCase();
    if (!map.has(key)) map.set(key, m.id);
  }
  return map;
};

/** 長いもの優先の正規表現（英数字の境界で囲み、部分一致を防ぐ）。失敗時は null。 */
const buildAutoRegex = (): RegExp | null => {
  const alts = getAutoLinkMatches().map((m) => escapeRegExp(m.text));
  if (alts.length === 0) return null;
  try {
    return new RegExp(`(?<![A-Za-z0-9])(?:${alts.join("|")})(?![A-Za-z0-9])`, "gi");
  } catch {
    return null; // lookbehind 非対応環境では自動リンクを無効化（手動 <Tech> は動く）
  }
};

// flex ベースの UI（要点・見出し等）は分割するとレイアウトが崩れるので除外する
const SKIP_SELECTOR =
  "code, pre, a, button, h1, h2, h3, h4, kbd, .tech-term, .tech-drawer, .keypoints, .callout-title, .keypoints-title, .step-title, .section-number";

/** root 配下のテキストノードを走査し、既知の技術名を <button.tech-term data-tech-id> に置換する。 */
const linkifyContainer = (root: HTMLElement, regex: RegExp, matchMap: Map<string, string>) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = (node as Text).parentElement;
      if (!parent || parent.closest(SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT;
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  const targets: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) targets.push(node as Text);

  for (const textNode of targets) {
    const text = textNode.nodeValue ?? "";
    regex.lastIndex = 0;
    if (!regex.test(text)) continue;
    regex.lastIndex = 0;
    const frag = document.createDocumentFragment();
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(text))) {
      const matched = m[0];
      const id = matchMap.get(matched.toLowerCase());
      if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
      if (id) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "tech-term";
        btn.dataset.techId = id;
        btn.setAttribute("aria-label", `${matched} の解説を開く`);
        btn.textContent = matched;
        frag.appendChild(btn);
      } else {
        frag.appendChild(document.createTextNode(matched));
      }
      last = m.index + matched.length;
      if (matched.length === 0) regex.lastIndex++;
    }
    if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
    textNode.parentNode?.replaceChild(frag, textNode);
  }
};

interface TechStackCtx {
  openTech: (id: string) => void;
}
const Ctx = createContext<TechStackCtx | null>(null);

// context フックをプロバイダ・コンポーネントと同居させる設計のため fast-refresh ルールを無効化
// eslint-disable-next-line react-refresh/only-export-components
export const useTechStack = (): TechStackCtx =>
  useContext(Ctx) ?? { openTech: () => {} };

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const Drawer: React.FC<{ id: string; onClose: () => void; onOpen: (id: string) => void }> = ({
  id,
  onClose,
  onOpen,
}) => {
  const entry = getTech(id);

  // Esc で閉じる
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <div className="tech-drawer-overlay" onClick={onClose} />
      <aside className="tech-drawer" role="dialog" aria-modal="true" aria-label={entry ? `${entry.name} の解説` : "技術解説"}>
        <div className="tech-drawer-head">
          <span className="tech-drawer-eyebrow">技術スタック解説</span>
          <button className="tech-drawer-close" onClick={onClose} aria-label="閉じる">
            <CloseIcon />
          </button>
        </div>

        {entry ? (
          <div className="tech-drawer-body">
            <span className="tech-drawer-cat">{entry.category}</span>
            <h3 className="tech-drawer-name">{entry.name}</h3>
            <p className="tech-drawer-summary">{entry.summary}</p>

            <div className="tech-drawer-section">
              <h4>具体的にできること</h4>
              <ul>
                {entry.canDo.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>

            <div className="tech-drawer-section">
              <h4>どんな状況で採用されるか</h4>
              <ul>
                {entry.whenAdopted.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>

            {entry.usedBy && entry.usedBy.length > 0 && (
              <div className="tech-drawer-section">
                <h4>採用している有名プロダクト</h4>
                <div className="tech-usedby">
                  {entry.usedBy.map((u, i) => (
                    <span key={i} className="tech-usedby-chip">{u}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="tech-drawer-section">
              <h4>近い技術との比較</h4>
              <ul className="tech-related">
                {entry.related.map((r, i) => (
                  <li key={i}>
                    {r.id && getTech(r.id) ? (
                      <button className="tech-related-link" onClick={() => onOpen(r.id!)}>
                        <span className="tech-related-name">{r.name}</span>
                        <ArrowIcon />
                      </button>
                    ) : (
                      <span className="tech-related-name plain">{r.name}</span>
                    )}
                    <span className="tech-related-note">{r.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="tech-drawer-body">
            <p className="tech-drawer-summary">解説が見つかりませんでした。</p>
          </div>
        )}
      </aside>
    </>
  );
};

export const TechStackProvider: React.FC<{ children: ReactNode; autoLink?: boolean }> = ({
  children,
  autoLink = false,
}) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const openTech = useCallback((id: string) => setOpenId(id), []);
  const close = useCallback(() => setOpenId(null), []);
  const rootRef = useRef<HTMLDivElement>(null);

  // 本文をスキャンして技術名を自動リンク化（stack コースのみ）
  useEffect(() => {
    if (!autoLink) return;
    const root = rootRef.current;
    if (!root) return;
    const regex = buildAutoRegex();
    if (!regex) return;
    const matchMap = buildMatchMap();

    let scheduled = 0;
    const observer = new MutationObserver(() => {
      window.clearTimeout(scheduled);
      scheduled = window.setTimeout(run, 80);
    });
    function run() {
      observer.disconnect();
      try {
        linkifyContainer(root!, regex!, matchMap);
      } finally {
        observer.observe(root!, { childList: true, subtree: true });
      }
    }
    run(); // 初回（Suspense 解決後は MutationObserver が拾う）

    return () => {
      observer.disconnect();
      window.clearTimeout(scheduled);
    };
  }, [autoLink]);

  // 自動生成ボタン（data-tech-id）のクリックを委譲で処理
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const btn = target?.closest<HTMLElement>(".tech-term[data-tech-id]");
      if (btn && root.contains(btn)) {
        e.preventDefault();
        openTech(btn.dataset.techId!);
      }
    };
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [openTech]);

  return (
    <Ctx.Provider value={{ openTech }}>
      <div className="tech-scope" ref={rootRef}>
        {children}
      </div>
      {openId && <Drawer id={openId} onClose={close} onOpen={openTech} />}
    </Ctx.Provider>
  );
};

/** 本文中のインライン技術名。id が解説データにあればクリック可能なチップになる。 */
export const Tech: React.FC<{ id: string; children?: ReactNode }> = ({ id, children }) => {
  const { openTech } = useTechStack();
  const entry = getTech(id);
  const label = children ?? entry?.name ?? id;
  if (!entry) return <>{label}</>;
  return (
    <button
      type="button"
      className="tech-term"
      onClick={() => openTech(id)}
      aria-label={`${entry.name} の解説を開く`}
    >
      {label}
    </button>
  );
};
