/** Cmd/Ctrl+K で開く教材内検索パレット。
 *  meta（title / description / tags / id）と章ラベルを対象にしたクライアント検索。
 *  依存追加なしの軽量スコアリング（全トークン AND 一致 → タイトル優先で並べる）。
 *  ヘッダーの検索ボタンは window イベント "nicotech:search-open" で開く。 */

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LEARN_ENTRIES } from "../../lib/learnRegistry";
import { DOMAIN_STYLES, getSectionLabel } from "../../lib/learnCategories";
import type { LearnDomain } from "../../lib/learnCategories";

interface Indexed {
  domain: LearnDomain;
  id: string;
  title: string;
  section: string;
  tags: string[];
  hay: string;
}

const INDEX: Indexed[] = LEARN_ENTRIES.map((e) => ({
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
            placeholder="記事を検索（タイトル・タグ・説明）"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onInputKey}
          />
          <kbd className="search-esc">Esc</kbd>
        </div>
        <ul className="search-results">
          {results.length === 0 && <li className="search-empty">「{query}」に一致する記事はありません</li>}
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
