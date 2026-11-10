import React, { useState } from "react";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";
import type { PortfolioItem, TimelineItem, TimelineLink } from "../../lib/dataMapper";
import { projectVtName } from "../../lib/projects";
import { TIMELINE_TYPE_LABEL, formatDuration, formatPeriod, linkLabel, timelineVtName } from "../../lib/timeline";
import Modal from "./Modal";

/** サイト内のリンクは View Transition 付きの → 、外部は新しいタブで ↗ */
const LinkItem: React.FC<{ link: TimelineLink; onNavigate?: () => void }> = ({ link, onNavigate }) =>
  link.url.startsWith("/") ? (
    <Link to={link.url} viewTransition onClick={onNavigate} className="link-quiet text-[15px]">
      {linkLabel(link)} <span aria-hidden>→</span>
    </Link>
  ) : (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className="link-quiet text-[15px]">
      {linkLabel(link)} <span aria-hidden>↗</span>
    </a>
  );

/**
 * Timeline の項目の詳細ポップアップ。見出しは一覧の項目のタイトルから View Transition でモーフする。
 * 期間（と長さ）・種別 → タイトル → 所属・主催 → 説明 → 詳しい説明 → 技術 → リンクの順。
 * href が作品ページ（/projects/:id）なら、その作品のサムネイルを上に置き、リンクの先頭を「作品の詳細を見る」にする。
 * そのリンクを押した瞬間だけサムネイルに作品の画像の名前を付け、詳細ページの画像へモーフさせる
 * （一覧の WorkList 側は、ポップアップを開いている間その作品の名前を外している）。
 */
const TimelineModal: React.FC<{ item: TimelineItem; work?: PortfolioItem; onClose: () => void }> = ({
  item,
  work,
  onClose,
}) => {
  const [handoff, setHandoff] = useState(false);
  const titleId = `timeline-modal-title-${timelineVtName(item.id)}`;
  const duration = formatDuration(item.start, item.end);
  const paragraphs = (item.detail ?? "").split(/\n+/).map((t) => t.trim()).filter(Boolean);
  const thumb = work?.thumbnail;

  // リンク: 作品ページ（または href）→ links 列の順。同じ URL は 1 回だけ
  const primary: TimelineLink | null = work
    ? { label: "作品の詳細を見る", url: `/projects/${work.id}` }
    : item.href
      ? { label: item.href.startsWith("/") ? "詳しく見る" : "", url: item.href }
      : null;
  const links = [primary, ...item.links].filter(
    (l, i, all): l is TimelineLink => !!l && all.findIndex((o) => o?.url === l.url) === i,
  );

  return (
    <Modal labelledBy={titleId} onClose={onClose}>
      {thumb && (
        <div className="relative aspect-[16/10] overflow-hidden" style={{ background: "var(--bg)" }}>
          <img
            src={thumb}
            alt=""
            className={`h-full w-full object-cover${handoff ? " vt-project-img" : ""}`}
            style={{ viewTransitionName: handoff && work ? projectVtName("img", work.id) : undefined }}
          />
        </div>
      )}
      <div className={`px-6 pb-8 sm:px-8 ${thumb ? "pt-6" : "pt-7 sm:pt-8"}`}>
        {/* 画像が無いときは右上の閉じるボタンに文字が掛からないよう右を空ける */}
        <p
          className={`text-[13px] tabular-nums tracking-wide ${thumb ? "" : "pr-12"}`}
          style={{ color: "var(--text-secondary)" }}
        >
          {formatPeriod(item.start, item.end)}
          {duration && <span style={{ color: "var(--text-muted)" }}>（{duration}）</span>}
          <span aria-hidden className="mx-2">
            ·
          </span>
          {TIMELINE_TYPE_LABEL[item.type] ?? TIMELINE_TYPE_LABEL.other}
          {item.status === "upcoming" && <span className="ml-2">（予定）</span>}
        </p>
        <h2
          id={titleId}
          className={`mt-2 text-[21px] font-semibold leading-snug sm:text-[23px] ${thumb ? "" : "pr-10"}`}
        >
          <span
            className="vt-timeline-title"
            style={{ color: "var(--text-primary)", viewTransitionName: timelineVtName(item.id) }}
          >
            {item.title}
          </span>
        </h2>
        {item.org && (
          <p className="mt-2 text-[15px]" style={{ color: "var(--text-secondary)" }}>
            {item.org}
          </p>
        )}

        {item.description && (
          <p className="mt-5 text-[16px] leading-[1.95]" style={{ color: "var(--text-body)" }}>
            {item.description}
          </p>
        )}
        {paragraphs.length > 0 && (
          <div className="mt-4 flex flex-col gap-4">
            {paragraphs.map((t, i) => (
              <p key={i} className="text-[15px] leading-[2]" style={{ color: "var(--text-body)" }}>
                {t}
              </p>
            ))}
          </div>
        )}

        {item.tags.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="技術・分野">
            {item.tags.map((t) => (
              <li
                key={t}
                className="rounded px-2.5 py-1 text-[13px]"
                style={{ color: "var(--text-body)", border: "1px solid var(--border-color)" }}
              >
                {t}
              </li>
            ))}
          </ul>
        )}

        {links.length > 0 && (
          <div className="mt-7 border-t pt-5" style={{ borderColor: "var(--border-color)" }}>
            <ul className="flex flex-wrap gap-x-6 gap-y-2.5">
              {links.map((l) => (
                <li key={l.url}>
                  <LinkItem
                    link={l}
                    onNavigate={
                      work && l.url === `/projects/${work.id}` && thumb
                        ? () => flushSync(() => setHandoff(true))
                        : undefined
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TimelineModal;
