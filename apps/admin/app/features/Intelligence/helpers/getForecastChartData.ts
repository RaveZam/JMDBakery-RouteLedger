import type { ForecastChartData, ForecastRange, SalesPoint } from "../types";
import { forecastNextWeek } from "./forecastNextWeek";
import { forecastNextMonth } from "./forecastNextMonth";
import { forecastNextYear } from "./forecastNextYear";

/** Each range is fed by its own RPC, so `points` arrives already bucketed to
 * match: daily for weekly, weekly for monthly, monthly for yearly. */
export function getForecastChartData(
  range: ForecastRange,
  points: SalesPoint[],
): ForecastChartData {
  if (range === "monthly") return forecastNextMonth(points);
  if (range === "yearly") return forecastNextYear(points);
  return forecastNextWeek(points);
}
