import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { AdminCard } from "../components/AdminCard";
import type { AdminRow } from "../types/admin-types";

function makeAdmin(overrides: Partial<AdminRow> = {}): AdminRow {
  return {
    id: "admin-1",
    email: "boss@jmd.test",
    name: "Maria Santos",
    createdAt: "2026-03-02T08:30:00Z",
    ...overrides,
  };
}

describe("AdminCard", () => {
  test("shows the admin's name and email", () => {
    render(<AdminCard admin={makeAdmin()} onDelete={vi.fn()} />);

    expect(screen.getByText("Maria Santos")).toBeTruthy();
    expect(screen.getByText("boss@jmd.test")).toBeTruthy();
  });

  test("shows the date the admin joined", () => {
    render(<AdminCard admin={makeAdmin()} onDelete={vi.fn()} />);

    expect(screen.getByText("Joined Mar 2, 2026")).toBeTruthy();
  });

  test("calls onDelete with the admin id when delete is pressed", () => {
    const onDelete = vi.fn();
    render(<AdminCard admin={makeAdmin({ id: "admin-9" })} onDelete={onDelete} />);

    fireEvent.click(screen.getByLabelText("Delete Maria Santos"));

    expect(onDelete).toHaveBeenCalledWith("admin-9");
  });

  test("does not call onDelete until the button is pressed", () => {
    const onDelete = vi.fn();
    render(<AdminCard admin={makeAdmin()} onDelete={onDelete} />);

    expect(onDelete).not.toHaveBeenCalled();
  });

  test("labels the delete button with the admin being deleted", () => {
    render(<AdminCard admin={makeAdmin({ name: "Jose Rizal" })} onDelete={vi.fn()} />);

    expect(screen.getByLabelText("Delete Jose Rizal")).toBeTruthy();
  });
});
