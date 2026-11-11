import { useEffect, useId, useState } from "react";
import { flushSync } from "react-dom";
import type { CSSProperties, ReactNode } from "react";
import { useLocation, useNavigate, useNavigationType, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence, useIsPresent } from "framer-motion";

import SiteLayout, { SectionHeading, MoreLink, READABLE_WIDTH } from "../components/layouts/SiteLayout";
import ArticleList from "../components/ui/ArticleList";
import WorkList from "../components/ui/WorkList";
import SkillRadarChart from "../components/ui/SkillRadarChart";
import { skillColor } from "../lib/skillColors";
import Timeline from "../components/ui/Timeline";
import TimelineModal from "../components/ui/TimelineModal";
import OffHoursBoard from "../components/ui/OffHoursBoard";
import GitHubActivity from "../components/ui/GitHubActivity";
import Reveal from "../components/ui/Reveal";
import SocialLinks from "../components/ui/SocialLinks";

import { fetchSheetData } from "../lib/googleSheets";
import type { SheetRow } from "../lib/googleSheets";
import { mapSkillsData } from "../lib/dataMapper";
import { fetchProjects, getCachedProjects } from "../lib/projects";
import type { ProfileData, SkillCategory, TimelineItem, PortfolioItem, ArticleItem } from "../lib/dataMapper";
import { fetchArticles } from "../lib/articles";
import { fetchProfile, getCachedProfile, socialLinksOf } from "../lib/profile";
import { fetchOffHours, getCachedOffHours } from "../lib/offHours";
import { fetchTopTracks, getCachedTopTracks } from "../lib/spotify";
import { fetchTopAnime, getCachedTopAnime } from "../lib/anime";
import type { TopAnime } from "../lib/anime";
import type { SpotifyTrack } from "../lib/spotify";
import { EMPTY_GITHUB_ACTIVITY, fetchGitHubActivity, getCachedGitHubActivity, githubReposUrl, pickRepos } from "../lib/github";
import type { GitHubActivity as GitHubActivityData } from "../lib/github";
import type { OffHoursItem } from "../lib/dataMapper";
import { scrollToSection } from "../lib/sections";
import { TIMELINE_PARAM, fetchTimeline, getCachedTimeline, timelineVtName } from "../lib/timeline";
import { useModalTransitionFlag } from "../lib/modalTransition";

const REAL_NAME = "細澤 悠真";

/**
 * 他のページの移動メニューから /#works などで来たとき、そのセクションの見出しに位置を合わせる。
 * セクションは Sheets や API を読み終えてから現れたり伸びたりするので、ページの高さが変わるたびに合わせ直す。
 * 利用者が自分でスクロールし始めたら（または 3 秒たったら）やめる。戻る / 進むは ScrollRestoration に任せる。
 */
const useScrollToHash = () => {
  const { hash, key } = useLocation();
  const navigationType = useNavigationType();
  useEffect(() => {
    if (!hash || navigationType === "POP") return;
    const id = decodeURIComponent(hash.slice(1));
    let stopped = false;
    const align = () => {
      if (!stopped) scrollToSection(id);
    };
    const stop = () => {
      stopped = true;
    };
    const events = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    events.forEach((ev) => window.addEventListener(ev, stop, { passive: true }));
    const observer = new ResizeObserver(align);
    observer.observe(document.body);
    align();
    const timer = window.setTimeout(stop, 3000);
    return () => {
      stop();
      observer.disconnect();
      window.clearTimeout(timer);
      events.forEach((ev) => window.removeEventListener(ev, stop));
    };
  }, [hash, key, navigationType]);
};

/**
 * TIMELINE の詳細ポップアップ（?timeline=<id>）。アニメの一覧と同じ開き方:
 * - 項目を押すと URL に ?timeline= を付けて開く（共有でき、「戻る」で閉じる。?id=real などほかの値は保つ）
 * - 見出しは項目のタイトルからモーフする。名前を付けるのは最後に開いた項目だけ（押した瞬間に flushSync で付ける）
 * - 項目から開いたなら閉じると履歴を 1 つ戻す。直リンクで来たときは ?timeline= を外した URL に置き換える
 */
