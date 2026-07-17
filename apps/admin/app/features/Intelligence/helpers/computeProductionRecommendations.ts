import type { SalesRecord } from "@/app/server/salesData/getBaseData";

export type ProductionRecommendation = {
  product: string;
  totalSold: number;
  activeDays: number;
  recommended: number;
};

/**
 * Recommended daily bake quantity per product: 30-day sold total divided by
 * the number of distinct days that had any sales (not a flat 30), so days
 * JMD doesn't operate don't drag the average down.
 */
export function computeProductionRecommendations(
  records: SalesRecord[],
): ProductionRecommendation[] {
  const activeDays = new Set(records.map((r) => r.date)).size;

  const totals = new Map<string, number>();
  for (const record of records) {
    totals.set(record.product, (totals.get(record.product) ?? 0) + record.soldQty);
  }

  return Array.from(totals.entries())
    .map(([product, totalSold]) => ({
      product,
      totalSold,
      activeDays,
      recommended: activeDays === 0 ? 0 : Math.round(totalSold / activeDays),
    }))
    .sort((a, b) => b.recommended - a.recommended);
}
