import type { ReactElement } from "react";
import { MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatSessionDate, visitRate } from "../helpers/sessionHelpers";
import type { SessionRow } from "../types/session-types";
import { SessionStatusBadge } from "./SessionStatusBadge";

function SessionCardBody({ session }: { session: SessionRow }): ReactElement {
  const rate = visitRate(session.visitedStores, session.totalStores);
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{session.routeName}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatSessionDate(session.sessionDate)}
          </p>
        </div>
        <SessionStatusBadge status={session.status} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          {session.visitedStores}/{session.totalStores} stores
        </span>
        <span className="font-medium text-foreground">{rate}</span>
      </div>
    </>
  );
}

export function SessionCard({
  session,
  isSelected,
  onClick,
}: {
  session: SessionRow;
  isSelected: boolean;
  onClick: () => void;
}): ReactElement {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:border-emerald-300 dark:hover:border-emerald-800",
        isSelected &&
          "border-emerald-500 bg-emerald-50/40 dark:border-emerald-700 dark:bg-emerald-950/30",
      )}
    >
      <CardContent className="p-4" onClick={onClick}>
        <SessionCardBody session={session} />
      </CardContent>
    </Card>
  );
}
