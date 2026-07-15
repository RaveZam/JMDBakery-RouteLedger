"use client";

import type { ReactElement } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Circle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatAddress } from "@/app/features/stores/helpers/storeHelpers";
import { useStoreSales } from "../hooks/useStoreSales";
import type { SessionStoreRow } from "../types/session-types";
import { StoreSalesTable } from "./StoreSalesTable";

function StoreEntryHeader({
  store,
  expanded,
}: {
  store: SessionStoreRow;
  expanded: boolean;
}): ReactElement {
  return (
    <>
      {store.visited ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{store.storeName}</p>
        <p className="text-xs text-muted-foreground">
          {formatAddress(store.barangay, store.city, store.province)}
        </p>
      </div>
      <Badge variant={store.visited ? "success" : "pending"}>
        {store.visited ? "Visited" : "Pending"}
      </Badge>
      {expanded ? (
        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
      ) : (
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
    </>
  );
}

export function StoreEntry({
  store,
  expanded,
  onToggle,
}: {
  store: SessionStoreRow;
  expanded: boolean;
  onToggle: () => void;
}): ReactElement {
  const { sales, loading } = useStoreSales(store.id, expanded);

  return (
    <div className="rounded-xl border bg-background">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-3 py-2.5 text-left"
      >
        <StoreEntryHeader store={store} expanded={expanded} />
      </button>
      {expanded && (
        <div className="border-t border-border/50 px-1 py-2">
          <StoreSalesTable sales={sales} loading={loading} />
        </div>
      )}
    </div>
  );
}
