"use client";

import { useMemo, useState } from "react";

import {
  filterSessions,
  paginateSessions,
  type SessionFilter,
} from "../helpers/sessionsBoard";
import type { SessionRow } from "../types/session-types";

export function useSessionsBoard(sessions: SessionRow[]) {
  //Holds most of the states that control UI filter, pagination and selected session that we passthrough
  const [filter, setFilter] = useState<SessionFilter>("all");
  const [requestedPage, setRequestedPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visible = useMemo(
    () => filterSessions(sessions, filter),
    [sessions, filter],
  );
  const paged = paginateSessions(visible, requestedPage);

  return {
    filter: {
      value: filter,
      count: visible.length,
      onChange: (next: SessionFilter): void => {
        setFilter(next);
        setRequestedPage(1);
      },
    },
    page: {
      sessions: paged.sessions,
      current: paged.page,
      total: paged.totalPages,
      onChange: setRequestedPage,
    },
    selection: {
      session: visible.find((s) => s.id === selectedId) ?? null,
      id: selectedId,
      onToggle: (id: string): void =>
        setSelectedId((current) => (current === id ? null : id)),
    },
  };
}
