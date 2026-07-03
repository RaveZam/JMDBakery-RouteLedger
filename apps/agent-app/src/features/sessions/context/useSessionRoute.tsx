import { useContext } from "react";
import { SessionRouteContext } from "./SessionRouteProvider";

export function useSessionRoute() {
  const context = useContext(SessionRouteContext);
  if (context === undefined) {
    throw new Error(
      "useSessionRoute must be used within a SessionRouteProvider",
    );
  }
  return context;
}
