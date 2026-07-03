import type { SessionStore } from "../types/session-types";

export type SessionStoreSection = { title: string; data: SessionStore[] };

export function groupStoresByProvince(
  stores: SessionStore[],
): SessionStoreSection[] {
  const sectionsByTitle = new Map<string, SessionStore[]>();
  for (const store of stores) {
    const title = store.province_name ?? "Unknown";
    const data = sectionsByTitle.get(title);
    if (data) data.push(store);
    else sectionsByTitle.set(title, [store]);
  }

  return Array.from(sectionsByTitle, ([title, data]) => ({ title, data }));
}
