import type { SalesRecord } from "@/app/server/salesData/getBaseData";

export type ProductionRecommendation = {
  product: string;
  totalSold: number;
  avgSoldPerDay: number;
  avgBadOrderPerDay: number;
  recommended: number;
};

export function computeProductionRecommendations(
  records: SalesRecord[],
): ProductionRecommendation[] {
  const activeDays = new Set(records.map((r) => r.date)).size;

  const sold = new Map<string, number>();
  const badOrder = new Map<string, number>();
  for (const record of records) {
    sold.set(record.product, (sold.get(record.product) ?? 0) + record.soldQty);
    badOrder.set(
      record.product,
      (badOrder.get(record.product) ?? 0) + record.boQty,
    );
  }

  return Array.from(sold.entries())

    .map(([product, totalSold]) => {
      const totalBadOrder = badOrder.get(product) ?? 0;
      const avgSoldPerDay = activeDays === 0 ? 0 : totalSold / activeDays;
      return {
        product,
        totalSold,
        avgSoldPerDay,
        avgBadOrderPerDay: activeDays === 0 ? 0 : totalBadOrder / activeDays,
        recommended: Math.round(avgSoldPerDay),
      };
    })
    .sort((a, b) => b.recommended - a.recommended);
}
