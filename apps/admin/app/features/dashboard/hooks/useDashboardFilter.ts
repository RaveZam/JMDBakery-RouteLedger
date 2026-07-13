import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { SalesRecord } from "@/app/server/getBaseData";
import { FilterRange } from "../types/dashboard-types";
import { getDateRange } from "../helpers/getDateRange";

export function useDashboardFilter(allData: SalesRecord[]) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterRange>("7days");

  function onFilterChange(newFilter: FilterRange) {
    const date = getDateRange(newFilter);
    setFilter(newFilter);
    router.push(`?dateFrom=${date.from}&dateTo=${date.to}`);
  }

  const { from: rangeFrom, to: rangeTo } = getDateRange(filter);
  const data = useMemo(
    () => allData.filter((r) => r.date >= rangeFrom && r.date <= rangeTo),
    [allData, rangeFrom, rangeTo],
  );

  return { filter, data, onFilterChange };
}
