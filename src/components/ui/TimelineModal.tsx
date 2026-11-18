import React, { useState } from "react";
import { flushSync } from "react-dom";
import { Link } from "react-router-dom";
import type { PortfolioItem, TimelineItem, TimelineLink, TimelinePhoto } from "../../lib/dataMapper";
import { projectVtName } from "../../lib/projects";
import { TIMELINE_TYPE_LABEL, formatDuration, formatPeriod, linkLabel, timelineVtName } from "../../lib/timeline";
import Modal from "./Modal";
import ExternalIcon from "./ExternalIcon";

/** サイト内のリンクは View Transition 付きの → 、外部は新しいタブで開き、外部リンクの印を付ける */
const LinkItem: React.FC<{ link: TimelineLink; onNavigate?: () => void; className?: string }> = ({
  link,
  onNavigate,
  className = "text-[15px]",
}) =>
  link.url.startsWith("/") ? (
    <Link to={link.url} viewTransition onClick={onNavigate} className={`link-quiet ${className}`}>
      {linkLabel(link)} <span aria-hidden>→</span>
    </Link>
  ) : (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className={`link-quiet ${className}`}>
      {linkLabel(link)} <ExternalIcon />
    </a>
  );

/**
 * 写真の枠（16:10）。集合写真の頭が切れないよう、どの比率の写真も全体を収め、余りは同じ写真のぼかしで埋める。
 * 外部サイトの写真はリファラーを送らずに読む。読めなければ onError（枠ごと外す）。
 */
const PhotoFrame: React.FC<{ photo: TimelinePhoto; alt: string; eager?: boolean; onError: () => void; className?: string }> = ({
  photo,
  alt,
  eager,
  onError,
  className = "",
}) => (
  <div className={`relative aspect-[16/10] overflow-hidden ${className}`} style={{ background: "var(--bg)" }}>
    <img
      src={photo.src}
      alt=""
      aria-hidden
      referrerPolicy="no-referrer"
      className="absolute inset-0 h-full w-full scale-125 object-cover opacity-40 blur-2xl"
    />
    <img
      src={photo.src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={onError}
      className="relative h-full w-full object-contain"
    />
  </div>
);

/** 「写真: 出典」。出典の URL があればリンクにする */
const Credit: React.FC<{ credit: NonNullable<TimelineItem["photoCredit"]> }> = ({ credit }) => (
  <span>
    写真:{" "}
    {credit.url ? (
      <LinkItem link={{ label: credit.label, url: credit.url }} className="text-[13px]" />
    ) : (
      credit.label
    )}
  </span>
);

/**
 * Timeline の項目の詳細ポップアップ。見出しは一覧の項目のタイトルから View Transition でモーフする。
 * 期間（と長さ）・種別 → タイトル → 所属・主催 → 説明 → 詳しい説明 → 写真 → 技術 → リンクの順。
 * href が作品ページ（/projects/:id）なら、その作品のサムネイルを上に置き、リンクの先頭を「作品の詳細を見る」にする。
 * 作品が無く写真（images 列）があれば、1 枚目の写真をキャプションと出典付きで上に置き、残りを本文の後ろに並べる。
 * そのリンクを押した瞬間だけサムネイルに作品の画像の名前を付け、詳細ページの画像へモーフさせる
 * （一覧の WorkList 側は、ポップアップを開いている間その作品の名前を外している）。
 */
const TimelineModal: React.FC<{ item: TimelineItem; work?: PortfolioItem; onClose: () => void }> = ({
  item,
  work,
  onClose,
}) => {
  const [handoff, setHandoff] = useState(false);
  const [failed, setFailed] = useState<string[]>([]);
  const titleId = `timeline-modal-title-${timelineVtName(item.id)}`;
  const duration = formatDuration(item.start, item.end);
  const paragraphs = (item.detail ?? "").split(/\n+/).map((t) => t.trim()).filter(Boolean);
  const thumb = work?.thumbnail;
  const photos = item.photos.filter((p) => !failed.includes(p.src));
  const heroPhoto = thumb ? undefined : photos[0];
  const restPhotos = heroPhoto ? photos.slice(1) : photos;
  const hasHero = !!(thumb || heroPhoto);
  const credit = photos.length > 0 ? item.photoCredit : undefined;
  const altOf = (p: TimelinePhoto) => (p.caption ? "" : `${item.title}の写真`);
  const dropPhoto = (src: string) => () => setFailed((prev) => [...prev, src]);

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
      {heroPhoto && (
        <figure>
          <PhotoFrame photo={heroPhoto} alt={altOf(heroPhoto)} eager onError={dropPhoto(heroPhoto.src)} />
          {(heroPhoto.caption || credit) && (
            <figcaption
              className="flex flex-wrap gap-x-3 gap-y-1 px-6 pt-3 text-[13px] leading-relaxed sm:px-8"
              style={{ color: "var(--text-muted)" }}
            >
              {heroPhoto.caption && <span>{heroPhoto.caption}</span>}
              {credit && <Credit credit={credit} />}
            </figcaption>
          )}
        </figure>
      )}
      <div className={`px-6 pb-8 sm:px-8 ${hasHero ? "pt-6" : "pt-7 sm:pt-8"}`}>
        {/* 画像が無いときは右上の閉じるボタンに文字が掛からないよう右を空ける */}
        <p
          className={`text-[13px] tabular-nums tracking-wide ${hasHero ? "" : "pr-12"}`}
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
          className={`mt-2 text-[21px] font-semibold leading-snug sm:text-[23px] ${hasHero ? "" : "pr-10"}`}
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

        {restPhotos.length > 0 && (
          <div className="mt-7">
            <ul className={`grid gap-4 ${restPhotos.length > 1 ? "sm:grid-cols-2" : ""}`} aria-label="写真">
              {restPhotos.map((p) => (
                <li key={p.src}>
                  <figure>
                    <PhotoFrame
                      photo={p}
                      alt={altOf(p)}
                      onError={dropPhoto(p.src)}
                      className="rounded-lg border border-white/[0.08]"
                    />
                    {p.caption && (
                      <figcaption className="mt-2 text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                        {p.caption}
                      </figcaption>
                    )}
                  </figure>
                </li>
              ))}
            </ul>
            {credit && !heroPhoto && (
              <p className="mt-3 text-[13px]" style={{ color: "var(--text-muted)" }}>
                <Credit credit={credit} />
              </p>
            )}
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
