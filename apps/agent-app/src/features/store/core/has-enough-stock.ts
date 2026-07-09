export type StockCheckInput = {
  qty: number;
  boQty: number;
  remaining: number;
  editingOriginal?: { qty: number; boQty: number };
};

// True when the requested qty+boQty fits within what's left of truck stock.
// When editing an existing sale, its own original qty/boQty is added back to
// remaining first, since remaining already has that sale's units subtracted.
export function hasEnoughStock(input: StockCheckInput): boolean {
  const requested = input.qty + input.boQty;
  const available =
    input.remaining +
    (input.editingOriginal
      ? input.editingOriginal.qty + input.editingOriginal.boQty
      : 0);
  return requested <= available;
}
