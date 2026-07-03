// Formats an ISO/date string as "July 3, 2026". Returns "" for missing dates
// so callers don't have to guard before formatting.
export function formatLongDate(date: string | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
