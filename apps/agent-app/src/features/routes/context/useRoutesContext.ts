import { useContext } from "react";
import { RoutesContext } from "./RoutesContext";

export function useRoutesContext() {
  const ctx = useContext(RoutesContext);
  if (!ctx) {
    throw new Error("useRoutesContext must be used within a RoutesProvider");
  }
  return ctx;
}
