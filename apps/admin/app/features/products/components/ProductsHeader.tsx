import type { ReactElement } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CatalogSummary } from "../types/product-types";
import { formatAmountPHP } from "../helpers/formatCurrency";

type ProductsHeaderProps = {
  summary: CatalogSummary;
  onAddClick: () => void;
};

function Peso(): ReactElement {
  return <span className="font-medium text-gold">₱</span>;
}

function CatalogSubline({ summary }: { summary: CatalogSummary }): ReactElement {
  if (summary.count === 0) {
    return <span>No items yet — this is where the price list starts.</span>;
  }

  const itemLabel = summary.count === 1 ? "item" : "items";
  const priceClass = "font-[family-name:var(--font-mono)] tabular-nums";
  const single = summary.minPrice === summary.maxPrice;

  return (
    <span>
      {summary.count} {itemLabel}
      <span className="mx-2 text-border">·</span>
      <Peso />
      <span className={priceClass}>{formatAmountPHP(summary.minPrice ?? 0)}</span>
      {!single && (
        <>
          <span className="mx-1.5 text-muted-foreground">–</span>
          <Peso />
          <span className={priceClass}>
            {formatAmountPHP(summary.maxPrice ?? 0)}
          </span>
        </>
      )}
    </span>
  );
}

export function ProductsHeader({
  summary,
  onAddClick,
}: ProductsHeaderProps): ReactElement {
  return (
    <header className="sticky top-0 z-20 border-b bg-slate-50/80 px-6 py-5 backdrop-blur dark:bg-background/80">
      <div className="mx-auto flex w-full max-w-[1200px] items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
            Master Price List
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Product Catalog
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <CatalogSubline summary={summary} />
          </p>
        </div>

        <Button type="button" className="rounded-2xl" onClick={onAddClick}>
          <Plus className="h-4 w-4" />
          Add product
        </Button>
      </div>
    </header>
  );
}
