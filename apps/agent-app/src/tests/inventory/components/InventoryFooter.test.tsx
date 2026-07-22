import { render, screen, fireEvent } from "@testing-library/react-native";
import { Alert } from "react-native";
import { InventoryFooter } from "@/src/features/inventory/components/morning-inventory-screen-components/InventoryFooter";
import { MorningInventoryContext } from "@/src/features/inventory/context/MorningInventoryProvider";
import type { Inventory } from "@/src/features/inventory/types/inventory-types";

const alertSpy = jest.spyOn(Alert, "alert");

function makeInventory(overrides: Partial<Inventory> = {}): Inventory {
  return {
    id: "sess-1",
    items: [],
    products: [],
    refreshInventory: jest.fn(),
    adjustItemQty: jest.fn(),
    setItemQty: jest.fn(),
    removeItem: jest.fn(),
    handleContinue: jest.fn(),
    cancelInventorySession: jest.fn(),
    ...overrides,
  };
}

function renderFooter() {
  const inventory = makeInventory();
  render(
    <MorningInventoryContext.Provider value={{ inventory }}>
      <InventoryFooter />
    </MorningInventoryContext.Provider>,
  );
  return inventory;
}

beforeEach(() => {
  jest.clearAllMocks();
});

test("'Continue to Route' asks for confirmation before continuing", () => {
  const inventory = renderFooter();

  fireEvent.press(screen.getByText("Continue to Route"));
  expect(inventory.handleContinue).not.toHaveBeenCalled();

  fireEvent.press(screen.getByText("Continue"));
  expect(inventory.handleContinue).toHaveBeenCalled();
});

test("'Cancel Session' asks for confirmation before cancelling", () => {
  const inventory = renderFooter();

  fireEvent.press(screen.getByText("Cancel Session"));

  expect(alertSpy).toHaveBeenCalled();
  expect(inventory.cancelInventorySession).not.toHaveBeenCalled();

  const buttons = alertSpy.mock.calls[0][2]!;
  buttons.find((b) => b.style === "destructive")!.onPress!();

  expect(inventory.cancelInventorySession).toHaveBeenCalled();
});

test("keeping the session in the confirmation does not cancel it", () => {
  const inventory = renderFooter();

  fireEvent.press(screen.getByText("Cancel Session"));

  const buttons = alertSpy.mock.calls[0][2]!;
  const keep = buttons.find((b) => b.style === "cancel")!;
  keep.onPress?.();

  expect(inventory.cancelInventorySession).not.toHaveBeenCalled();
});
