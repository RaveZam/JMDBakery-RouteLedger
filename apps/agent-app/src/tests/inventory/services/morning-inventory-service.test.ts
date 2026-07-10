import {
  createSchema,
  resetDb,
  seedRoute,
} from "@/src/test-utils/db-test-helpers";
import { getRouteName } from "@/src/features/inventory/services/morning-inventory-service";

beforeAll(async () => { await createSchema(); });
beforeEach(() => { resetDb(); });

test("returns the route's name", () => {
  const routeId = seedRoute("North Route");

  expect(getRouteName(routeId)).toBe("North Route");
});

test("returns null for an unknown route id", () => {
  expect(getRouteName("no-such-route")).toBeNull();
});
