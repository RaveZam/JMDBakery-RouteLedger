export type SessionProgress = {
  visited: number;
  total: number;
  ratio: number; // 0..1, for the progress-bar width
  percent: number; // 0..100 integer, for the "% completed" label
};

export function computeSessionProgress(
  visitedCount: number,
  totalCount: number,
): SessionProgress {
  const ratio = totalCount > 0 ? visitedCount / totalCount : 0;
  return {
    visited: visitedCount,
    total: totalCount,
    ratio,
    percent: Math.round(ratio * 100),
  };
}
