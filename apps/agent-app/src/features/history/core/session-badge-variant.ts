import type RouteSessionsDao from "@/src/lib/dao/route-sessions-dao";

type SessionStatus = ReturnType<typeof RouteSessionsDao.getAll>[number]["status"];

export type SessionBadgeVariant = "done" | "cancelled" | "ongoing";

export function getSessionBadgeVariant(
  status: SessionStatus,
): SessionBadgeVariant {
  if (status === "completed") return "done";
  if (status === "cancelled") return "cancelled";
  return "ongoing";
}
