"use client";

import { useMemo } from "react";
import { getIntelligenceMetrics } from "../helpers/getIntelligenceMetrics";
import { computeProvinceRevenue } from "../helpers/computeProvinceRevenue";
import { IntelligenceHeader } from "./panels/IntelligenceHeader";
import { BusinessHealthOverview } from "./panels/BusinessHealthOverview";
import { NextBestActions } from "./panels/NextBestActions";
import { ForecastSection } from "./panels/ForecastSection";
import { MorningInventoryInsights } from "./panels/MorningInventoryInsights";
import type { GeoRevenueRow } from "../../dashboard/services/revenueGeoService";
import { useSalesData } from "@/app/features/sales-data/SalesDataProvider";
import { parseRecordsFiltersLast30Days } from "@/lib/selectors/filters";

type SearchParams = Record<string, string | string[] | undefined>;

export function IntelligencePageClient({
  sp,
  yearData,
  allTimeData,
  barangays,
}: {
  sp: SearchParams;
  yearData: any;
  allTimeData: any;
  barangays: GeoRevenueRow[];
}) {
  const { data: allData } = useSalesData();
  const filters = parseRecordsFiltersLast30Days(sp);

  const data = useMemo(
    () =>
      allData.filter(
        (r) => r.date >= filters.dateFrom && r.date <= filters.dateTo,
      ),
    [allData, filters.dateFrom, filters.dateTo],
  );
  const provinces = useMemo(() => computeProvinceRevenue(allData), [allData]);
  const metrics = getIntelligenceMetrics(data);

  return (
    <>
      <IntelligenceHeader />
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1200px] space-y-6">
          <BusinessHealthOverview metrics={metrics} />
          <NextBestActions />
          <ForecastSection
            data={data}
            yearData={yearData}
            allTimeData={allTimeData}
          />
          <MorningInventoryInsights
            provinces={provinces}
            barangays={barangays}
          />
        </div>
      </div>
    </>
  );
}
