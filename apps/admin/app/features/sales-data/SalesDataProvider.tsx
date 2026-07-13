"use client";

import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SalesRecord } from "@/app/server/getBaseData";
import { SALES_DATASET_QUERY_KEY, fetchSalesDataset } from "./salesDataQuery";

type SalesDataContextValue = {
  data: SalesRecord[];
  isLoading: boolean;
  error: Error | null;
};

const SalesDataContext = createContext<SalesDataContextValue | null>(null);

export function SalesDataProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, error } = useQuery({
    queryKey: SALES_DATASET_QUERY_KEY,
    queryFn: fetchSalesDataset,
  });

  return (
    <SalesDataContext.Provider
      value={{ data: data ?? [], isLoading, error: error as Error | null }}
    >
      {children}
    </SalesDataContext.Provider>
  );
}

export function useSalesData(): SalesDataContextValue {
  const ctx = useContext(SalesDataContext);
  if (!ctx) throw new Error("useSalesData must be used within a SalesDataProvider");
  return ctx;
}
