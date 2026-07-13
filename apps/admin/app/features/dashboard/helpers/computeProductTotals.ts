import type { ProductBoRecord } from "../types/dashboard-types";

export function computeProductTotals(data: ProductBoRecord[]) {
  const totals: { [product: string]: { sold: number; bo: number } } = {};

  for (const row of data) {
    if (!totals[row.product]) totals[row.product] = { sold: 0, bo: 0 };
    totals[row.product].sold += row.soldQty;
    totals[row.product].bo += row.boQty;
  }

  return Object.entries(totals)
    .map(([product, { sold, bo }]) => ({ product, sold, bo }))
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);
}