const useTimelineModal = (items: TimelineItem[]) => {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const openId = params.get(TIMELINE_PARAM);
  const open = openId ? items.find((it) => it.id === openId) : undefined;

  const [focusId, setFocusId] = useState<string | null>(openId);
  if (openId && openId !== focusId) setFocusId(openId);

  const searchWith = (id: string | null) => {
    const next = new URLSearchParams(params);
    if (id) next.set(TIMELINE_PARAM, id);
    else next.delete(TIMELINE_PARAM);
    const q = next.toString();
    return q ? `?${q}` : "";
  };

  return {
    open,
    linkTo: (it: TimelineItem) => ({ search: searchWith(it.id) }),
    onOpen: (it: TimelineItem) => flushSync(() => setFocusId(it.id)),
    vtNameOf: (it: TimelineItem) => (it.id === focusId && it.id !== open?.id ? timelineVtName(it.id) : undefined),
    close: () => {
      if ((location.state as { from?: string } | null)?.from === "timeline") navigate(-1);
      else navigate({ search: searchWith(null) }, { replace: true, preventScrollReset: true, viewTransition: true });
    },
  };
};

const PortfolioPage = () => {
  const [profile, setProfile] = useState<ProfileData>(
    () => getCachedProfile() ?? { name: "", title: "", description: "", image: "" }
  );
  const [works, setWorks] = useState<PortfolioItem[]>(() => getCachedProjects() ?? []);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>(() => getCachedTimeline() ?? []);
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [articlesLoaded, setArticlesLoaded] = useState(false);
  const [offHours, setOffHours] = useState<OffHoursItem[]>(() => getCachedOffHours() ?? []);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>(() => getCachedTopTracks() ?? []);
  const [anime, setAnime] = useState<TopAnime>(() => getCachedTopAnime() ?? { works: [], favorites: false });
  const [github, setGitHub] = useState<GitHubActivityData>(() => getCachedGitHubActivity() ?? EMPTY_GITHUB_ACTIVITY);
  // Projects シートを読み終えたか（WORKS に載っているリポジトリを除いてから ACTIVITY のリポジトリを出すため）
  const [worksReady, setWorksReady] = useState(!import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || getCachedProjects() !== null);
  // Profile シートを読み終えたか（ソーシャルリンクを全件そろってからフェードインさせるため）
  const [profileReady, setProfileReady] = useState(!import.meta.env.VITE_GOOGLE_SHEETS_API_KEY || !!getCachedProfile());
  useScrollToHash();
  useModalTransitionFlag();
  const timelineModal = useTimelineModal(timeline);

  useEffect(() => {
    fetchArticles()
      .then(setArticles)
      .finally(() => setArticlesLoaded(true));
    // 趣味の記録は Profile 等とは別に読む（待たせるとソーシャルリンクの表示まで遅れるため）
    fetchOffHours().then(setOffHours);
    fetchTopTracks().then(setTopTracks);
    fetchGitHubActivity().then(setGitHub);
    fetchTopAnime().then(setAnime);

    if (!import.meta.env.VITE_GOOGLE_SHEETS_API_KEY) return;
    (async () => {
      try {
        const [profileData, worksItems, skillsRows, timelineItems] = await Promise.all([
          // フッターの SNS リンクと同じ取得を共有する（lib/profile.ts）
          fetchProfile(),
          fetchProjects(),
          fetchSheetData<SheetRow>("Skills"),
          // 戻る / 進むで TIMELINE とそのポップアップを最初の描画から出すため、取得はキャッシュを共有する（lib/timeline.ts）
          fetchTimeline(),
        ]);
        if (profileData) setProfile(profileData);
        if (worksItems.length > 0) setWorks(worksItems);
        if (skillsRows.length > 0) setSkills(mapSkillsData(skillsRows));
        if (timelineItems.length > 0) setTimeline(timelineItems);
      } catch (error) {
        console.error("Failed to fetch data from Google Sheets", error);
      } finally {
        setProfileReady(true);
        setWorksReady(true);
      }
    })();
  }, []);

  // ACTIVITY: WORKS 以外のリポジトリ（Projects を読み終えるまでは出さない）と、活動のあるカレンダー
  const repos = worksReady ? pickRepos(github.repos, works.map((w) => w.repoUrl)) : [];
  const calendar = github.calendar && github.calendar.total > 0 ? github.calendar : null;
  // Timeline のポップアップが作品ページにつながっているときは、その作品のサムネイルをポップアップに出す
  const openWork = timelineModal.open?.href?.match(/^\/projects\/([^/?#]+)/)
    ? works.find((w) => `/projects/${w.id}` === timelineModal.open?.href)
    : undefined;

  return (
    <SiteLayout>
      <Intro profile={profile} ready={profileReady} />

      <section className="mt-24 md:mt-32">
        <Reveal>
          <SectionHeading id="works">Works</SectionHeading>
        </Reveal>
        {works.length > 0 ? (
          <WorkList items={works.slice(0, 6)} vtExclude={openWork?.id} />
        ) : (
          <Empty text="作品を読み込んでいます" />
        )}
        <Reveal>
          <MoreLink to="/projects">すべての作品を見る</MoreLink>
        </Reveal>
      </section>

      <section className="mt-24 md:mt-32">
        <Reveal>
          <SectionHeading id="articles">Articles</SectionHeading>
        </Reveal>
        {articles.length > 0 ? (
          <ArticleList items={articles.slice(0, 6)} />
        ) : (
          <Empty text={articlesLoaded ? "記事を取得できませんでした。Qiita から直接ご覧ください。" : "記事を読み込んでいます"} />
        )}
        <Reveal>
          <MoreLink to="/articles">すべての記事を見る</MoreLink>
        </Reveal>
      </section>

      {skills.length > 0 && (
        <section className="mt-24 md:mt-32">
          <Reveal>
            <SectionHeading id="skills">Skills</SectionHeading>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {skills.slice(0, 4).map((c, i) => (
              <Reveal key={c.category} className="h-full">
                <SkillRadarChart category={c.category} skills={c.skills} color={skillColor(c.category, i)} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <MoreLink to="/skills">すべてのスキルを見る</MoreLink>
          </Reveal>
        </section>
      )}

      {(calendar || repos.length > 0) && (
        <section className="mt-24 md:mt-32">
          <Reveal>
            <SectionHeading id="activity">Activity</SectionHeading>
          </Reveal>
          <GitHubActivity calendar={calendar} repos={repos} />
          <Reveal>
            <MoreLink to={githubReposUrl(profile.githubUrl)} external>
              すべてのリポジトリを見る
            </MoreLink>
          </Reveal>
        </section>
      )}

      {timeline.length > 0 && (
        <section className="mt-24 md:mt-32">
          <Reveal>
            <SectionHeading id="timeline">Timeline</SectionHeading>
          </Reveal>
          <Timeline
            items={timeline}
            linkTo={timelineModal.linkTo}
            onOpen={timelineModal.onOpen}
            vtNameOf={timelineModal.vtNameOf}
          />
        </section>
      )}

      {(offHours.length > 0 || topTracks.length > 0 || anime.works.length > 0) && (
        <section className="mt-24 md:mt-32">
          <Reveal>
            <SectionHeading id="off-hours">Off-hours</SectionHeading>
          </Reveal>
          <Reveal
            className={`-mt-3 md:-mt-4 mb-8 md:mb-10 ${READABLE_WIDTH} text-[15px] leading-[1.9]`}
            style={{ color: "var(--text-secondary)" }}
          >
            {/* 4 つの動詞だけ、表示されたときに一度だけ主テキスト色へ明るくする（index.css の .brighten） */}
            <p>
              コードの外で、<Verb i={0}>観て</Verb>、<Verb i={1}>聴いて</Verb>、<Verb i={2}>手に取って</Verb>、
              <Verb i={3}>足を運んだ</Verb>もの。
            </p>
          </Reveal>
          <OffHoursBoard items={offHours} topTracks={topTracks} anime={anime.works} animeFavorites={anime.favorites} />
        </section>
      )}

      {timelineModal.open && (
        <TimelineModal
          key={timelineModal.open.id}
          item={timelineModal.open}
          work={openWork}
          onClose={timelineModal.close}
        />
      )}
    </SiteLayout>
  );
};

/** OFF-HOURS のリードの動詞。i の順に 120ms ずつ明るくなる。 */
const Verb = ({ i, children }: { i: number; children: ReactNode }) => (
  <span className="brighten" style={{ "--i": i } as CSSProperties}>
    {children}
  </span>
);

/**
 * 名前の 1 語。切り替えたときだけ、枠の中で古い語が上へ抜け、新しい語が下から入る（0.35s）。
 * 抜けていく途中の語は読み上げから外す（見出しの名前が二重にならないように）。
 * 動きを減らす設定では MotionConfig（main.tsx）が transform を止めるので、すぐに入れ替わる。
 */
const NameWord = ({ children }: { children: ReactNode }) => {
  const isPresent = useIsPresent();
  return (
    <motion.span
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "-100%" }}
      // --motion-ease と同じカーブ
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={isPresent ? undefined : true}
      className="col-start-1 row-start-1 inline-block"
    >
      {children}
    </motion.span>
  );
};

/** 冒頭の自己紹介。名前クリックで nico ⇄ 本名を切り替える隠し機能（?id=real）を維持。 */
const Intro = ({ profile, ready }: { profile: ProfileData; ready: boolean }) => {
  const nameHintId = useId();
  const [searchParams, setSearchParams] = useSearchParams();
  const isReal = searchParams.get("id") === "real";
  const displayName = isReal ? REAL_NAME : profile.name || "nico";

  const toggleName = () =>
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (isReal) next.delete("id");
        else next.set("id", "real");
        return next;
      },
      { replace: true }
    );

  // Profile シートの各 URL から表示（フッターと同じ並び。lib/profile.ts）
  const socials = socialLinksOf(profile);

  return (
    <section className="pt-12 md:pt-20">
      {/* Profile → WORKS → … の順に、画面に入ったものから下からフェードインする（Reveal） */}
      <Reveal>
        <img
          src={profile.image || "/sns_icon_round.png"}
          alt=""
          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mb-8 md:mb-10"
          style={{ border: "1px solid var(--avatar-border)" }}
        />
      </Reveal>
      {/* 左: 名前・肩書・紹介文 / 右: ソーシャルリンクのカード（名前と同じ高さから始める）。タブレット未満では下に回す */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,1fr)_300px] md:gap-14 lg:gap-20 md:items-start">
        <div>
          <Reveal>
            {/* 見出しの名前は表示中の名前（ボタンの中身）から取る。操作の説明は本名を含まない aria-describedby で */}
            <h1 className="text-[2.75rem] sm:text-[3.5rem] font-semibold tracking-tight leading-tight">
              <button
                type="button"
                onClick={toggleName}
                aria-describedby={nameHintId}
                className="text-left cursor-pointer"
                style={{ color: "var(--text-primary)" }}
              >
                {/* 新旧の語を同じマスに重ね、はみ出した分を隠す枠。ページを開いたとき（initial）は動かさない */}
                <span className="inline-grid overflow-hidden align-top">
                  <AnimatePresence initial={false}>
                    {/* 切り替えたときだけ動かす（Profile シートの名前が後から届いても動かさない） */}
                    <NameWord key={isReal ? "real" : "nick"}>{displayName}</NameWord>
                  </AnimatePresence>
                </span>
              </button>
            </h1>
            <span id={nameHintId} hidden>
              表示名を切り替えます
            </span>
          </Reveal>
          {profile.title && (
            <Reveal className="mt-4 text-[17px]" style={{ color: "var(--text-muted)" }}>
              {/* 「A | B」の肩書は区切りの位置で折り返す（単語の途中で改行しない） */}
              {profile.title.split("|").map((part, i) => (
                <span key={i}>
                  {i > 0 && <span className="mx-2.5 opacity-50">|</span>}
                  <span className="inline-block">{part.trim()}</span>
                </span>
              ))}
            </Reveal>
          )}
          {profile.description && (
            <Reveal
              className={`mt-8 md:mt-10 ${READABLE_WIDTH} text-[17px] leading-[2.1] whitespace-pre-line`}
              style={{ color: "var(--text-body)" }}
            >
              <p>{profile.description}</p>
            </Reveal>
          )}
          {profile.blogUrl && (
            <a href={profile.blogUrl} target="_blank" rel="noopener noreferrer" className="link-quiet mt-8 inline-block text-[15px]">
              Blog ↗
            </a>
          )}
        </div>
        {ready && (
          <Reveal>
            <SocialLinks links={socials} />
          </Reveal>
        )}
      </div>
    </section>
  );
};

const Empty = ({ text }: { text: string }) => (
  <p className="py-4 text-[15px]" style={{ color: "var(--text-muted)" }}>
    {text}
  </p>
);

export default PortfolioPage;
