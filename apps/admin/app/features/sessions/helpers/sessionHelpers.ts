import type { InventorySummaryRow } from "../types/session-types";

export function formatSessionDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function visitRate(visited: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((visited / total) * 100)}%`;
}

export function sumSales(
  sales: { quantitySold: number; quantityBO: number; total: number }[],
): { quantitySold: number; quantityBO: number; total: number } {
  return sales.reduce(
    (sum, s) => ({
      quantitySold: sum.quantitySold + s.quantitySold,
      quantityBO: sum.quantityBO + s.quantityBO,
      total: sum.total + s.total,
    }),
    { quantitySold: 0, quantityBO: 0, total: 0 },
  );
}

type InventorySnapshotRow = {
  productId: string;
  productName: string;
  quantity: number;
};

type SessionSaleAggRow = {
  productId: string;
  productName: string;
  quantitySold: number;
  quantityBO: number;
};

type InventoryAgg = {
  productName: string;
  morning: number;
  sold: number;
  backOrder: number;
  ending: number;
};

function buildInventoryAggMap(
  morning: InventorySnapshotRow[],
  ending: InventorySnapshotRow[],
  sales: SessionSaleAggRow[],
): Map<string, InventoryAgg> {
  const byProduct = new Map<string, InventoryAgg>();

  function entry(productId: string, productName: string): InventoryAgg {
    let e = byProduct.get(productId);
    if (!e) {
      e = { productName, morning: 0, sold: 0, backOrder: 0, ending: 0 };
      byProduct.set(productId, e);
    }
    return e;
  }

  for (const row of morning) {
    entry(row.productId, row.productName).morning += row.quantity;
  }
  for (const row of ending) {
    entry(row.productId, row.productName).ending += row.quantity;
  }
  for (const row of sales) {
    const e = entry(row.productId, row.productName);
    e.sold += row.quantitySold;
    e.backOrder += row.quantityBO;
  }

  return byProduct;
}

export function mergeInventorySummary(
  morning: InventorySnapshotRow[],
  ending: InventorySnapshotRow[],
  sales: SessionSaleAggRow[],
): InventorySummaryRow[] {
  const byProduct = buildInventoryAggMap(morning, ending, sales);

  return Array.from(byProduct.entries())
    .map(([productId, e]) => {
      const expected = e.morning - e.sold - e.backOrder;
      return {
        productId,
        productName: e.productName,
        morning: e.morning,
        sold: e.sold,
        backOrder: e.backOrder,
        expected,
        ending: e.ending,
        variance: e.ending - expected,
      };
    })
    .sort((a, b) => a.productName.localeCompare(b.productName));
}

export function sumInventory(
  rows: InventorySummaryRow[],
): Omit<InventorySummaryRow, "productId" | "productName"> {
  return rows.reduce(
    (sum, r) => ({
      morning: sum.morning + r.morning,
      sold: sum.sold + r.sold,
      backOrder: sum.backOrder + r.backOrder,
      expected: sum.expected + r.expected,
      ending: sum.ending + r.ending,
      variance: sum.variance + r.variance,
    }),
    { morning: 0, sold: 0, backOrder: 0, expected: 0, ending: 0, variance: 0 },
  );
}
