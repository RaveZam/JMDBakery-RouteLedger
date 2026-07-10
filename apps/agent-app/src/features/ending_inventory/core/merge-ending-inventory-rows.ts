import type { InventoryItem } from "@/src/lib/dao/session-inventory-dao";
import type { EndingInventoryItem } from "@/src/lib/dao/ending-inventory-dao";
import type { EndingInventoryRow } from "../types/ending-inventory-types";

export function mergeEndingInventoryRows(
  morningItems: InventoryItem[],
  remaining: Record<string, number>,
  saved: EndingInventoryItem[],
): EndingInventoryRow[] {
  const savedByProduct = new Map(saved.map((row) => [row.productId, row]));
  return morningItems.map((item) => {
    const expected = remaining[item.productId] ?? 0;
    const savedRow = savedByProduct.get(item.productId);
    return {
      id: savedRow?.id,
      productId: item.productId,
      productName: item.productName,
      expected,
      quantity: savedRow?.quantity ?? expected,
    };
  });
}
