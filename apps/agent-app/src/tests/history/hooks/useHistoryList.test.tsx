// Hook test against the real SQLite engine: useHistoryList is a thin read of
// route_sessions, so the interesting behavior is (a) newest-first ordering
// straight from the DAO and (b) re-reading when the screen regains focus.
// expo-router's useFocusEffect is mocked so the test can fire the focus
// callback on demand.
import { renderHook, act } from "@testing-library/react-native";
import {
  createSchema,
  resetDb,
} from "@/src/test-utils/db-test-helpers";
import RouteSessionsDao from "@/src/lib/dao/route-sessions-dao";
import { useHistoryList } from "@/src/features/history/hooks/useHistoryList";
import { useFocusEffect } from "expo-router";

jest.mock("expo-router", () => ({ useFocusEffect: jest.fn() }));

const mockUseFocusEffect = useFocusEffect as jest.Mock;

beforeAll(async () => { await createSchema(); });
beforeEach(() => {
  resetDb();
  jest.clearAllMocks();
});

// Seeds are 'completed' — the schema allows only one 'ongoing' session at a
// time, and this hook doesn't care about status.
function seedSession(routeName: string, createdAt: string): string {
  return RouteSessionsDao.upsertSession({
    routeName,
    sessionDate: "2026-06-30",
    conductedBy: "user-1",
    status: "completed",
    createdAt,
  });
}

test("returns the sessions newest first", () => {
  seedSession("Older Route", "2026-06-29T00:00:00.000Z");
  seedSession("Newer Route", "2026-06-30T00:00:00.000Z");

  const { result } = renderHook(() => useHistoryList());

  expect(result.current.history.sessions.map((s) => s.route_name)).toEqual([
    "Newer Route",
    "Older Route",
  ]);
});

test("returns an empty list when there are no sessions", () => {
  const { result } = renderHook(() => useHistoryList());

  expect(result.current.history.sessions).toEqual([]);
});

test("re-reads the sessions when the screen regains focus", () => {
  const { result } = renderHook(() => useHistoryList());
  expect(result.current.history.sessions).toHaveLength(0);

  seedSession("Started Elsewhere", "2026-06-30T00:00:00.000Z");
  const focusCallback = mockUseFocusEffect.mock.calls[0][0];
  act(() => focusCallback());

  expect(result.current.history.sessions).toHaveLength(1);
  expect(result.current.history.sessions[0].route_name).toBe("Started Elsewhere");
});
