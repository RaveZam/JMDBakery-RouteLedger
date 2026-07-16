import type { CatalogSummary, Product } from "../types/product-types";

export function getCatalogSummary(products: Product[]): CatalogSummary {
  if (products.length === 0) {
    return { count: 0, minPrice: null, maxPrice: null };
  }

  const prices = products.map((product) => product.price);
  return {
    count: products.length,
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
  };
}
