import type { ProductSoldRecord } from "../types/dashboard-types";

export function computeTopProducts(data: ProductSoldRecord[]) {
  const totals: { [product: string]: { qty: number; value: number } } = {};

  for (const row of data) {
    if (!totals[row.product])
      totals[row.product] = {
        qty: 0,
        value: 0,
      };
    totals[row.product].qty += row.soldQty;
    totals[row.product].value += row.total;
  }

  return Object.entries(totals)
    .map(([name, { qty, value }]) => ({ name, qty, value }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);
}
