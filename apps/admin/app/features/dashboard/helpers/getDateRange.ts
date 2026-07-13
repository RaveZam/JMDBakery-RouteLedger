import { formatLocalISODate } from "@/lib/selectors/filters";
import { FilterRange } from "../types/dashboard-types";

export function getDateRange(filter: FilterRange): { from: string; to: string } {
  const today = formatLocalISODate(new Date());

  if (filter === "today") {
    return { from: today, to: today };
  }

  const days = filter === "7days" ? 6 : 29;
  const from = new Date();
  from.setDate(from.getDate() - days);
  return { from: formatLocalISODate(from), to: today };
}
