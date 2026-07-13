import { IntelligencePageClient } from "./components/IntelligencePageClient";
import { getOneYearOfSalesData } from "./services/getOneYearOfSalesData";
import { getAllDailySalesData } from "./services/getAllDailySalesData";
import { getBarangaysByRevenue } from "../dashboard/services/revenueGeoService";

type SearchParams = Record<string, string | string[] | undefined>;

export async function IntelligencePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const range = sp["range"] ?? "weekly";

  const [yearData, allTimeData, barangays] = await Promise.all([
    range === "monthly" ? getOneYearOfSalesData() : Promise.resolve(null),
    range === "yearly" ? getAllDailySalesData() : Promise.resolve(null),
    getBarangaysByRevenue(),
  ]);

  return (
    <IntelligencePageClient
      sp={sp}
      yearData={yearData}
      allTimeData={allTimeData}
      barangays={barangays}
    />
  );
}

export default IntelligencePage;
