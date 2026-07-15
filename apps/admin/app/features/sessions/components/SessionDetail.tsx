"use client";

import { useState } from "react";
import type { ReactElement } from "react";
import { ClipboardList } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSessionStores } from "../hooks/useSessionStores";
import { formatSessionDate, visitRate } from "../helpers/sessionHelpers";
import type { SessionRow } from "../types/session-types";
import { SessionInventoryModal } from "./SessionInventoryModal";
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
  const [inventoryOpen, setInventoryOpen] = useState(false);

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-3">
        <div>
          <CardTitle className="text-base">{session.routeName}</CardTitle>
          <p className="text-xs text-muted-foreground">
            {formatSessionDate(session.sessionDate)} &middot;{" "}
            <span className="font-medium text-foreground">{rate}</span> visit rate
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-2xl"
          onClick={() => setInventoryOpen(true)}
        >
          <ClipboardList className="h-4 w-4" />
          View inventory
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        <StoreEntryList session={session} />
      </CardContent>
      {inventoryOpen ? (
        <SessionInventoryModal
          session={session}
          onClose={() => setInventoryOpen(false)}
        />
      ) : null}
    </Card>
  );
}
