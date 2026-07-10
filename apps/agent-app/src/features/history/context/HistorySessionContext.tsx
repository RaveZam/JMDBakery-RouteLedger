import { createContext, useContext, type ReactNode } from "react";
import {
  useHistorySession,
  type HistorySession,
} from "../hooks/useHistorySession";

const HistorySessionContext = createContext<HistorySession | null>(null);

export function HistorySessionProvider({ children }: { children: ReactNode }) {
  const { session } = useHistorySession();
  return (
    <HistorySessionContext.Provider value={session}>
      {children}
    </HistorySessionContext.Provider>
  );
}

export function useHistorySessionContext(): HistorySession {
  const session = useContext(HistorySessionContext);
  if (!session) {
    throw new Error(
      "useHistorySessionContext must be used within HistorySessionProvider",
    );
  }
  return session;
}
