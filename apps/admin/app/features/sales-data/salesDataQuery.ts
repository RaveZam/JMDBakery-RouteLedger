import type { SalesRecord } from "@/app/server/getBaseData";

export const SALES_DATASET_QUERY_KEY = ["sales-dataset"] as const;

export async function fetchSalesDataset(): Promise<SalesRecord[]> {
  const res = await fetch("/api/sales-dataset");
  if (!res.ok) throw new Error("Failed to load sales dataset");
  return res.json();
}
