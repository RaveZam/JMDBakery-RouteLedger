import { getSessionBadgeVariant } from "@/src/features/history/core/session-badge-variant";

test("maps completed to the done variant", () => {
  expect(getSessionBadgeVariant("completed")).toBe("done");
});

test("maps cancelled to the cancelled variant", () => {
  expect(getSessionBadgeVariant("cancelled")).toBe("cancelled");
});

test("maps ongoing to the ongoing variant", () => {
  expect(getSessionBadgeVariant("ongoing")).toBe("ongoing");
});

test("treats an unknown status as ongoing", () => {
  expect(getSessionBadgeVariant("something-new")).toBe("ongoing");
});
