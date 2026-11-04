import { useEffect, useState } from "react";
import SiteLayout, { PageTitle, Loading } from "../components/layouts/SiteLayout";
import WorkList from "../components/ui/WorkList";
import { fetchProjects, getCachedProjects } from "../lib/projects";
import type { PortfolioItem } from "../lib/dataMapper";

const ProjectsPage = () => {
  const [works, setWorks] = useState<PortfolioItem[]>(() => getCachedProjects() ?? []);
  const [loading, setLoading] = useState(() => getCachedProjects() === null);

  useEffect(() => {
    fetchProjects()
      .then(setWorks)
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteLayout>
      <PageTitle title="Works" lead="これまでに取り組んだ制作物です。" />
      {loading ? (
        <Loading />
      ) : works.length > 0 ? (
        <WorkList items={works} />
      ) : (
        <p className="text-[15px]" style={{ color: "var(--text-muted)" }}>
          作品データがありません（Google Sheets を設定してください）
        </p>
      )}
    </SiteLayout>
  );
};

export default ProjectsPage;
