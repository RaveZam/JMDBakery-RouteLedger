"use client";

import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import type { SessionRow } from "../types/session-types";
import { SessionCard } from "./SessionCard";
import { SessionDetail } from "./SessionDetail";

const PAGE_SIZE = 10;

function EmptyState(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
      <CalendarDays className="h-10 w-10 opacity-50" />
      <p className="text-sm">No sessions recorded yet.</p>
      <p className="text-xs">
        Sessions will appear here once agents start their routes.
      </p>
    </div>
  );
}

function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}): ReactElement {
  return (
    <div className="flex items-center justify-between pt-2">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="flex items-center gap-1 text-sm disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" /> Previous
      </button>
      <span className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="flex items-center gap-1 text-sm disabled:opacity-40"
      >
        Next <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function DetailPanel({ session }: { session: SessionRow | null }): ReactElement {
  if (!session) {
    return (
      <div className="hidden items-center justify-center rounded-2xl border border-dashed py-20 text-sm text-muted-foreground xl:flex">
        Select a session to view store details
      </div>
    );
  }
  return <SessionDetail session={session} />;
}

function SessionCardList({
  sessions,
  page,
  selectedId,
  onSelect,
  onPageChange,
}: {
  sessions: SessionRow[];
  page: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onPageChange: (page: number) => void;
}): ReactElement {
  const totalPages = Math.ceil(sessions.length / PAGE_SIZE);
  const paginated = sessions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium tracking-wider text-muted-foreground">
        ALL SESSIONS ({sessions.length})
      </p>
      {paginated.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          isSelected={session.id === selectedId}
          onClick={() => onSelect(session.id)}
        />
      ))}
      {totalPages > 1 && (
        <PaginationControls
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

export function SessionsList({ sessions }: { sessions: SessionRow[] }): ReactElement {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [sessions]);

  if (sessions.length === 0) return <EmptyState />;

  const selected = sessions.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <SessionCardList
        sessions={sessions}
        page={page}
        selectedId={selectedId}
        onSelect={(id) => setSelectedId((current) => (current === id ? null : id))}
        onPageChange={setPage}
      />
      <div className="xl:sticky xl:top-6 xl:self-start">
        <DetailPanel session={selected} />
      </div>
    </div>
  );
}
