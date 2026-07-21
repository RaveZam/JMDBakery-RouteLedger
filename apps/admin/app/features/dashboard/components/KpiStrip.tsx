import { Banknote, Percent, PackageX, ShoppingBag, Store } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
        primary={totalSold.toLocaleString() + " pcs"}
        accent="gold"
        icon={ShoppingBag}
      />
      <Card className="border-border/70 shadow-soft dark:shadow-soft-dark">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[13px] font-medium text-muted-foreground">
                {`Total BO · ${label}`}
              </p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400">
                <PackageX className="h-[18px] w-[18px]" />
              </span>
            </div>
            <p className="mt-3 text-[28px] font-semibold leading-none tracking-tight tabular-nums">
              {Number(totalBO).toLocaleString() + " pcs"}
            </p>
          </div>
          <div className="h-16 w-px shrink-0 bg-border" />
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[13px] font-medium text-muted-foreground">
                BO Rate
              </p>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400">
                <Percent className="h-[18px] w-[18px]" />
              </span>
            </div>
            <p className="mt-3 text-[28px] font-semibold leading-none tracking-tight tabular-nums">
              {finalBboRate.toFixed(2) + "%"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
