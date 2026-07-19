import type { ReactElement } from "react";

export function SessionsBoardSkeleton(): ReactElement {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[124px] animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
      <div className="h-10 w-64 animate-pulse rounded-xl bg-muted" />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-[126px] animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
        <div className="hidden h-80 animate-pulse rounded-xl bg-muted xl:block" />
      </div>
    </div>
  );
}
