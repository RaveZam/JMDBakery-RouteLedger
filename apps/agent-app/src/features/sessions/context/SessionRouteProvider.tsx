import { createContext, type ReactNode } from "react";
import { useSession } from "../hooks/useSession";

export interface SessionRouteContextValue {
  session: ReturnType<typeof useSession>["session"];
}

export const SessionRouteContext = createContext<
  SessionRouteContextValue | undefined
>(undefined);

export function SessionRouteProvider({ children }: { children: ReactNode }) {
  const { session } = useSession();

  return (
    <SessionRouteContext.Provider value={{ session }}>
      {children}
    </SessionRouteContext.Provider>
  );
}
