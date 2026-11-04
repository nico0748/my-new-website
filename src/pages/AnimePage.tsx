import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";
import { UNSAFE_ViewTransitionContext, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SiteLayout, { PageTitle, Loading } from "../components/layouts/SiteLayout";
import AnimeCard from "../components/ui/AnimeCard";
import AnimeModal from "../components/ui/AnimeModal";
import Reveal from "../components/ui/Reveal";
import type { AnimeStatus, AnimeWork } from "../lib/dataMapper";
import {
  ANIME_STATUSES,
  ANIME_STATUS_LABEL,
  animeVtName,
  fetchAnimeList,
  getCachedAnimeList,
  isAnimeStatus,
} from "../lib/anime";

const PAGE_SIZE = 48;

type Lists = Record<AnimeStatus, AnimeWork[] | null>;

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
 * アニメの一覧（Annict の「見てる / 見た / 見たい」）。放送クールの新しい順に横長のカードで並べ、48 件ずつ表示する。
 * カードを押すと ?id= を付けてポップアップを開く（URL を共有でき、「戻る」で閉じる）。
 * 画像とタイトルは Works の一覧 → 詳細と同じ仕組みでモーフさせる。
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

  const id = params.get("id");
  const open = id
    ? ANIME_STATUSES.map((s) => lists[s]?.find((w) => w.id === id)).find((w): w is AnimeWork => !!w)
    : undefined;
  const tabParam = params.get("tab");
  const tab: AnimeStatus = isAnimeStatus(tabParam) ? tabParam : open?.status ?? "watching";
  const works = lists[tab];

  // モーフの対象: 最後に開いた作品のカード（開いている間はポップアップ側だけが名前を持つ）
  const [focusId, setFocusId] = useState<string | null>(id);
  if (id && id !== focusId) setFocusId(id);

  const [limits, setLimits] = useState<Partial<Record<AnimeStatus, number>>>({});
  const limit = limits[tab] ?? PAGE_SIZE;

  const selectTab = (s: AnimeStatus) => setParams({ tab: s }, { replace: true, preventScrollReset: true });

  const close = () => {
    // 一覧から開いたなら履歴を 1 つ戻す（「戻る」と同じ）。直リンク・トップから来たときは一覧に置き換える
    if ((location.state as { from?: string } | null)?.from === "list") navigate(-1);
    else navigate({ search: `?tab=${tab}` }, { replace: true, preventScrollReset: true, viewTransition: true });
  };

  return (
    <SiteLayout>
      <PageTitle title="Anime" lead="Annict に付けているアニメの記録です。放送された時期の新しい順に並べています。" />

      <div role="tablist" aria-label="記録の種類" className="flex gap-7 border-b" style={{ borderColor: "var(--border-color)" }}>
        {ANIME_STATUSES.map((s) => {
          const selected = s === tab;
          return (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => selectTab(s)}
              className="-mb-px border-b-2 pb-3 text-[15px] transition-colors"
              style={{
                borderColor: selected ? "var(--text-primary)" : "transparent",
                color: selected ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              {ANIME_STATUS_LABEL[s]}
              {lists[s] && (
                <span className="ml-2 tabular-nums text-[13px]" style={{ color: "var(--text-muted)" }}>
                  {lists[s]!.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8" role="tabpanel">
        {works === null ? (
          <Loading />
        ) : works.length === 0 ? (
          <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
            まだ記録がありません。
          </p>
        ) : (
          <>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {works.slice(0, limit).map((w) => {
                const named = w.id === focusId && w.id !== open?.id;
                return (
                  <Reveal as="li" key={w.id}>
                    <AnimeCard
                      id={w.id}
                      title={w.title}
                      sub={[w.season, w.media].filter(Boolean).join(" · ") || undefined}
                      sources={[w.image, w.avatar]}
                      link={{
                        to: { search: `?tab=${tab}&id=${encodeURIComponent(w.id)}` },
                        state: { from: "list" },
                        samePage: true,
                        // 押した瞬間にこのカードへ名前を付けてから遷移する（旧画面のスナップショットに載せるため）
                        onOpen: () => flushSync(() => setFocusId(w.id)),
                      }}
                      vtNames={named ? { img: animeVtName("img", w.id), title: animeVtName("title", w.id) } : undefined}
                    />
                  </Reveal>
                );
              })}
            </ul>
            {works.length > limit && (
              <div className="mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setLimits((prev) => ({ ...prev, [tab]: limit + PAGE_SIZE }))}
                  className="rounded-full border border-white/[0.12] px-6 py-2.5 text-[15px] link-quiet transition-colors hover:border-white/[0.24]"
                >
                  さらに表示
                  <span className="ml-2 tabular-nums text-[13px]" style={{ color: "var(--text-muted)" }}>
                    残り {works.length - limit} 件
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
