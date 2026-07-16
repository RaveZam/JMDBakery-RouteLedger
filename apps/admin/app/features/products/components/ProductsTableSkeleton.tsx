import type { ReactElement } from "react";

export function ProductsTableSkeleton(): ReactElement {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col rounded-2xl border bg-card p-5 shadow-soft"
        >
          <div className="h-4 w-28 animate-pulse rounded bg-muted" />
          <div className="my-4 border-t border-dashed border-border" />
          <div className="h-7 w-20 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
