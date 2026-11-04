import React, { useState } from "react";
import { Music2, Package, Ticket, Tv } from "lucide-react";
import type { OffHoursCategory, OffHoursItem } from "../../lib/dataMapper";
import { OFF_HOURS_LABEL, OFF_HOURS_ORDER } from "../../lib/offHours";
import type { SpotifyTrack } from "../../lib/spotify";
import Reveal from "./Reveal";

const SPOTIFY_ICON =
  "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z";

const ICON: Record<OffHoursCategory, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  anime: Tv,
  music: Music2,
  event: Ticket,
  indie: Package,
};

/** "2026-10-12" → イベントは "2026.10.12"、それ以外は年月だけの "2026.10" */
const formatDate = (category: OffHoursCategory, date: string) =>
  (category === "event" ? date : date.slice(0, 7)).replace(/-/g, ".");

/** 56px 角のサムネイル。画像が無い / 読み込めないときはカテゴリのピクトグラム。 */
const Thumb: React.FC<{ category: OffHoursCategory; image?: string | null }> = ({ category, image }) => {
  const [failed, setFailed] = useState(false);
  const Icon = ICON[category];
  return (
    <span
      className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md"
      style={{ background: "var(--surface)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}
    >
      {image && !failed ? (
        <img
          src={image}
          alt=""
          width={56}
          height={56}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <Icon size={20} strokeWidth={1.75} />
      )}
    </span>
  );
};

const Row: React.FC<{ item: OffHoursItem }> = ({ item }) => (
  <li className="flex items-start gap-4">
    <Thumb category={item.category} image={item.image} />
    <div className="min-w-0 pt-0.5">
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="row-link line-clamp-2 text-[16px] leading-snug"
          style={{ color: "var(--text-primary)" }}
        >
          <span className="row-title">{item.title}</span>{" "}
          <span aria-hidden className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            ↗
          </span>
        </a>
      ) : (
        <p className="line-clamp-2 text-[16px] leading-snug" style={{ color: "var(--text-primary)" }}>
          {item.title}
        </p>
      )}
      <p className="mt-1 truncate text-[13px] tabular-nums tracking-wide" style={{ color: "var(--text-secondary)" }}>
        <time dateTime={item.date}>{formatDate(item.category, item.date)}</time>
        {item.subtitle && (
          <>
            <span className="mx-2" aria-hidden>
              ·
            </span>
            {item.subtitle}
          </>
        )}
      </p>
    </div>
  </li>
);

/** Spotify の曲。ジャケットは 1:1 のまま（切り抜かない・上に重ねない）、Spotify の曲ページへリンクする。 */
const TrackRow: React.FC<{ track: SpotifyTrack }> = ({ track }) => (
  <li className="flex items-start gap-4">
    <Thumb category="music" image={track.image} />
    <div className="min-w-0 pt-0.5">
      <a
        href={track.url}
        target="_blank"
        rel="noopener noreferrer"
        className="row-link line-clamp-2 text-[16px] leading-snug"
        style={{ color: "var(--text-primary)" }}
      >
        <span className="row-title">{track.title}</span>{" "}
        <span aria-hidden className="text-[13px]" style={{ color: "var(--text-muted)" }}>
          ↗
        </span>
      </a>
      {track.artists && (
        <p className="mt-1 truncate text-[13px] tracking-wide" style={{ color: "var(--text-secondary)" }}>
          {track.artists}
        </p>
      )}
    </div>
  </li>
);

/** 音楽の箱の下段: 直近 4 週間によく聴いている曲（Spotify から 1 日 1 回取得）。 */
const SpotifyTop: React.FC<{ tracks: SpotifyTrack[]; divided: boolean }> = ({ tracks, divided }) => (
  <div className={divided ? "mt-6 pt-6 border-t" : "mt-5"} style={{ borderColor: "var(--border-color)" }}>
    <p className="flex items-center gap-2 text-[13px] tracking-wide" style={{ color: "var(--text-secondary)" }}>
      最近よく聴いている
      <span aria-hidden>·</span>
      <a
        href="https://open.spotify.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="link-quiet inline-flex items-center gap-1.5"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden style={{ color: "var(--brand-spotify)" }} fill="currentColor">
          <path d={SPOTIFY_ICON} />
        </svg>
        Spotify
      </a>
    </p>
    <ul className="mt-4 flex flex-col gap-5">
      {tracks.map((t) => (
        <TrackRow key={t.url} track={t} />
      ))}
    </ul>
  </div>
);

/**
 * 趣味の記録（OFF-HOURS）。カテゴリごとの箱に新しい順で数件ずつ並べる。
 * 記録が 1 件も無いカテゴリの箱は出さない（音楽は Spotify の曲があれば出す）。
 */
const OffHoursBoard: React.FC<{ items: OffHoursItem[]; topTracks?: SpotifyTrack[]; perCategory?: number }> = ({
  items,
  topTracks = [],
  perCategory = 3,
}) => {
  const tracks = topTracks.slice(0, perCategory);
  const groups = OFF_HOURS_ORDER.map((category) => ({
    category,
    items: items.filter((it) => it.category === category).slice(0, perCategory),
  })).filter((g) => g.items.length > 0 || (g.category === "music" && tracks.length > 0));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
      {groups.map((g) => {
        const Icon = ICON[g.category];
        return (
          <Reveal key={g.category} className="h-full">
            <section
              aria-labelledby={`off-hours-${g.category}`}
              className="h-full rounded-lg p-5 md:p-6 border border-white/[0.08]"
              style={{ background: "var(--card-bg)" }}
            >
              <h3
                id={`off-hours-${g.category}`}
                className="flex items-center gap-2.5 text-[17px] font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                <span aria-hidden style={{ color: "var(--text-secondary)" }}>
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                {OFF_HOURS_LABEL[g.category]}
              </h3>
              {g.items.length > 0 && (
                <ul className="mt-5 flex flex-col gap-5">
                  {g.items.map((it, i) => (
                    <Row key={`${it.date}-${i}`} item={it} />
                  ))}
                </ul>
              )}
              {g.category === "music" && tracks.length > 0 && (
                <SpotifyTop tracks={tracks} divided={g.items.length > 0} />
              )}
            </section>
          </Reveal>
        );
      })}
    </div>
  );
};

export default OffHoursBoard;
