import React, { useEffect, useLayoutEffect, useRef } from "react";
import { X } from "lucide-react";
import type { AnimeWork } from "../../lib/dataMapper";
import { ANIME_STATUS_LABEL, animeVtName, annictWorkUrl } from "../../lib/anime";
import { AnimeThumb } from "./AnimeCard";

/** 詳細の 1 行（値が無ければ出さない）。 */
const Row: React.FC<{ label: string; children?: React.ReactNode }> = ({ label, children }) =>
  children ? (
    <div className="grid grid-cols-[6.5rem_1fr] gap-4 py-3 sm:grid-cols-[8rem_1fr]">
      <dt className="text-[13px] tracking-wide" style={{ color: "var(--text-muted)" }}>
        {label}
      </dt>
      <dd className="text-[15px] leading-relaxed" style={{ color: "var(--text-body)" }}>
        {children}
      </dd>
    </div>
  ) : null;

const ExternalLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="link-quiet text-[15px]">
    {children} <span aria-hidden>↗</span>
  </a>
);

/**
 * アニメの詳細ポップアップ。画像とタイトルは一覧のカードから View Transition でモーフする
 * （Works の一覧 → 詳細と同じ view-transition-class）。背景とパネルは別名で、開閉時に背景は暗転・パネルは下から浮かぶ。
 * Esc・背景のクリック・閉じるボタンで閉じる。開いている間はページのスクロールを止める。
 */
const AnimeModal: React.FC<{ work: AnimeWork; onClose: () => void }> = ({ work, onClose }) => {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  useLayoutEffect(() => {
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const facts = [
    work.season,
    work.media,
    work.episodes ? `全${work.episodes}話` : undefined,
  ].filter(Boolean);
  const titleId = `anime-modal-title-${work.id}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="absolute inset-0"
        style={{ background: "var(--overlay)", viewTransitionName: "anime-backdrop" }}
        onClick={onClose}
        aria-hidden
      />
      <div
        className="relative flex max-h-[calc(100dvh-1.5rem)] w-full max-w-[720px] flex-col overflow-hidden rounded-xl border border-white/[0.1] sm:max-h-[calc(100dvh-4rem)]"
        style={{ background: "var(--surface)", viewTransitionName: "anime-panel" }}
      >
        <div className="overflow-y-auto">
          <AnimeThumb sources={[work.image, work.avatar]} vtName={animeVtName("img", work.id)} eager />
          <div className="px-6 pb-8 pt-6 sm:px-8">
            <p className="text-[13px] tracking-wide" style={{ color: "var(--text-secondary)" }}>
              {ANIME_STATUS_LABEL[work.status]}
              {facts.length > 0 && <span aria-hidden className="mx-2">·</span>}
              {facts.join(" · ")}
            </p>
            <h2 id={titleId} className="mt-2 text-[21px] font-semibold leading-snug sm:text-[23px]">
              <span
                className="vt-anime-title"
                style={{ color: "var(--text-primary)", viewTransitionName: animeVtName("title", work.id) }}
              >
                {work.title}
              </span>
            </h2>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {work.url && <ExternalLink href={work.url}>公式サイト</ExternalLink>}
              <ExternalLink href={annictWorkUrl(work.id)}>Annict</ExternalLink>
              {work.wikipediaUrl && <ExternalLink href={work.wikipediaUrl}>Wikipedia</ExternalLink>}
              {work.hashtag && (
                <ExternalLink href={`https://x.com/hashtag/${encodeURIComponent(work.hashtag)}`}>#{work.hashtag}</ExternalLink>
              )}
            </div>

            <dl className="mt-6 divide-y divide-white/[0.08]">
              <Row label="原作">{work.original}</Row>
              <Row label="監督">{work.director}</Row>
              <Row label="アニメーション制作">{work.studio}</Row>
              <Row label="キャスト">
                {work.cast.length > 0 && (
                  <ul className="flex flex-col gap-1">
                    {work.cast.map((c, i) => (
                      <li key={i}>
                        {c.character && (
                          <span style={{ color: "var(--text-secondary)" }}>
                            {c.character}
                            <span aria-hidden className="mx-1.5">
                              ·
                            </span>
                          </span>
                        )}
                        {c.actor}
                      </li>
                    ))}
                  </ul>
                )}
              </Row>
              <Row label="Annict">
                {work.watchers ? `${work.watchers.toLocaleString("ja-JP")} 人が記録` : undefined}
              </Row>
            </dl>
          </div>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="閉じる"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full opacity-90 transition-opacity hover:opacity-100"
          style={{ background: "var(--overlay)", color: "var(--text-primary)" }}
        >
          <X size={18} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
};

export default AnimeModal;
