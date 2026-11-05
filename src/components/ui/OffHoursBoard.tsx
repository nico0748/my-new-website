import React, { useState } from "react";
import { Music2, Package, Ticket, Tv } from "lucide-react";
import type { AnimeWork, OffHoursCategory, OffHoursItem } from "../../lib/dataMapper";
import { animeHref, animeVtName } from "../../lib/anime";
import { OFF_HOURS_LABEL, OFF_HOURS_ORDER } from "../../lib/offHours";
import type { SpotifyTrack } from "../../lib/spotify";
import Reveal from "./Reveal";
import AnimeCard from "./AnimeCard";
import { MoreLink } from "../layouts/SiteLayout";

const SPOTIFY_ICON =
  "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z";

const ICON: Record<OffHoursCategory, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  anime: Tv,
  music: Music2,
  event: Ticket,
  indie: Package,
};

/** カテゴリごとの表示件数（PC は 4 列なので 4 の倍数）と、スマホ（1 列）で出す件数。 */
const LIMIT: Record<OffHoursCategory, { all: number; mobile: number }> = {
  anime: { all: 8, mobile: 4 },
  music: { all: 12, mobile: 6 },
  event: { all: 8, mobile: 4 },
  indie: { all: 4, mobile: 4 },
};

/** "2026-10-12" → イベントは "2026.10.12"、それ以外は年月だけの "2026.10" */
const formatDate = (category: OffHoursCategory, date: string) =>
  (category === "event" ? date : date.slice(0, 7)).replace(/-/g, ".");

interface Card {
  key: string;
  category: OffHoursCategory;
  title: string;
  sub?: React.ReactNode;
  url?: string;
  image?: string | null;
  /** Annict の作品（アニメのカードはポップアップを開く） */
  work?: AnimeWork;
}

/** 64px 角のサムネイル（ジャケット・作品画像）。画像が無い / 読み込めないときはカテゴリのピクトグラム。 */
const Thumb: React.FC<{ category: OffHoursCategory; image?: string | null }> = ({ category, image }) => {
  const [failed, setFailed] = useState(false);
  const Icon = ICON[category];
  return (
    <span
      className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md"
      style={{ background: "var(--surface)", border: "1px solid var(--border-color)", color: "var(--text-muted)" }}
    >
      {image && !failed ? (
        <img
          src={image}
          alt=""
          width={64}
          height={64}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <Icon size={22} strokeWidth={1.75} />
      )}
    </span>
  );
};

/** 1 件 1 枚のカード（サムネイル + タイトル + 補足）。URL があればカード全体がリンク。 */
const CardView: React.FC<{ card: Card }> = ({ card }) => {
  const body = (
    <>
      <Thumb category={card.category} image={card.image} />
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="line-clamp-2 text-[15px] font-medium leading-snug" style={{ color: "var(--text-primary)" }}>
          <span className="row-title">{card.title}</span>
          {card.url && (
            <span aria-hidden className="ml-1.5 text-[13px]" style={{ color: "var(--text-muted)" }}>
              ↗
            </span>
          )}
        </p>
        {card.sub && (
          <p className="mt-1.5 truncate text-[13px] tracking-wide" style={{ color: "var(--text-secondary)" }}>
            {card.sub}
          </p>
        )}
      </div>
    </>
  );
  const cls = "flex h-full items-start gap-4 rounded-xl border border-white/[0.08] p-4 transition-colors duration-300";
  return card.url ? (
    <a
      href={card.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`row-link ${cls} hover:border-white/[0.22]`}
      style={{ background: "var(--card-bg)" }}
    >
      {body}
    </a>
  ) : (
    <div className={cls} style={{ background: "var(--card-bg)" }}>
      {body}
    </div>
  );
};

/** 手入力の記録の補足行: 「日付 · subtitle」 */
const recordSub = (it: OffHoursItem) => (
  <>
    <time dateTime={it.date} className="tabular-nums">
      {formatDate(it.category, it.date)}
    </time>
    {it.subtitle && (
      <>
        <span className="mx-2" aria-hidden>
          ·
        </span>
        {it.subtitle}
      </>
    )}
  </>
);

const fromRecord = (it: OffHoursItem, i: number): Card => ({
  key: `rec-${it.date}-${i}`,
  category: it.category,
  title: it.title,
  sub: recordSub(it),
  url: it.url,
  image: it.image,
});

const fromAnime = (w: AnimeWork): Card => ({
  key: `annict-${w.id}`,
  category: "anime",
  title: w.title,
  sub: [w.season, w.status === "watching" ? "視聴中" : ""].filter(Boolean).join(" · ") || undefined,
  work: w,
});

/**
 * アニメは横長のサムネイルを上に置いたカード（一覧ページと同じ）。Annict の作品は一覧ページのポップアップを開き、
 * 画像とタイトルがそのままモーフする（トップに出るのは数件なので、全カードに名前を付けておく）。
 * お気に入りを出しているときは、閉じるとお気に入りのタブに戻る。
 */
