import {
  createSchema,
  resetDb,
  seedRouteSession,
  getOutbox,
} from "@/src/test-utils/db-test-helpers";
import RouteSessionsDao from "@/src/lib/dao/route-sessions-dao";
import { cancelHistorySession } from "@/src/features/history/services/cancel-session-service";

beforeAll(async () => { await createSchema(); });
beforeEach(() => { resetDb(); });

test("marks the session cancelled and enqueues the full row as an upsert", () => {
  const sessionId = seedRouteSession();

  cancelHistorySession(sessionId);

  expect(RouteSessionsDao.getById(sessionId)?.status).toBe("cancelled");

  const rows = getOutbox("route_session");
  expect(rows).toHaveLength(1);
  expect(rows[0].operation).toBe("create"); // upsert of the now-cancelled row
  const payload = JSON.parse(rows[0].payload);
  expect(payload).toMatchObject({ id: sessionId, status: "cancelled" });
});

test("enqueues nothing for a session id that doesn't exist", () => {
  cancelHistorySession("no-such-session");

  expect(getOutbox()).toHaveLength(0);
});
