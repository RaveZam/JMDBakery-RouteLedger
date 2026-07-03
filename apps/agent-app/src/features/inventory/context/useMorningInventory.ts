import { useContext } from "react";
import { MorningInventoryContext } from "./MorningInventoryProvider";

export function useMorningInventory() {
  const context = useContext(MorningInventoryContext);
  if (context === undefined) {
    throw new Error(
      "useMorningInventory must be used within a MorningInventoryProvider",
    );
  }
  return context;
}
