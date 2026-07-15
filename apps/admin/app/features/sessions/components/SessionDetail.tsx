"use client";

import { useState } from "react";
import type { ReactElement } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSessionStores } from "../hooks/useSessionStores";
import { formatSessionDate, visitRate } from "../helpers/sessionHelpers";
import type { SessionRow } from "../types/session-types";
import { StoreEntry } from "./StoreEntry";

function StoreEntryList({
  session,
}: {
  session: SessionRow;
}): ReactElement {
  const { stores, loading } = useSessionStores(session.id);
  const [expandedStoreId, setExpandedStoreId] = useState<string | null>(null);

  if (loading) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Loading stores...
      </p>
    );
  }
  if (stores.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        No stores entered for this session.
      </p>
    );
  }
  return (
    <>
      {stores.map((store) => (
        <StoreEntry
          key={store.id}
          store={store}
          expanded={expandedStoreId === store.id}
          onToggle={() =>
            setExpandedStoreId((current) =>
              current === store.id ? null : store.id,
            )
          }
        />
      ))}
    </>
  );
}

export function SessionDetail({ session }: { session: SessionRow }): ReactElement {
  const rate = visitRate(session.visitedStores, session.totalStores);

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{session.routeName}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {formatSessionDate(session.sessionDate)} &middot;{" "}
          <span className="font-medium text-foreground">{rate}</span> visit rate
        </p>
      </CardHeader>
      <CardContent className="space-y-2">
        <StoreEntryList session={session} />
      </CardContent>
    </Card>
  );
}
