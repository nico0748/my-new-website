import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";
import { UNSAFE_ViewTransitionContext, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SiteLayout, { PageTitle, Loading } from "../components/layouts/SiteLayout";
import AnimeCard from "../components/ui/AnimeCard";
import AnimeModal from "../components/ui/AnimeModal";
import AnimeSeasonFilter from "../components/ui/AnimeSeasonFilter";
import Reveal from "../components/ui/Reveal";
import type { AnimeStatus, AnimeWork } from "../lib/dataMapper";
import {
  ANIME_STATUSES,
  ANIME_TABS,
  ANIME_TAB_LABEL,
  animeVtName,
  fetchAnimeList,
  getCachedAnimeList,
  isAnimeTab,
  matchesSeason,
  parseSeasonParam,
  pickFavorites,
  toSeasonParam,
} from "../lib/anime";
import type { AnimeTab, SeasonFilter } from "../lib/anime";

const PAGE_SIZE = 48;

type Lists = Record<AnimeStatus, AnimeWork[] | null>;

/** 一覧ページの URL の search（タブ・放送時期・開いている作品）。 */
const searchOf = ({ tab, season, id }: { tab?: AnimeTab | null; season?: string | null; id?: string | null }) => {
  const p = new URLSearchParams();
  if (tab) p.set("tab", tab);
  if (season) p.set("season", season);
  if (id) p.set("id", id);
  const s = p.toString();
  return s ? `?${s}` : "";
};

/**
 * 同じページの中の View Transition（ポップアップの開閉）の間だけ html[data-vt="modal"] を付ける。
 * index.css がこれを見て、ページ全体のフェードを止める（別ページへの遷移はいつもどおり）。
 * ブラウザの「戻る」で閉じたときにも効くよう、ルーターの遷移の状態から判定する。
 */
const useModalTransitionFlag = () => {
  const vt = useContext(UNSAFE_ViewTransitionContext);
  useLayoutEffect(() => {
    const html = document.documentElement;
    if (vt.isTransitioning && vt.currentLocation.pathname === vt.nextLocation.pathname) html.dataset.vt = "modal";
    else delete html.dataset.vt;
  }, [vt]);
  useLayoutEffect(() => () => void delete document.documentElement.dataset.vt, []);
};

/**
 * アニメの一覧（お気に入り / Annict の「見てる / 見た / 見たい」）。放送クールの新しい順に横長のカードで並べ、48 件ずつ表示する。
 * - 最初に開くのはお気に入り（「見てる」「見た」でチェックを付けた作品）。1 件も無ければ「見てる」
 * - 放送時期（年 → 季節）で絞り込める（?season=2024-winter / ?season=2024）。タブを切り替えても保つ
 * - カードを押すと ?id= を付けてポップアップを開く（URL を共有でき、「戻る」で閉じる）。
 *   画像とタイトルは Works の一覧 → 詳細と同じ仕組みでモーフさせる
 */
const AnimePage = () => {
  useModalTransitionFlag();
  const [params, setParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [lists, setLists] = useState<Lists>(() => ({
    watching: getCachedAnimeList("watching"),
    watched: getCachedAnimeList("watched"),
    wanna: getCachedAnimeList("wanna"),
  }));
  useEffect(() => {
    ANIME_STATUSES.forEach((s) => fetchAnimeList(s).then((list) => setLists((prev) => ({ ...prev, [s]: list }))));
  }, []);

  const favorites = lists.watching && lists.watched ? pickFavorites(lists.watching, lists.watched) : null;

  const id = params.get("id");
  const open = id
    ? ANIME_STATUSES.map((s) => lists[s]?.find((w) => w.id === id)).find((w): w is AnimeWork => !!w)
    : undefined;
  const tabParam = params.get("tab");
  // 既定のタブ: お気に入りがあればお気に入り、無ければ「見てる」（お気に入りの有無は「見てる」「見た」を読み終えてから決める）
  const tab: AnimeTab | null = isAnimeTab(tabParam)
    ? tabParam
    : open
      ? open.status
      : favorites === null
        ? null
        : favorites.length > 0
          ? "favorite"
          : "watching";
  const works = tab === null ? null : tab === "favorite" ? favorites : lists[tab];
  const tabs = ANIME_TABS.filter((t) => t !== "favorite" || (favorites?.length ?? 0) > 0 || tab === "favorite");
  const countOf = (t: AnimeTab) => (t === "favorite" ? favorites : lists[t])?.length;

  const filter = parseSeasonParam(params.get("season"));
  const season = toSeasonParam(filter);
  const shown = works && works.filter((w) => matchesSeason(w, filter));

  // モーフの対象: 最後に開いた作品のカード（開いている間はポップアップ側だけが名前を持つ）
  const [focusId, setFocusId] = useState<string | null>(id);
  if (id && id !== focusId) setFocusId(id);

  const [limits, setLimits] = useState<Record<string, number>>({});
  const limitKey = `${tab}|${season ?? ""}`;
  const limit = limits[limitKey] ?? PAGE_SIZE;

  const replaceSearch = (search: string) =>
    setParams(new URLSearchParams(search), {
      replace: true,
      preventScrollReset: true,
    });
  const selectTab = (t: AnimeTab) => replaceSearch(searchOf({ tab: t, season }));
  const selectSeason = (f: SeasonFilter | null) => replaceSearch(searchOf({ tab, season: toSeasonParam(f) }));

  const close = () => {
    // 一覧から開いたなら履歴を 1 つ戻す（「戻る」と同じ）。直リンク・トップから来たときは一覧に置き換える
    if ((location.state as { from?: string } | null)?.from === "list") navigate(-1);
    else
      navigate(
        { search: searchOf({ tab, season }) },
        { replace: true, preventScrollReset: true, viewTransition: true },
      );
  };

  return (
    <SiteLayout>
      <PageTitle title="Anime" lead="Annict に付けているアニメの記録です。放送された時期の新しい順に並べています。" />

      {/* スマホで 4 つのタブが収まらないときは横にスクロール（下線は外側の罫線に重ねる）。
          選んだタブの下線は中央から左右へ伸びる（外したタブの線はすぐ消し、動く線は 1 本だけにする） */}
      <div className="border-b" style={{ borderColor: "var(--border-color)" }}>
        <div
          role="tablist"
          aria-label="記録の種類"
          className="-mb-px flex gap-6 overflow-x-auto [scrollbar-width:none] sm:gap-7 [&::-webkit-scrollbar]:hidden"
        >
          {tabs.map((t) => {
            const selected = t === tab;
            const count = countOf(t);
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => selectTab(t)}
                // pb は旧 border-b-2 の 2px ぶんを足して、タブの高さを変えない
                className="relative shrink-0 pb-[14px] text-[15px] transition-colors"
                style={{ color: selected ? "var(--text-primary)" : "var(--text-secondary)" }}
              >
                {ANIME_TAB_LABEL[t]}
                {count !== undefined && (
                  <span className="ml-2 tabular-nums text-[13px]" style={{ color: "var(--text-muted)" }}>
                    {count}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] origin-center ${
                    selected
                      ? "scale-x-100 transition-transform duration-200 ease-motion motion-reduce:transition-none"
                      : "scale-x-0"
                  }`}
                  style={{ background: "var(--text-primary)" }}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8" role="tabpanel">
        {works === null || shown === null ? (
          <Loading />
        ) : works.length === 0 ? (
          <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
            {tab === "favorite" ? "お気に入りはまだありません。" : "まだ記録がありません。"}
          </p>
        ) : (
          <>
            <AnimeSeasonFilter works={works} value={filter} onChange={selectSeason} count={shown.length} />
            {shown.length === 0 ? (
              <p className="mt-8 text-[15px]" style={{ color: "var(--text-muted)" }}>
                この時期の作品はありません。
                <button type="button" onClick={() => selectSeason(null)} className="link-quiet ml-3">
                  絞り込みを解除
                </button>
              </p>
            ) : (
              <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
                {shown.slice(0, limit).map((w) => {
                  const named = w.id === focusId && w.id !== open?.id;
                  return (
                    <Reveal as="li" key={w.id}>
                      <AnimeCard
                        id={w.id}
                        title={w.title}
                        sub={[w.season, w.media].filter(Boolean).join(" · ") || undefined}
                        sources={[w.image, w.avatar]}
                        link={{
                          to: { search: searchOf({ tab, season, id: w.id }) },
                          state: { from: "list" },
                          samePage: true,
                          // 押した瞬間にこのカードへ名前を付けてから遷移する（旧画面のスナップショットに載せるため）
                          onOpen: () => flushSync(() => setFocusId(w.id)),
                        }}
                        vtNames={
                          named
                            ? {
                                img: animeVtName("img", w.id),
                                title: animeVtName("title", w.id),
                              }
                            : undefined
                        }
                      />
                    </Reveal>
                  );
                })}
              </ul>
            )}
            {shown.length > limit && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() =>
                    setLimits((prev) => ({
                      ...prev,
                      [limitKey]: limit + PAGE_SIZE,
                    }))
                  }
                  className="rounded-full border border-white/[0.12] px-6 py-2.5 text-[15px] link-quiet transition-colors hover:border-white/[0.24]"
                >
                  さらに表示
                  <span className="ml-2 tabular-nums text-[13px]" style={{ color: "var(--text-muted)" }}>
                    残り {shown.length - limit} 件
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {open && <AnimeModal key={open.id} work={open} onClose={close} />}
    </SiteLayout>
  );
};

export default AnimePage;
