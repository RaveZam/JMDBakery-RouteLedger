export type SaleInputCheck = {
  qty: number;
  boQty: number;
  boReason: string;
};

export type SaleInputValidity = {
  valid: boolean;
  needsReason: boolean;
};

// A sale needs a positive qty or BO qty, and a reason once BO qty is set.
export function validateSaleInput(input: SaleInputCheck): SaleInputValidity {
  const needsReason = input.boQty > 0 && !input.boReason;
  const valid = (input.qty > 0 || input.boQty > 0) && !needsReason;
  return { valid, needsReason };
}
