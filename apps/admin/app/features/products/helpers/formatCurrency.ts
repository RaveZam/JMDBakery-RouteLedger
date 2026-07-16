const phpFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export function formatCurrencyPHP(value: number): string {
  return phpFormatter.format(value);
}

// Amount only (no ₱ symbol) so the peso sign can be styled separately.
const phpAmountFormatter = new Intl.NumberFormat("en-PH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatAmountPHP(value: number): string {
  return phpAmountFormatter.format(value);
}
