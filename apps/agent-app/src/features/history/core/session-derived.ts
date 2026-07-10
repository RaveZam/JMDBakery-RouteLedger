export function countVisited(stores: { visited: number }[]): number {
  return stores.filter((s) => s.visited === 1).length;
}

export function sumItemsTotal(items: { price: number; qty: number }[]): number {
  return items.reduce((sum, it) => sum + it.price * it.qty, 0);
}

export function filterStoresByQuery<T extends { store_name: string }>(
  stores: T[],
  query: string,
): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return stores;
  return stores.filter((s) => s.store_name.toLowerCase().includes(q));
}

export type ProvinceGroup<T> = {
  provinceName: string;
  stores: T[];
  visitedCount: number;
};

export function groupStoresByProvince<
  T extends { province_name?: string | null; visited: number },
>(stores: T[]): ProvinceGroup<T>[] {
  const order: string[] = [];
  const map = new Map<string, T[]>();
  for (const s of stores) {
    const key = s.province_name?.trim() || "Unassigned";
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(s);
  }
  return order.map((provinceName) => {
    const groupStores = map.get(provinceName)!;
    return {
      provinceName,
      stores: groupStores,
      visitedCount: countVisited(groupStores),
    };
  });
}
