import { Banknote, PackageX, ShoppingBag, Store } from "lucide-react";
import { KpiCard } from "./KpiCard";
import { computeSalesKPI } from "../helpers/computeSalesKPI";
import { FilterRange, SalesKpiRecord } from "../types/dashboard-types";

const FILTER_LABEL: Record<FilterRange, string> = {
  today: "Today",
  "7days": "Past 7 Days",
  "30days": "Past 30 Days",
};

export function KpiStrip({ data, filter }: { data: SalesKpiRecord[]; filter: FilterRange }) {
  const { totalSales, avgPerStore, totalBO, finalBboRate, totalSold } =
    computeSalesKPI(data);

  const label = FILTER_LABEL[filter];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <KpiCard
        title={`Total Sales · ${label}`}
        primary={"₱" + totalSales.toLocaleString()}
        tone="hero"
        icon={Banknote}
      />
      <KpiCard
        title="Avg Sales per Store"
        primary={
          "₱" +
          avgPerStore.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })
        }
        accent="green"
        icon={Store}
      />
      <KpiCard
        title={`Total Sold · ${label}`}
        primary={totalSold.toLocaleString()}
        unit="pcs"
        accent="gold"
        icon={ShoppingBag}
      />
      <KpiCard
        title={`Bad Order · ${label}`}
        primary={finalBboRate.toFixed(2) + "%"}
        secondary={`${Number(totalBO).toLocaleString()} pieces`}
        accent="red"
        icon={PackageX}
      />
    </div>
  );
}
