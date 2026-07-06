# Single Ongoing Session Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Guarantee at most one `ongoing` route session so the app never restores the wrong session's inventory after a restart.

**Architecture:** Prevent duplicate ongoing sessions at three levels — a guard in `startSession`, a partial unique index in SQLite, and a deterministic `getOngoing()`. Add a `cancelled` status + cancel flow so users can free the single ongoing slot. Reset the local DB (v3→v4) to clear existing duplicates and widen the status CHECK.

**Tech Stack:** Expo React Native, `expo-sqlite` (sync API), Jest 29 + jest-expo + React Native Testing Library v13. Integration DB tests run against real SQLite via `__mocks__/expo-sqlite.js` (node:sqlite).

## Global Constraints

- App under `apps/agent-app`; run all commands from there. Test runner: `npm test`.
- Layering (AGENTS.md): DAOs are pure sync data access; multi-table/outbox writes live in `services/` wrapped in `getDb().withTransactionSync()`; hooks are React-only glue (read-only DAO calls allowed, no raw SQL/outbox/business math).
- IDs are UUIDs via `generateUUID()` (`src/lib/uuid.ts`).
- `route_sessions` has no FK to `routes` (route_name is plain text) — DB tests may insert route_sessions rows directly.
- Outbox enqueue shape: `enqueueOutbox({ entityType, entityId, operation, payload })` with `operation` in `'create' | 'update' | 'delete'`; `'create'` upserts the full row.
- Integration DB test harness: `createSchema()` in `beforeAll`, `resetDb()` in `beforeEach`, from `@/src/test-utils/db-test-helpers`.

---

### Task 1: DB v4 — reset filename, widen status CHECK, add one-ongoing unique index

**Files:**
- Modify: `src/lib/db.ts` (getDb filename; route_sessions CHECK; new index in initDb)
- Test: `src/lib/__tests__/db.test.ts` (create)

**Interfaces:**
- Consumes: `createSchema`, `resetDb` from `@/src/test-utils/db-test-helpers`; `getDb` from `@/src/lib/db`; `generateUUID` from `@/src/lib/uuid`.
- Produces: fresh DB `routeledger-v4.db`; `route_sessions.status` accepts `'ongoing' | 'completed' | 'cancelled'`; unique index `idx_route_sessions_one_ongoing` allowing at most one `ongoing` row.

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/db.test.ts`:

```ts
import { createSchema, resetDb } from "@/src/test-utils/db-test-helpers";
import { getDb } from "@/src/lib/db";
import { generateUUID } from "@/src/lib/uuid";

function insertSession(status: string): string {
  const id = generateUUID();
  getDb().runSync(
    `INSERT INTO route_sessions (id, route_name, session_date, conducted_by, status)
     VALUES (?, 'R', '2026-07-06', 'user-1', ?)`,
    [id, status],
  );
  return id;
}

beforeAll(async () => {
  await createSchema();
});
beforeEach(() => {
  resetDb();
});

test("allows the 'cancelled' status value", () => {
  const id = insertSession("cancelled");
  const row = getDb().getFirstSync<{ status: string }>(
    "SELECT status FROM route_sessions WHERE id = ?",
    [id],
  );
  expect(row?.status).toBe("cancelled");
});

test("rejects a second ongoing session via the unique index", () => {
  insertSession("ongoing");
  expect(() => insertSession("ongoing")).toThrow();
});

