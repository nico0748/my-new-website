import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { To } from "react-router-dom";
import { Tv } from "lucide-react";

/**
 * 横長（40:21 ≒ OGP 画像の比率）の枠に収めるサムネイル。
 * - 横長の画像（幅 / 高さ ≥ 1.5）は枠いっぱいに敷く
 * - 縦長・正方形の画像（公式 X のアイコンなど）は全体が見えるように収め、左右の余白は同じ画像をぼかして埋める
 * - 画像が読めなければ次の候補へ、すべて駄目なら静かなプレースホルダー
 * 比率は読み込んだ画像から判定し、URL ごとに覚えておく（ポップアップを開いた瞬間から同じ見え方にするため）。
 */
type Fit = "cover" | "contain";
const WIDE_RATIO = 1.5;
const fitCache = new Map<string, Fit>();
const failedCache = new Set<string>();

export const AnimeThumb: React.FC<{
  sources: (string | undefined)[];
  /** モーフ用の view-transition-name（一覧では開いた作品だけに付ける） */
  vtName?: string;
  eager?: boolean;
  className?: string;
}> = ({ sources, vtName, eager, className = "" }) => {
  const candidates = sources.filter((s): s is string => !!s);
  const [failed, setFailed] = useState<string[]>([]);
  const src = candidates.find((s) => !failed.includes(s) && !failedCache.has(s));
  const [fit, setFit] = useState<Fit | undefined>(() => (src ? fitCache.get(src) : undefined));
  const currentFit = (src && fitCache.get(src)) || fit || "cover";

  return (
    <div
      className={`vt-anime-img relative aspect-[40/21] w-full overflow-hidden ${className}`}
      style={{ background: "var(--surface)", viewTransitionName: vtName }}
    >
      {src ? (
        <>
          {currentFit === "contain" && (
            <img
              src={src}
              alt=""
              aria-hidden
              referrerPolicy="no-referrer"
              className="absolute inset-0 h-full w-full scale-125 object-cover opacity-50 blur-2xl"
            />
          )}
          <img
            key={src}
            src={src}
            alt=""
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={(e) => {
              const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
              if (!w || !h) return;
              const f: Fit = w / h >= WIDE_RATIO ? "cover" : "contain";
              fitCache.set(src, f);
              setFit(f);
            }}
            onError={() => {
              failedCache.add(src);
              setFailed((prev) => [...prev, src]);
            }}
            className={`relative h-full w-full ${currentFit === "contain" ? "object-contain" : "object-cover"}`}
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center" style={{ color: "var(--text-muted)" }} aria-hidden>
          <Tv size={26} strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
};

type CardLink =
  | {
      to: To;
      state?: unknown;
      /** 同じページの中でポップアップを開くときは true（スクロール位置を保つ） */
      samePage?: boolean;
      onOpen?: () => void;
    }
  | { href: string };

/**
 * アニメのカード（横長のサムネイル + タイトル + 補足）。
 * サイト内（ポップアップを開く）なら <Link viewTransition>、外部なら新しいタブ。
 */
const AnimeCard: React.FC<{
  id: string;
  title: string;
  sub?: React.ReactNode;
  sources: (string | undefined)[];
  /** 無ければリンクにしない */
  link?: CardLink;
  /** 画像・タイトルの view-transition-name（ポップアップとのモーフ用） */
  vtNames?: { img: string; title: string };
}> = ({ id, title, sub, sources, link, vtNames }) => {
  const cls =
    "group flex h-full flex-col overflow-hidden rounded-lg border border-white/[0.08] transition-colors duration-300 hover:border-white/[0.2]";
  const body = (
    <>
      <AnimeThumb sources={sources} vtName={vtNames?.img} />
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <span
          className="vt-anime-title line-clamp-2 self-start text-[15px] font-medium leading-snug"
          style={{ color: "var(--text-primary)", viewTransitionName: vtNames?.title }}
        >
          {title}
          {link && "href" in link && (
            <span aria-hidden className="ml-1.5 text-[13px]" style={{ color: "var(--text-muted)" }}>
              ↗
            </span>
          )}
        </span>
        {sub && (
          <span className="mt-auto truncate text-[13px] tracking-wide" style={{ color: "var(--text-secondary)" }}>
            {sub}
          </span>
        )}
      </div>
    </>
  );
  if (!link)
    return (
      <div className={cls} style={{ background: "var(--card-bg)" }}>
        {body}
      </div>
    );
  if ("href" in link)
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls} style={{ background: "var(--card-bg)" }}>
        {body}
      </a>
    );
  return (
    <Link
      to={link.to}
      state={link.state}
      viewTransition
      preventScrollReset={link.samePage}
      onClick={link.onOpen}
      data-anime-id={id}
      className={cls}
      style={{ background: "var(--card-bg)" }}
    >
      {body}
    </Link>
  );
};

export default AnimeCard;
