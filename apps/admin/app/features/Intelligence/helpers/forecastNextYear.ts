import type { DataPoint, ForecastChartData, SalesPoint } from "../types";
import { MONTH_LABELS, nowInManila, toDateKey } from "./dateUtils";
import { computeForecastBounds } from "./computeForecastBounds";
import { fitHoltWinters, HOLT_WINTERS_MIN_SEASONS } from "./holtWinters";

const MONTHS_PER_SEASON = 12;
const MONTHS_REQUIRED = MONTHS_PER_SEASON * HOLT_WINTERS_MIN_SEASONS;

const yFormatter = (v: number): string => `₱${(v / 1000).toFixed(0)}k`;

function monthKey(year: number, month: number): string {
  return toDateKey(new Date(Date.UTC(year, month, 1)));
}

function completedMonths(
  revenueByMonth: Map<string, number>,
  year: number,
  month: number,
): number[] {
  const values: number[] = [];
  for (let ago = MONTHS_REQUIRED; ago >= 1; ago--) {
    values.push(revenueByMonth.get(monthKey(year, month - ago)) ?? 0);
  }
  return values;
}

export function forecastNextYear(monthly: SalesPoint[]): ForecastChartData {
  const title = "Yearly Revenue Forecast (Holt-Winters)";

  if (monthly.length < MONTHS_REQUIRED) {
    return { title, forecastStart: "", forecastEnd: "", yFormatter, data: [] };
  }

  const now = nowInManila();
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();

  const revenueByMonth = new Map(monthly.map((m) => [m.period, m.total_sales]));
  const forecastFn = fitHoltWinters(
    completedMonths(revenueByMonth, year, month),
    MONTHS_PER_SEASON,
  );

  const data: DataPoint[] = [];
  for (let m = 0; m < month; m++) {
    data.push({
      label: MONTH_LABELS[m],
      actual: revenueByMonth.get(monthKey(year, m)) ?? 0,
    });
  }

  for (let horizon = 1; horizon <= MONTHS_PER_SEASON - month; horizon++) {
    data.push({
      label: MONTH_LABELS[month + horizon - 1],
      forecast: Math.max(0, Math.round(forecastFn(horizon))),
    });
  }

  return { title, ...computeForecastBounds(data), yFormatter, data };
}
