// Hook test: useInventoryRoute resolves the route name with a fallback chain
// (param → DB lookup → "Route"). The DB lookup service is mocked — it has its
// own integration test — so this only covers the resolution order.
import { renderHook } from "@testing-library/react-native";
import { useInventoryRoute } from "@/src/features/inventory/hooks/useInventoryRoute";
import { getRouteName } from "@/src/features/inventory/services/morning-inventory-service";
import { useLocalSearchParams } from "expo-router";

jest.mock("expo-router", () => ({ useLocalSearchParams: jest.fn() }));
jest.mock("@/src/features/inventory/services/morning-inventory-service", () => ({
  getRouteName: jest.fn(),
}));

const mockParams = useLocalSearchParams as jest.Mock;
const mockGetRouteName = getRouteName as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

test("uses the routeName param when present, without hitting the DB", () => {
  mockParams.mockReturnValue({ routeId: "r1", routeName: "North" });

  const { result } = renderHook(() => useInventoryRoute());

  expect(result.current).toEqual({ routeId: "r1", routeName: "North" });
  expect(mockGetRouteName).not.toHaveBeenCalled();
});

test("looks the name up by routeId when no routeName param is given", () => {
  mockParams.mockReturnValue({ routeId: "r1" });
  mockGetRouteName.mockReturnValue("South");

  const { result } = renderHook(() => useInventoryRoute());

  expect(mockGetRouteName).toHaveBeenCalledWith("r1");
  expect(result.current).toEqual({ routeId: "r1", routeName: "South" });
});

test("falls back to 'Route' when the lookup finds nothing", () => {
  mockParams.mockReturnValue({ routeId: "r1" });
  mockGetRouteName.mockReturnValue(null);

  const { result } = renderHook(() => useInventoryRoute());

  expect(result.current).toEqual({ routeId: "r1", routeName: "Route" });
});

test("returns a null routeId and 'Route' when there are no params at all", () => {
  mockParams.mockReturnValue({});

  const { result } = renderHook(() => useInventoryRoute());

  expect(result.current).toEqual({ routeId: null, routeName: "Route" });
  expect(mockGetRouteName).not.toHaveBeenCalled();
});
