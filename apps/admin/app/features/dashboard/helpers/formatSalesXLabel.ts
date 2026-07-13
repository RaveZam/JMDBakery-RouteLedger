import type { FilterRange } from "../types/dashboard-types";

export function formatSalesXLabel(dateStr: string, filter: FilterRange): string {
  const date = new Date(dateStr);
  if (filter === "30days") {
    return date.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString("en-PH", { weekday: "short" });
}
