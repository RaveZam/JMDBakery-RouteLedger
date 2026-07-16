import type { ReactElement } from "react";

import type { Product } from "../types/product-types";
import { ProductsEmptyState } from "./ProductsEmptyState";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export function ProductGrid({
  products,
  onEdit,
  onDelete,
}: ProductGridProps): ReactElement {
  if (products.length === 0) {
    return (
      <div className="rounded-2xl border bg-card shadow-soft">
        <ProductsEmptyState />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
