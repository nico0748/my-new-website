import { useEffect, useState } from "react";
import SiteLayout, { PageTitle, Loading } from "../components/layouts/SiteLayout";
import WorkList from "../components/ui/WorkList";
import { fetchSheetData } from "../lib/googleSheets";
import { mapPortfolioData } from "../lib/dataMapper";
import type { PortfolioItem } from "../lib/dataMapper";
import type { SheetRow } from "../lib/googleSheets";

const ProjectsPage = () => {
  const [works, setWorks] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (import.meta.env.VITE_GOOGLE_SHEETS_API_KEY) {
        try {
          const rows = await fetchSheetData<SheetRow>("Projects");
          if (rows.length > 0) setWorks(mapPortfolioData(rows));
        } catch {
          // fallback: 空のまま
        }
      }
      setLoading(false);
    })();
  }, []);

  return (
    <SiteLayout>
      <PageTitle title="Works" lead="これまでに取り組んだ制作物です。" />
      {loading ? (
        <Loading />
      ) : works.length > 0 ? (
        <WorkList items={works} />
      ) : (
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          作品データがありません（Google Sheets を設定してください）
        </p>
      )}
    </SiteLayout>
  );
};

export default ProjectsPage;
