import type { DataPoint, ForecastChartData, SalesPoint } from "../types";
import { nowInManila, toDateKey, addDays } from "./dateUtils";
import { computeForecastBounds } from "./computeForecastBounds";

const DAYS_SHOWN = 7;
const DAYS_FORECAST = 7;

const yFormatter = (v: number): string => `₱${(v / 1000).toFixed(0)}k`;

export function forecastNextWeek(daily: SalesPoint[]): ForecastChartData {
  const revenueByDate = new Map(daily.map((d) => [d.period, d.total_sales]));

  const weekdayTotals = new Map<number, { revenue: number; days: number }>();
  for (const point of daily) {
    const weekday = new Date(point.period).getUTCDay();
    const existing = weekdayTotals.get(weekday);
    if (existing) {
      existing.revenue += point.total_sales;
      existing.days += 1;
    } else {
      weekdayTotals.set(weekday, { revenue: point.total_sales, days: 1 });
    }
  }
  const today = nowInManila();
  const data: DataPoint[] = [];

  for (let offset = DAYS_SHOWN - 1; offset >= 0; offset--) {
    const label = toDateKey(addDays(today, -offset));
    data.push({ label, actual: revenueByDate.get(label) ?? 0 });
  }

  for (let offset = 1; offset <= DAYS_FORECAST; offset++) {
    const date = addDays(today, offset);
    const weekday = weekdayTotals.get(date.getUTCDay());
    data.push({
      label: toDateKey(date),
      forecast: weekday ? Math.round(weekday.revenue / weekday.days) : 0,
    });
  }

  return {
    title: "7-day revenue forecast",
    ...computeForecastBounds(data),
    yFormatter,
    data,
  };
}
