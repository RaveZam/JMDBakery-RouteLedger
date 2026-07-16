import type { ReactElement } from "react";
import { Croissant } from "lucide-react";

export function ProductsEmptyState(): ReactElement {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-16 text-center">
      <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-primary">
        <Croissant className="h-7 w-7" />
      </div>
      <p className="text-base font-semibold text-foreground">
        Your price list is empty
      </p>
      <p className="max-w-xs text-sm text-muted-foreground">
        Add your first product to start the catalog agents sell from.
      </p>
    </div>
  );
}
