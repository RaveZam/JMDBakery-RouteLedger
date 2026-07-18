import type { DataPoint, ForecastChartData, SalesPoint } from "../types";
import * as ss from "simple-statistics";
import { MONTH_LABELS, nowInManila, toDateKey, addDays } from "./dateUtils";
import { computeForecastBounds } from "./computeForecastBounds";

const WEEKS_PER_MONTH = 4;
const ACTUALS_WINDOW_DAYS = 31;

const yFormatter = (v: number): string => `₱${(v / 1000).toFixed(0)}k`;

/** Week-of-month for a day, 1-4. The last week absorbs days 29-31. */
function weekOfMonth(day: number): number {
  return Math.min(WEEKS_PER_MONTH, Math.floor((day - 1) / 7) + 1);
}

function weekStart(date: Date): Date {
  const week = weekOfMonth(date.getUTCDate());
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1 + (week - 1) * 7),
  );
}

function weekLabel(period: string): string {
  const date = new Date(period);
  return `${MONTH_LABELS[date.getUTCMonth()]} W${weekOfMonth(date.getUTCDate())}`;
}

function projectedWeeks(
  line: (x: number) => number,
  historyLength: number,
  now: Date,
): DataPoint[] {
  const monthName = MONTH_LABELS[now.getUTCMonth()];
  const nextMonthName = MONTH_LABELS[(now.getUTCMonth() + 1) % 12];

  const labels: string[] = [];
  for (
    let week = weekOfMonth(now.getUTCDate());
    week <= WEEKS_PER_MONTH;
    week++
  ) {
    labels.push(`${monthName} W${week}`);
  }
  labels.push(`${nextMonthName} W1`);

  return labels.map((label, step) => ({
    label,
    forecast: Math.max(0, Math.round(line(historyLength + step))),
  }));
}

export function forecastNextMonth(weekly: SalesPoint[]): ForecastChartData {
  const title = "Next Month Revenue Forecast";
  const now = nowInManila();

  // The in-progress week is partial, so including it would drag the trend down
  // and plot a misleadingly low bar for "this week".
  const currentWeek = toDateKey(weekStart(now));
  const history = weekly.filter((w) => w.period < currentWeek);

  if (history.length < 2) {
    return { title, forecastStart: "", forecastEnd: "", yFormatter, data: [] };
  }

  const line = ss.linearRegressionLine(
    ss.linearRegression(history.map((w, i) => [i, w.total_sales])),
  );

  const windowStart = toDateKey(weekStart(addDays(now, -ACTUALS_WINDOW_DAYS)));

  // Appended in chronological order, so no re-sort is needed -- sorting by
  // month name would misorder a December-to-January span.
  const data: DataPoint[] = [
    ...history
      .filter((w) => w.period >= windowStart)
      .map((w) => ({ label: weekLabel(w.period), actual: w.total_sales })),
    ...projectedWeeks(line, history.length, now),
  ];

  return { title, ...computeForecastBounds(data), yFormatter, data };
}
