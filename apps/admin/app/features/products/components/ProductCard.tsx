import type { ReactElement } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Product } from "../types/product-types";
import { formatAmountPHP } from "../helpers/formatCurrency";

type ProductCardProps = {
  product: Product;
  index: number;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

function CardActions({
  product,
  onEdit,
  onDelete,
}: Omit<ProductCardProps, "index">): ReactElement {
  return (
    <div className="-mr-1 -mt-1 flex shrink-0 gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Edit ${product.name}`}
        onClick={() => onEdit(product)}
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label={`Delete ${product.name}`}
        onClick={() => onDelete(product)}
      >
        <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
      </Button>
    </div>
  );
}

export function ProductCard({
  product,
  index,
  onEdit,
  onDelete,
}: ProductCardProps): ReactElement {
  return (
    <article
      className="catalog-card group relative flex flex-col rounded-2xl border bg-card p-5 shadow-soft transition duration-200 hover:-translate-y-0.5 hover:border-gold/60 hover:shadow-[0_16px_40px_rgba(15,23,42,0.10)]"
      style={{ animationDelay: `${Math.min(index, 12) * 40}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold leading-snug text-foreground">
          {product.name}
        </h3>
        <CardActions product={product} onEdit={onEdit} onDelete={onDelete} />
      </div>

      {/* Tear line — the price-tag cue that ties every card together. */}
      <div className="my-4 border-t border-dashed border-border" />

      <div className="mt-auto flex items-baseline gap-1">
        <span className="text-sm font-medium text-gold">₱</span>
        <span className="font-[family-name:var(--font-mono)] text-2xl font-semibold tabular-nums tracking-tight text-foreground">
          {formatAmountPHP(product.price)}
        </span>
      </div>
    </article>
  );
}
