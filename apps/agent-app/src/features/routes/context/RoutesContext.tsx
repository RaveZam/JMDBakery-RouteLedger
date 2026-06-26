import { createContext, ReactNode } from "react";
import { useRoutes } from "../hooks/useRoutes";

// Share a single useRoutes() instance across the routes screen so the list and
// its modals refresh off the same state — no duplicate hook instances, no props.
export const RoutesContext = createContext<ReturnType<typeof useRoutes> | null>(
  null,
);

export function RoutesProvider({ children }: { children: ReactNode }) {
  return (
    <RoutesContext.Provider value={useRoutes()}>
      {children}
    </RoutesContext.Provider>
  );
}
