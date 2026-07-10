import {
  countVisited,
  sumItemsTotal,
} from "@/src/features/history/core/session-derived";

test("countVisited counts only stores with visited = 1", () => {
  const stores = [{ visited: 1 }, { visited: 0 }, { visited: 1 }, { visited: 0 }];
  expect(countVisited(stores)).toBe(2);
});

test("countVisited returns 0 for an empty list", () => {
  expect(countVisited([])).toBe(0);
});

test("sumItemsTotal sums price * qty across items", () => {
  const items = [
    { price: 10, qty: 3 },
    { price: 5, qty: 4 },
  ];
  expect(sumItemsTotal(items)).toBe(50);
});

test("sumItemsTotal returns 0 for an empty list", () => {
  expect(sumItemsTotal([])).toBe(0);
});

test("sumItemsTotal counts zero-qty items as nothing", () => {
  expect(sumItemsTotal([{ price: 25, qty: 0 }])).toBe(0);
});
