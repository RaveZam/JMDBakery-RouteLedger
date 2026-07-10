import { render, screen, fireEvent } from "@testing-library/react-native";
import { HistorySessionCard } from "@/src/features/history/components/HistorySessionCard";
import type { SessionRow } from "@/src/features/history/hooks/useHistoryList";

jest.mock("expo-router", () => ({ router: { push: jest.fn() } }));

beforeEach(() => {
  jest.clearAllMocks();
});

function makeSession(overrides: Partial<SessionRow> = {}): SessionRow {
  return {
    id: "sess-1",
    route_name: "North Route",
    // Local-time ISO (no Z) keeps the rendered day stable in any timezone.
    session_date: "2026-06-30T12:00:00",
    conducted_by: "agent-1234",
    status: "completed",
    morning_inventory_finished: 1,
    created_at: "2026-06-30T00:00:00.000Z",
    ...overrides,
  };
}

test("shows the route name, formatted date with agent prefix, and status", () => {
  render(<HistorySessionCard session={makeSession()} />);

  expect(screen.getByText("North Route")).toBeOnTheScreen();
  expect(screen.getByText("Jun 30, 2026 • agent")).toBeOnTheScreen(); // first 5 chars of conducted_by
  expect(screen.getByText("completed")).toBeOnTheScreen();
});

test("shows the raw status for ongoing and cancelled sessions too", () => {
  render(<HistorySessionCard session={makeSession({ id: "s2", status: "ongoing" })} />);
  expect(screen.getByText("ongoing")).toBeOnTheScreen();

  render(<HistorySessionCard session={makeSession({ id: "s3", status: "cancelled" })} />);
  expect(screen.getByText("cancelled")).toBeOnTheScreen();
});

test("pressing the card opens the session detail with its id and route name", () => {
  const { router } = require("expo-router");
  render(<HistorySessionCard session={makeSession()} />);

  fireEvent.press(screen.getByText("North Route"));

  expect(router.push).toHaveBeenCalledWith({
    pathname: "/main/history/[sessionId]",
    params: { sessionId: "sess-1", routeName: "North Route" },
  });
});