const AnimeTile: React.FC<{ card: Card; favorites: boolean }> = ({ card, favorites }) => {
  const w = card.work;
  if (w)
    return (
      <AnimeCard
        id={w.id}
        title={w.title}
        sub={card.sub}
        sources={[w.image, w.avatar]}
        link={{ to: animeHref(w, favorites ? "favorite" : w.status), state: { from: "top" } }}
        vtNames={{ img: animeVtName("img", w.id), title: animeVtName("title", w.id) }}
      />
    );
  return (
    <AnimeCard
      id={card.key}
      title={card.title}
      sub={card.sub}
      sources={[card.image ?? undefined]}
      link={card.url ? { href: card.url } : undefined}
    />
  );
};

const fromTrack = (t: SpotifyTrack): Card => ({
  key: `spotify-${t.url}`,
  category: "music",
  title: t.title,
  sub: t.artists || undefined,
  url: t.url,
  image: t.image,
});

/** 見出し右の出典（Spotify はロゴとリンクを添える）。 */
const SourceNote: React.FC<{
  category: OffHoursCategory;
  hasTracks: boolean;
  hasAnime: boolean;
  animeFavorites: boolean;
}> = ({ category, hasTracks, hasAnime, animeFavorites }) => {
  const cls = "flex items-center gap-2 text-[13px] tracking-wide";
  if (category === "music" && hasTracks)
    return (
      <p className={cls} style={{ color: "var(--text-secondary)" }}>
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
    );
  if (category === "anime" && hasAnime)
    return (
      <p className="text-[13px] tracking-wide" style={{ color: "var(--text-secondary)" }}>
        {animeFavorites && (
          <>
            お気に入り
            <span aria-hidden className="mx-2">
              ·
            </span>
          </>
        )}
        <a href="https://annict.com/" target="_blank" rel="noopener noreferrer" className="link-quiet">
          Annict
        </a>{" "}
        の視聴記録より
      </p>
    );
  return null;
};

/**
 * 趣味の記録（OFF-HOURS）。カテゴリごとに見出しを立て、1 件 1 枚のカードを 4 列（タブレット 2 列・スマホ 1 列）で並べる。
 * - アニメ: 手入力の記録 → Annict の視聴記録（お気に入りがあればお気に入りだけ。どちらも放送クールの新しい順）
 * - 音楽: 手入力の記録 → Spotify の「最近よく聴いている曲」
 * - イベント・同人作品: 手入力の記録（OffHours シート）
 * 記録が 1 件も無いカテゴリは出さない。
 */
const OffHoursBoard: React.FC<{
  items: OffHoursItem[];
  topTracks?: SpotifyTrack[];
  anime?: AnimeWork[];
  /** anime がお気に入りだけのとき true */
  animeFavorites?: boolean;
}> = ({ items, topTracks = [], anime = [], animeFavorites = false }) => {
  const groups = OFF_HOURS_ORDER.map((category) => {
    const records = items.filter((it) => it.category === category).map(fromRecord);
    const extra = category === "anime" ? anime.map(fromAnime) : category === "music" ? topTracks.map(fromTrack) : [];
    return { category, cards: [...records, ...extra].slice(0, LIMIT[category].all) };
  }).filter((g) => g.cards.length > 0);

  return (
    <div className="flex flex-col gap-12 md:gap-14">
      {groups.map((g) => {
        const Icon = ICON[g.category];
        return (
          <Reveal key={g.category}>
            <section aria-labelledby={`off-hours-${g.category}`}>
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <h3
                  id={`off-hours-${g.category}`}
                  className="flex items-center gap-2.5 text-[17px] font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  <span aria-hidden className="self-center" style={{ color: "var(--text-secondary)" }}>
                    <Icon size={18} strokeWidth={1.75} />
                  </span>
                  {OFF_HOURS_LABEL[g.category]}
                </h3>
                <SourceNote
                  category={g.category}
                  hasTracks={topTracks.length > 0}
                  hasAnime={anime.length > 0}
                  animeFavorites={animeFavorites}
                />
              </div>
              <ul
                className={`grid gap-3 lg:grid-cols-4 lg:gap-4 ${g.category === "anime" ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}
              >
                {g.cards.map((c, i) => (
                  <li key={c.key} className={i >= LIMIT[g.category].mobile ? "max-sm:hidden" : undefined}>
                    {g.category === "anime" ? <AnimeTile card={c} favorites={animeFavorites} /> : <CardView card={c} />}
                  </li>
                ))}
              </ul>
              {g.category === "anime" && anime.length > 0 && <MoreLink to="/anime">すべてのアニメを見る</MoreLink>}
            </section>
          </Reveal>
        );
      })}
    </div>
  );
};

export default OffHoursBoard;
