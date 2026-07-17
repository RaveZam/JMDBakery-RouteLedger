import { useQuery } from "@tanstack/react-query";
import { getSalesDataset } from "@/app/server/salesData/getBaseData";

export const SALES_DATASET_QUERY_KEY = ["sales-dataset"] as const;

export function useSalesDataQuery() {
  const { data, isLoading, error } = useQuery({
    queryKey: SALES_DATASET_QUERY_KEY,
    queryFn: getSalesDataset,
  });

  return { data: data ?? [], isLoading, error: error as Error | null };
}
