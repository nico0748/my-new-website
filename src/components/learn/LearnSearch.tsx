/** Cmd/Ctrl+K で開く教材内検索パレット。
 *  meta（title / description / tags / id）と章ラベルを対象にしたクライアント検索。
 *  依存追加なしの軽量スコアリング（全トークン AND 一致 → タイトル優先で並べる）。
 *  ヘッダーの検索ボタンは window イベント "nicotech:search-open" で開く。 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LEARN_ENTRIES } from "../../lib/learnRegistry";
import { DOMAIN_STYLES, getSectionLabel, isDomainVisible } from "../../lib/learnCategories";
import type { LearnDomain } from "../../lib/learnCategories";
import { IT_TERMS } from "../../lib/itTerms";
import type { ItTerm } from "../../lib/itTerms";

interface Indexed {
  domain: LearnDomain;
  id: string;
  title: string;
  section: string;
  tags: string[];
  hay: string;
}

/** IT用語の検索結果（見出し語＋意味をその場に表示する） */
interface TermHit extends ItTerm {
  /** 遷移先の記事 id（it-terms の章キーに対応する記事） */
  articleId: string;
}

/** it-terms の章キー → 記事 id の対応（用語カードのリンク先） */
const TERM_ARTICLE_BY_SECTION: Record<string, string> = Object.fromEntries(
  LEARN_ENTRIES.filter((e) => e.meta.domain === "it-terms").map((e) => [e.meta.section, e.meta.id])
);

const TERM_INDEX: TermHit[] = isDomainVisible("it-terms")
  ? IT_TERMS.map((t) => ({
      ...t,
      articleId: TERM_ARTICLE_BY_SECTION[t.section] ?? "it-intro",
    }))
  : [];

/** 用語検索：見出し語の一致を最優先し、英語表記・意味も対象にする */
function runTermSearch(q: string): TermHit[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const scored: { it: TermHit; score: number }[] = [];
  for (const it of TERM_INDEX) {
    const term = it.term.toLowerCase();
    const en = it.en.toLowerCase();
    let score = 0;
    if (term === query) score = 100;
    else if (term.startsWith(query)) score = 60;
    else if (term.includes(query)) score = 40;
    else if (en && (en === query || en.startsWith(query))) score = 35;
    else if (en.includes(query)) score = 20;
    else if (it.desc.toLowerCase().includes(query)) score = 8;
    if (score > 0) scored.push({ it, score });
  }
  scored.sort((a, b) => b.score - a.score || a.it.term.localeCompare(b.it.term, "ja"));
  return scored.slice(0, 6).map((s) => s.it);
}

// 本番で未公開のコースは検索結果にも出さない
const INDEX: Indexed[] = LEARN_ENTRIES.filter((e) => isDomainVisible(e.meta.domain)).map((e) => ({
  domain: e.meta.domain,
  id: e.meta.id,
  title: e.meta.title,
  section: getSectionLabel(e.meta.domain, e.meta.section),
  tags: e.meta.tags,
  hay: `${e.meta.title} ${e.meta.description} ${e.meta.tags.join(" ")} ${e.meta.id}`.toLowerCase(),
}));

function runSearch(q: string): Indexed[] {
  const query = q.trim().toLowerCase();
  if (!query) return INDEX.slice(0, 8);
  const tokens = query.split(/\s+/);
  const scored: { it: Indexed; score: number }[] = [];
  for (const it of INDEX) {
    const title = it.title.toLowerCase();
    let score = 0;
    let ok = true;
    for (const tk of tokens) {
      if (!it.hay.includes(tk)) { ok = false; break; }
      if (title.startsWith(tk)) score += 5;
      else if (title.includes(tk)) score += 3;
      else if (it.tags.some((t) => t.toLowerCase().includes(tk))) score += 2;
      else score += 1;
    }
    if (ok) scored.push({ it, score });
  }
  scored.sort((a, b) => b.score - a.score || a.it.title.localeCompare(b.it.title, "ja"));
  return scored.slice(0, 12).map((s) => s.it);
}

const LearnSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => runSearch(query), [query]);
  const terms = useMemo(() => runTermSearch(query), [query]);

  // 開閉ショートカット（Cmd/Ctrl+K）とヘッダーボタンからのイベント
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("nicotech:search-open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("nicotech:search-open", onOpen);
    };
  }, []);

  // 開いたらフォーカス、閉じたらリセット
  useEffect(() => {
    if (open) {
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const go = (it: Indexed) => {
    setOpen(false);
    navigate(`/nicotech/${it.domain}/${it.id}`);
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") { e.preventDefault(); setActive((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); go(results[active]); }
  };

  return (
    <div className="search-overlay" onClick={() => setOpen(false)}>
      <div className="search-palette" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="教材内を検索">
        <div className="search-input-row">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            className="search-input"
            placeholder="記事・IT用語を検索（例: API を叩く / ランサムウェア）"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
          />
          <kbd className="search-esc">Esc</kbd>
        </div>

        {terms.length > 0 && (
          <div className="search-terms">
            <div className="search-terms-head">IT用語</div>
            {terms.map((t) => (
              <button
                key={`${t.section}/${t.term}`}
                className="term-card"
                onClick={() => { setOpen(false); navigate(`/nicotech/it-terms/${t.articleId}`); }}
              >
                <span className="term-card-head">
                  <span className="term-card-term">{t.term}</span>
                  {t.en && <span className="term-card-en">{t.en}</span>}
                </span>
                <span className="term-card-desc">{t.desc}</span>
                <span className="term-card-meta">{getSectionLabel("it-terms", t.section)}</span>
              </button>
            ))}
          </div>
        )}

        <ul className="search-results">
          {results.length === 0 && terms.length === 0 && (
            <li className="search-empty">「{query}」に一致する記事・用語はありません</li>
          )}
          {results.map((it, i) => (
            <li key={`${it.domain}/${it.id}`}>
              <button
                className={`search-result ${i === active ? "active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(it)}
              >
                <span className="sr-badge" style={{ background: DOMAIN_STYLES[it.domain].accent }}>
                  {DOMAIN_STYLES[it.domain].label}
                </span>
                <span className="sr-text">
                  <span className="sr-title">{it.title}</span>
                  <span className="sr-section">{it.section}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
        <div className="search-hint">
          <span><kbd>↑</kbd><kbd>↓</kbd> 移動</span>
          <span><kbd>Enter</kbd> 開く</span>
          <span><kbd>Esc</kbd> 閉じる</span>
        </div>
      </div>
    </div>
  );
};

export default LearnSearch;
