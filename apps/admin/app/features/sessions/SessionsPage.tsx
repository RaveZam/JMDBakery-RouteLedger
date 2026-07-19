"use client";

import type { ReactElement } from "react";

import { useSessionsQuery } from "./sessionsQuery";
import { summarizeSessions } from "./helpers/sessionsBoard";
import { SessionsList } from "./components/SessionsList";
import { SessionsHeader } from "./components/SessionsHeader";
import { SessionsSummary } from "./components/SessionsSummary";
import { SessionsBoardSkeleton } from "./components/SessionsBoardSkeleton";

export function SessionsPage(): ReactElement {
  const { data: sessions, isLoading } = useSessionsQuery();
  const summary = summarizeSessions(sessions);

  return (
    <>
      <SessionsHeader summary={summary} />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1200px] space-y-6">
          {isLoading ? (
            <SessionsBoardSkeleton />
          ) : (
            <>
              <SessionsSummary summary={summary} />
              <SessionsList sessions={sessions} />
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default SessionsPage;
