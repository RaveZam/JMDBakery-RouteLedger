import { createContext, type ReactNode } from "react";
import { useInventory } from "../hooks/useInventory";
import type { Inventory } from "../types/inventory-types";

export interface MorningInventoryContextValue {
  inventory: Inventory;
}

export const MorningInventoryContext = createContext<
  MorningInventoryContextValue | undefined
>(undefined);

export function MorningInventoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { inventory } = useInventory();

  return (
    <MorningInventoryContext.Provider value={{ inventory }}>
      {children}
    </MorningInventoryContext.Provider>
  );
}
