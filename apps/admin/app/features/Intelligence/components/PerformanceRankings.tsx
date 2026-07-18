"use client";

import { useMemo } from "react";
import type { SalesRecord } from "@/app/server/salesData/getBaseData";
import { computeProductBoRate } from "../helpers/computeProductBoRate";
import { computeAgentBoRate } from "../helpers/computeAgentBoRate";
import { ProvinceRankingChart } from "./ProvinceRankingChart";
import { BoRateTable } from "./BoRateTable";

export function PerformanceRankings({ records }: { records: SalesRecord[] }) {
  const productBoRate = useMemo(() => computeProductBoRate(records), [records]);
  const agentBoRate = useMemo(() => computeAgentBoRate(records), [records]);

  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">Performance rankings</h2>
      <div className="grid gap-4 xl:grid-cols-3">
        <ProvinceRankingChart records={records} />
        <BoRateTable
          title="Product bad order rate"
          labelHeader="Product"
          rows={productBoRate}
        />
        <BoRateTable
          title="Agent bad order rate"
          labelHeader="Agent"
          rows={agentBoRate}
        />
      </div>
    </section>
  );
}
