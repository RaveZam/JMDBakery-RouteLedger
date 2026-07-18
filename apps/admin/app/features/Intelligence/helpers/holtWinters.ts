const LEVEL_SMOOTHING = 0.3;
const TREND_SMOOTHING = 0.05;
const SEASONAL_SMOOTHING = 0.2;

/** Seasons of history needed before the model can be fitted: one to seed the
 * seasonal indices and one to update them. Below this, seasonality and trend
 * are not separable and the fit is meaningless. */
export const HOLT_WINTERS_MIN_SEASONS = 2;

/** Fits an additive Holt-Winters model (level + trend + seasonality) over an
 * evenly spaced value series and returns a function forecasting `horizon`
 * steps past the end of the series.
 *
 * `seasonLength` is in steps, not days -- 7 for a daily series with weekly
 * seasonality, 12 for a monthly series with yearly seasonality. Callers must
 * supply at least HOLT_WINTERS_MIN_SEASONS full seasons. */
function seasonAverage(values: number[], season: number, length: number): number {
  const start = season * length;
  return (
    values.slice(start, start + length).reduce((sum, v) => sum + v, 0) / length
  );
}

type Smoothed = { level: number; trend: number; seasonal: number[] };

/** Runs the Holt-Winters recursion over the series, returning the final level
 * and trend plus the full seasonal index array. Seeds level and trend from the
 * first two seasons, and the seasonal indices from deviations about the first. */
function smooth(values: number[], seasonLength: number): Smoothed {
  const n = values.length;

  const firstSeasonAvg = seasonAverage(values, 0, seasonLength);
  const secondSeasonAvg =
    n >= seasonLength * 2
      ? seasonAverage(values, 1, seasonLength)
      : firstSeasonAvg;

  let level = firstSeasonAvg;
  let trend = (secondSeasonAvg - firstSeasonAvg) / seasonLength;

  const seasonal = new Array(n).fill(0);
  for (let i = 0; i < seasonLength; i++) {
    seasonal[i] = values[i] - firstSeasonAvg;
  }

  for (let t = seasonLength; t < n; t++) {
    const priorSeasonalIdx = t - seasonLength;
    const previousLevel = level;
    level =
      LEVEL_SMOOTHING * (values[t] - seasonal[priorSeasonalIdx]) +
      (1 - LEVEL_SMOOTHING) * (level + trend);
    trend =
      TREND_SMOOTHING * (level - previousLevel) + (1 - TREND_SMOOTHING) * trend;
    seasonal[t] =
      SEASONAL_SMOOTHING * (values[t] - level) +
      (1 - SEASONAL_SMOOTHING) * seasonal[priorSeasonalIdx];
  }

  return { level, trend, seasonal };
}

export function fitHoltWinters(
  values: number[],
  seasonLength: number,
): (horizon: number) => number {
  const n = values.length;
  const SEASON_LENGTH = seasonLength;
  const { level: finalLevel, trend: finalTrend, seasonal } = smooth(
    values,
    SEASON_LENGTH,
  );

  return (horizon: number) => {
    const seasonalIdx = n - SEASON_LENGTH + ((horizon - 1) % SEASON_LENGTH);
    return finalLevel + horizon * finalTrend + seasonal[seasonalIdx];
  };
}
