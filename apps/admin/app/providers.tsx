"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "@/app/features/sales-data/getQueryClient";

export function Providers({ children }: { children: React.ReactNode }): React.ReactElement {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
