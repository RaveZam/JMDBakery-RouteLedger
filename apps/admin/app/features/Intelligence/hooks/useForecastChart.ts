"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getDailySales,
  getWeeklySales,
  getMonthlySales,
} from "@/app/server/salesData/getForecastSeries";
import type { ForecastChartData, ForecastRange } from "../types";
import { getForecastChartData } from "../helpers/getForecastChartData";

export type ForecastChartState = {
  range: ForecastRange;
  setRange: (range: ForecastRange) => void;
  isLoading: boolean;
  error: Error | null;
  series: ForecastChartData;
};

const FETCH_BY_RANGE = {
  weekly: getDailySales,
  monthly: getWeeklySales,
  yearly: getMonthlySales,
} as const satisfies Record<ForecastRange, () => Promise<unknown>>;

export function useForecastChart(): ForecastChartState {
  const [range, setRange] = useState<ForecastRange>("weekly");

  const { data, isLoading, error } = useQuery({
    queryKey: ["forecast", range],
    queryFn: () => FETCH_BY_RANGE[range](),
  });

  return {
    range,
    setRange,
    isLoading,
    error: error as Error | null,
    series: getForecastChartData(range, data ?? []),
  };
}
