export function countVisited(stores: { visited: number }[]): number {
  return stores.filter((s) => s.visited === 1).length;
}

export function sumItemsTotal(items: { price: number; qty: number }[]): number {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}
