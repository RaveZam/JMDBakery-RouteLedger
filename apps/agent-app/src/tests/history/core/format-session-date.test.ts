import { formatSessionDate } from "@/src/features/history/core/format-session-date";

// Local-time ISO strings (no Z) keep the expected day stable in any timezone.
test("formats a parseable date as 'Mon D, YYYY'", () => {
  expect(formatSessionDate("2026-06-30T12:00:00")).toBe("Jun 30, 2026");
});

test("formats a single-digit day without padding", () => {
  expect(formatSessionDate("2026-01-05T12:00:00")).toBe("Jan 5, 2026");
});

test("falls back to the raw value when it isn't a parseable date", () => {
  expect(formatSessionDate("not-a-date")).toBe("not-a-date");
});

test("falls back to the raw value for an empty string", () => {
  expect(formatSessionDate("")).toBe("");
});
