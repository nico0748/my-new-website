import { useEffect, useState } from "react";
import SiteLayout, { PageTitle, Loading, MoreLink } from "../components/layouts/SiteLayout";
import ArticleList from "../components/ui/ArticleList";
import type { ArticleItem } from "../lib/dataMapper";
import { fetchArticles, QIITA_PROFILE_URL } from "../lib/articles";

/** 自分が書いた記事の一覧（年ごと）。各記事は外部の掲載先へ遷移する。 */
const ArticlesPage = () => {
  const [items, setItems] = useState<ArticleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const byYear = items.reduce<Record<string, ArticleItem[]>>((acc, a) => {
    const y = a.date.slice(0, 4) || "—";
    (acc[y] ||= []).push(a);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => (a < b ? 1 : -1));

  return (
    <SiteLayout>
      <PageTitle title="Articles" lead="Qiita などに書いた技術記事の一覧です。" />
      {loading ? (
        <Loading />
      ) : items.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          記事を取得できませんでした。
        </p>
      ) : (
        <div className="flex flex-col gap-14">
          {years.map((y) => (
            <section key={y}>
              <h2 className="text-[13px] font-medium tracking-[0.18em] mb-4" style={{ color: "var(--text-muted)" }}>
                {y}
              </h2>
              <ArticleList items={byYear[y]} />
            </section>
          ))}
        </div>
      )}
      <MoreLink to={QIITA_PROFILE_URL} external>
        Qiita のプロフィール
      </MoreLink>
    </SiteLayout>
  );
};

export default ArticlesPage;
