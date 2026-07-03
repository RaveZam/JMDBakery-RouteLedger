import { SessionRouteProvider } from "../context/SessionRouteProvider";
import SessionRouteScreenContent from "./SessionRouteScreenContent";

export default function SessionRouteScreen() {
  return (
    <SessionRouteProvider>
      <SessionRouteScreenContent />
    </SessionRouteProvider>
  );
}
