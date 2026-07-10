// Falls back to the raw value when it isn't a parseable date, so callers
// don't have to guard before rendering.
export function formatSessionDate(value: string): string {
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
