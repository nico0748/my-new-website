import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../../styles/works-article.css";

type TocItem = { id: string; no?: string; label: string };

/**
 * 記事テンプレートの外枠。本文（680px）と、lg 以上で右に固定される目次。
 * 目次は本文の `Section`（h2[data-toc]）から組み立てる。h3 は入れない（項目が多すぎて画面に収まらないため）。
 * スマホ・タブレットでは本文の先頭に折りたたみの目次を出す。
 */
const WorkArticle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<TocItem[]>([]);
  const [active, setActive] = useState<string | null>(null);

  // 本文が描画されたら見出しを拾う（本文は lazy で、この枠と同時にコミットされる）
  useLayoutEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const hs = Array.from(el.querySelectorAll<HTMLElement>("h2[data-toc]"));
    setItems(
      hs.map((h) => ({ id: h.id, no: h.dataset.no || undefined, label: h.dataset.toc || h.textContent || "" }))
    );
  }, []);

  // 現在地: 画面の上から 30% の線を最後に越えた見出し
  useEffect(() => {
    if (items.length === 0) return;
    const hs = items.map((i) => document.getElementById(i.id)).filter((h): h is HTMLElement => !!h);
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const h of hs) {
        if (h.getBoundingClientRect().top <= line) current = h.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  const activeIndex = items.findIndex((i) => i.id === active);

  return (
    <div className="work-layout">
      <div ref={bodyRef} className="work-article">
        {items.length > 1 && (
          <details className="work-toc-inline">
            <summary>目次</summary>
            <TocList items={items} active={active} />
          </details>
        )}
        {children}
      </div>

      {items.length > 1 && (
        <nav className="work-toc" aria-label="目次">
          <p className="work-toc-title">目次</p>
          <div className="work-toc-track">
            {/* 現在地の印（1px の線）。見出しの位置へ滑らせる */}
            <span
              aria-hidden
              className="work-toc-marker"
              style={{
                opacity: activeIndex >= 0 ? 1 : 0,
                transform: `translateY(calc(${Math.max(activeIndex, 0)} * var(--toc-row)))`,
              }}
            />
            <TocList items={items} active={active} />
          </div>
        </nav>
      )}
    </div>
  );
};

const TocList: React.FC<{ items: TocItem[]; active: string | null }> = ({ items, active }) => (
  <ol className="work-toc-list">
    {items.map((i) => (
      <li key={i.id}>
        <a
          href={`#${i.id}`}
          aria-current={i.id === active ? "location" : undefined}
          onClick={(e) => {
            const target = document.getElementById(i.id);
            if (!target) return;
            e.preventDefault();
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
            history.replaceState(history.state, "", `#${i.id}`);
          }}
        >
          {i.no && <span className="work-toc-no">{i.no}</span>}
          <span className="work-toc-label">{i.label}</span>
        </a>
      </li>
    ))}
  </ol>
);

export default WorkArticle;
