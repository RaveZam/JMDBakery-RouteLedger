import type { TeamMember } from "../types/dashboard-types";

export function statusVariant(status: TeamMember["status"]) {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "warning";
    case "Pending":
      return "pending";
  }
}