test("allows a new ongoing session once the previous is cancelled", () => {
  const first = insertSession("ongoing");
  getDb().runSync("UPDATE route_sessions SET status = 'cancelled' WHERE id = ?", [
    first,
  ]);
  expect(() => insertSession("ongoing")).not.toThrow();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/__tests__/db.test.ts`
Expected: FAIL — "cancelled" insert throws a CHECK constraint error (old CHECK excludes it) and the unique-index test fails because no index exists yet.

- [ ] **Step 3: Bump the DB filename**

In `src/lib/db.ts`, change the filename in `getDb()`:

```ts
db = SQLite.openDatabaseSync("routeledger-v4.db");
```

- [ ] **Step 4: Widen the status CHECK constraint**

In `src/lib/db.ts`, in the `CREATE TABLE IF NOT EXISTS route_sessions` block, change the status line to:

```sql
      status                      TEXT NOT NULL DEFAULT 'ongoing' CHECK(status IN ('ongoing', 'completed', 'cancelled')),
```

- [ ] **Step 5: Add the partial unique index**

In `src/lib/db.ts`, add this line inside the `-- Indexes for hot paths` block of the `execAsync` template (alongside the other `CREATE INDEX` statements):

```sql
    CREATE UNIQUE INDEX IF NOT EXISTS idx_route_sessions_one_ongoing ON route_sessions(status) WHERE status = 'ongoing';
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- src/lib/__tests__/db.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 7: Commit**

```bash
git add src/lib/db.ts src/lib/__tests__/db.test.ts
git commit -m "feat(agent-app): reset DB to v4 with single-ongoing unique index and cancelled status"
```

---

### Task 2: RouteSessionsDao — deterministic getOngoing + cancel

**Files:**
- Modify: `src/lib/dao/route-sessions-dao.ts`
- Test: `src/lib/dao/__tests__/route-sessions-dao.test.ts` (create)

**Interfaces:**
- Consumes: `getDb`, `generateUUID`.
- Produces: `RouteSessionsDao.getOngoing()` returns the single ongoing row (newest by `created_at` as tiebreak) or `undefined`/`null`; `RouteSessionsDao.cancel(id: string): void` sets `status='cancelled'`.

- [ ] **Step 1: Write the failing test**

Create `src/lib/dao/__tests__/route-sessions-dao.test.ts`:

```ts
import { createSchema, resetDb } from "@/src/test-utils/db-test-helpers";
import RouteSessionsDao from "@/src/lib/dao/route-sessions-dao";

beforeAll(async () => {
  await createSchema();
});
beforeEach(() => {
  resetDb();
});

test("getOngoing returns nothing when there is no ongoing session", () => {
  expect(RouteSessionsDao.getOngoing()).toBeFalsy();
});

test("getOngoing ignores completed and cancelled sessions", () => {
  const a = RouteSessionsDao.insert("R", "2026-07-06", "user-1");
  RouteSessionsDao.complete(a);
  const b = RouteSessionsDao.insert("R", "2026-07-06", "user-1");
  RouteSessionsDao.cancel(b);
  const c = RouteSessionsDao.insert("R", "2026-07-06", "user-1");

  expect(RouteSessionsDao.getOngoing()?.id).toBe(c);
});

test("cancel frees the ongoing slot for a new session", () => {
  const a = RouteSessionsDao.insert("R", "2026-07-06", "user-1");
  RouteSessionsDao.cancel(a);

  const b = RouteSessionsDao.insert("R", "2026-07-06", "user-1");
  expect(RouteSessionsDao.getOngoing()?.id).toBe(b);

  const cancelled = RouteSessionsDao.getById(a);
  expect(cancelled?.status).toBe("cancelled");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/lib/dao/__tests__/route-sessions-dao.test.ts`
Expected: FAIL — `RouteSessionsDao.cancel is not a function`.

- [ ] **Step 3: Make getOngoing deterministic**

In `src/lib/dao/route-sessions-dao.ts`, replace the `getOngoing` body query:

```ts
  getOngoing() {
    return getDb().getFirstSync<RouteSessionRow>(
      `SELECT * FROM route_sessions WHERE status = 'ongoing' ORDER BY created_at DESC LIMIT 1`,
    );
  },
```

- [ ] **Step 4: Add cancel**

In `src/lib/dao/route-sessions-dao.ts`, add this method (next to `complete`):

```ts
  cancel(id: string) {
    getDb().runSync(
      `UPDATE route_sessions SET status = 'cancelled' WHERE id = ?`,
      [id],
    );
  },
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- src/lib/dao/__tests__/route-sessions-dao.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add src/lib/dao/route-sessions-dao.ts src/lib/dao/__tests__/route-sessions-dao.test.ts
git commit -m "feat(agent-app): add RouteSessionsDao.cancel and make getOngoing deterministic"
```

---

### Task 3: startSession guard + cancelSession service

**Files:**
- Modify: `src/features/sessions/services/sessionLocalService.ts`
- Test: `src/features/sessions/services/__tests__/sessionLocalService.test.ts` (append)

**Interfaces:**
- Consumes: `RouteSessionsDao.getOngoing/cancel/getById`, `enqueueOutbox`, `getDb`.
- Produces: `OngoingSessionExistsError` (exported class); `startSession` throws it when an ongoing session already exists; `cancelSession(sessionId: string): void` cancels + enqueues an outbox `create` (upsert) of the cancelled row.

- [ ] **Step 1: Write the failing test**

First, extend the imports at the **top** of `src/features/sessions/services/__tests__/sessionLocalService.test.ts` (do not add a second import block lower down — it would duplicate `startSession` and trip `import/first`):

- Change `import { startSession } from "../sessionLocalService";` to:
  `import { startSession, cancelSession, OngoingSessionExistsError } from "../sessionLocalService";`
- Add `latestOutboxFor` to the existing `@/src/test-utils/db-test-helpers` import list.
- Add a new line: `import RouteSessionsDao from "@/src/lib/dao/route-sessions-dao";`

Then append these three tests to the end of the file:

```ts
test("rejects starting a second session while one is ongoing", async () => {
  const routeId = seedRoute("Route A");
  const provinceId = seedProvince(routeId);
  seedStore(provinceId);
  await startSession(routeId, "Route A");

  await expect(startSession(routeId, "Route A")).rejects.toBeInstanceOf(
    OngoingSessionExistsError,
  );
});

test("cancelling an ongoing session lets a new one start", async () => {
  const routeId = seedRoute("Route B");
  const provinceId = seedProvince(routeId);
  seedStore(provinceId);
  const first = await startSession(routeId, "Route B");

  cancelSession(first);

  const second = await startSession(routeId, "Route B");
  expect(RouteSessionsDao.getOngoing()?.id).toBe(second);
});

test("cancelSession enqueues a route_session upsert with cancelled status", async () => {
  const routeId = seedRoute("Route C");
  const provinceId = seedProvince(routeId);
  seedStore(provinceId);
  const id = await startSession(routeId, "Route C");

  cancelSession(id);

  const out = latestOutboxFor(id);
  expect(out?.entity_type).toBe("route_session");
  expect(out?.operation).toBe("create");
  expect(out?.payload).toMatchObject({ id, status: "cancelled" });
});
```

Note: the existing top-of-file `jest.mock("@/src/lib/supabase", ...)` and the `beforeAll`/`beforeEach` in this file already apply — do not duplicate them.

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/features/sessions/services/__tests__/sessionLocalService.test.ts`
Expected: FAIL — `OngoingSessionExistsError`/`cancelSession` are not exported.

- [ ] **Step 3: Add the error class and guard**

In `src/features/sessions/services/sessionLocalService.ts`, add the exported error class near the top (after imports):

```ts
export class OngoingSessionExistsError extends Error {
  constructor() {
    super("An ongoing session already exists");
    this.name = "OngoingSessionExistsError";
  }
}
```

Then, inside `startSession`, add the guard immediately after the `conductedBy` auth check (before `const sessionId = generateUUID();`):

```ts
  if (RouteSessionsDao.getOngoing()) throw new OngoingSessionExistsError();
```

- [ ] **Step 4: Add cancelSession**

In `src/features/sessions/services/sessionLocalService.ts`, add below `completeSession`:

```ts
export function cancelSession(sessionId: string): void {
  getDb().withTransactionSync(() => {
    RouteSessionsDao.cancel(sessionId);
    const row = RouteSessionsDao.getById(sessionId);
    if (row) {
      enqueueOutbox({
        entityType: "route_session",
        entityId: sessionId,
        operation: "create", // upsert the full, now-cancelled row
        payload: row,
      });
    }
  });
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- src/features/sessions/services/__tests__/sessionLocalService.test.ts`
Expected: PASS (existing tests + 3 new).

- [ ] **Step 6: Commit**

```bash
git add src/features/sessions/services/sessionLocalService.ts src/features/sessions/services/__tests__/sessionLocalService.test.ts
git commit -m "feat(agent-app): block starting a session when one is ongoing; add cancelSession"
```

---

### Task 4: useStartSession — surface the hard-block message

**Files:**
- Modify: `src/features/sessions/hooks/useStartSession.ts`
- Test: `src/features/sessions/hooks/__tests__/useStartSession.test.tsx` (create)

**Interfaces:**
- Consumes: `startSession`, `OngoingSessionExistsError` from the service; `router`, `useLocalSearchParams` from `expo-router`; `Alert` from `react-native`.
- Produces: on `OngoingSessionExistsError`, `start()` shows an alert titled "Session already running" and does NOT navigate.

- [ ] **Step 1: Write the failing test**

Create `src/features/sessions/hooks/__tests__/useStartSession.test.tsx`:

```tsx
import { renderHook, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import { useStartSession } from "../useStartSession";
import {
  startSession,
  OngoingSessionExistsError,
} from "../../services/sessionLocalService";

jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
  useLocalSearchParams: () => ({ routeId: "r1", routeName: "Route 1" }),
}));

jest.mock("../../services/sessionLocalService", () => {
  const actual = jest.requireActual("../../services/sessionLocalService");
  return {
    ...actual,
    startSession: jest.fn(),
  };
});

beforeEach(() => {
  jest.clearAllMocks();
});

test("shows a block alert and does not navigate when a session is ongoing", async () => {
  const alertSpy = jest.spyOn(Alert, "alert").mockImplementation(() => {});
  (startSession as jest.Mock).mockRejectedValueOnce(
    new OngoingSessionExistsError(),
  );
  const { router } = require("expo-router");

  const { result } = renderHook(() => useStartSession());
  await act(async () => {
    await result.current.start();
  });

  expect(alertSpy).toHaveBeenCalledWith(
    "Session already running",
    expect.stringContaining("Cancel"),
  );
  expect(router.replace).not.toHaveBeenCalled();
});

test("navigates to inventory on a successful start", async () => {
  (startSession as jest.Mock).mockResolvedValueOnce("session-1");
  const { router } = require("expo-router");

  const { result } = renderHook(() => useStartSession());
  await act(async () => {
    await result.current.start();
  });

  expect(router.replace).toHaveBeenCalledWith({
    pathname: "/main/routes/inventory",
    params: { routeId: "r1", routeName: "Route 1", sessionId: "session-1" },
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/features/sessions/hooks/__tests__/useStartSession.test.tsx`
Expected: FAIL — the block test fails because the current catch shows the generic "Couldn't start session" alert, not the "Session already running" copy.

- [ ] **Step 3: Update the catch block**

In `src/features/sessions/hooks/useStartSession.ts`, add the import and branch the catch. Change the import line:

```ts
import { startSession, OngoingSessionExistsError } from "../services/sessionLocalService";
```

Replace the `catch (e)` block with:

```ts
    } catch (e) {
      if (e instanceof OngoingSessionExistsError) {
        Alert.alert(
          "Session already running",
          "Finish or Cancel your current session before starting a new one.",
        );
      } else {
        Alert.alert("Couldn't start session", String(e));
      }
    } finally {
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/features/sessions/hooks/__tests__/useStartSession.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/features/sessions/hooks/useStartSession.ts src/features/sessions/hooks/__tests__/useStartSession.test.tsx
git commit -m "feat(agent-app): show hard-block alert when starting over an ongoing session"
```

---

### Task 5: cancelRoute action + Cancel Session button

**Files:**
- Modify: `src/features/sessions/hooks/useSession.ts` (add `cancelRoute` to `actions`)
- Modify: `src/features/sessions/components/session-route-screen-components/EndRouteFooter.tsx` (Cancel button + confirm)
- Test: `src/features/sessions/hooks/__tests__/useSession.test.tsx` (create)

**Interfaces:**
- Consumes: `cancelSession` from the service; `router`, `useLocalSearchParams`, `useFocusEffect` from `expo-router`; `useSessionRoute` context in the footer.
- Produces: `session.actions.cancelRoute()` — cancels the current session and navigates to `/main/routes`.

- [ ] **Step 1: Write the failing test**

Create `src/features/sessions/hooks/__tests__/useSession.test.tsx`:

```tsx
import { renderHook, act } from "@testing-library/react-native";
import { useSession } from "../useSession";
import { cancelSession } from "../../services/sessionLocalService";

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
  useFocusEffect: () => {},
  useLocalSearchParams: () => ({ sessionId: "session-1" }),
}));

jest.mock("../../services/sessionLocalService", () => {
  const actual = jest.requireActual("../../services/sessionLocalService");
  return { ...actual, cancelSession: jest.fn(), completeSession: jest.fn() };
});

beforeEach(() => {
  jest.clearAllMocks();
});

test("cancelRoute cancels the session and navigates to the routes list", () => {
  const { router } = require("expo-router");
  const { result } = renderHook(() => useSession());

  act(() => {
    result.current.session.actions.cancelRoute();
  });

  expect(cancelSession).toHaveBeenCalledWith("session-1");
  expect(router.push).toHaveBeenCalledWith("/main/routes");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/features/sessions/hooks/__tests__/useSession.test.tsx`
Expected: FAIL — `result.current.session.actions.cancelRoute is not a function`.

- [ ] **Step 3: Add cancelRoute to useSession**

In `src/features/sessions/hooks/useSession.ts`, update the import:

```ts
import { completeSession, cancelSession } from "../services/sessionLocalService";
```

Add the callback next to `endRoute`:

```ts
  const cancelRoute = useCallback(() => {
    if (!sessionId) return;
    cancelSession(sessionId);
    setIsEndModalOpen(false);
    router.push("/main/routes");
  }, [sessionId]);
```

Extend the actions object:

```ts
  const actions = { openStore, endRoute, cancelRoute };
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- src/features/sessions/hooks/__tests__/useSession.test.tsx`
Expected: PASS (1 test).

- [ ] **Step 5: Add the Cancel Session button to the footer**

In `src/features/sessions/components/session-route-screen-components/EndRouteFooter.tsx`, replace the file contents with (adds an Alert-confirmed cancel button below End Route):

```tsx
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSessionRoute } from "../../context/useSessionRoute";

export function EndRouteFooter() {
  const { session } = useSessionRoute();

  const confirmCancel = () => {
    Alert.alert(
      "Cancel this session?",
      "This discards the current session. You can start a new one afterward.",
      [
        { text: "Keep session", style: "cancel" },
        {
          text: "Cancel session",
          style: "destructive",
          onPress: () => session.actions.cancelRoute(),
        },
      ],
    );
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.endRouteButton}
        activeOpacity={0.7}
        onPress={session.openEndModal}
      >
        <Ionicons name="stop-circle-outline" size={17} color="#DC2626" />
        <Text style={styles.endRouteButtonText}>End Route</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        activeOpacity={0.7}
        onPress={confirmCancel}
      >
        <Text style={styles.cancelButtonText}>Cancel Session</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    gap: 10,
  },
  endRouteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: "#991B1B",
  },
  endRouteButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },
});
```

- [ ] **Step 6: Run the full suite**

Run: `npm test`
Expected: PASS (all suites, including the new files).

- [ ] **Step 7: Commit**

```bash
git add src/features/sessions/hooks/useSession.ts src/features/sessions/hooks/__tests__/useSession.test.tsx src/features/sessions/components/session-route-screen-components/EndRouteFooter.tsx
git commit -m "feat(agent-app): add Cancel Session action to the session screen"
```

---

## Manual verification (after all tasks)

1. `npm run start --clear` (v4 DB name means a fresh local DB).
2. Start a route → add a small morning inventory (e.g. 10 ube cheese pandesal).
3. Force-kill and reopen the app → confirm you land back in that session and the store adder shows the correct inventory, not "50 of everything."
4. Return to the routes list and try to start another route → confirm the "Session already running" alert blocks it.
5. On the session screen, tap Cancel Session → confirm → confirm you can now start a new route.
