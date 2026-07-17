import { createSchema, resetDb } from "@/src/test-utils/db-test-helpers";
import RouteSessionsDao from "@/src/lib/dao/route-sessions-dao";
import { downloadReferenceData } from "@/src/lib/sync/download";

jest.mock("@/src/lib/network", () => ({
  isWifiConnected: jest.fn().mockResolvedValue(true),
}));

const mockSessionRow = {
  id: "srv-1",
  route_name: "Server Route",
  session_date: "2026-07-10",
  conducted_by: "user-1",
  conducted_by_name: "Agent One",
  status: "completed",
  created_at: "2026-07-10T00:00:00Z",
  deleted_at: null,
};

const mockRowsByTable: Record<string, unknown[]> = {
  agent_routes: [{ id: "r1", name: "Server Route" }],
  agent_provinces: [],
  stores: [],
  route_sessions: [mockSessionRow],
};

jest.mock("@/src/lib/supabase", () => ({
  supabase: {
    from: jest.fn((table: string) => {
      const rows = mockRowsByTable[table] ?? [];
      const result = { data: rows, error: null };
      const builder: any = {
        select: () => builder,
        is: () => Promise.resolve(result),
        then: (resolve: any, reject: any) =>
          Promise.resolve(result).then(resolve, reject),
      };
      return builder;
    }),
  },
}));

beforeAll(async () => {
  await createSchema();
});

beforeEach(() => {
  resetDb();
});

test("downloaded sessions retain conducted_by_name", async () => {
  await downloadReferenceData();

  expect(RouteSessionsDao.getById("srv-1")?.conducted_by_name).toBe(
    "Agent One",
  );
});
