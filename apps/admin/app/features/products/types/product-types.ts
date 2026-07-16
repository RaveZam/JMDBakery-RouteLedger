export type Product = {
  id: string;
  name: string;
  price: number;
};

export type ProductInput = {
  name: string;
  price: number;
};

export type CatalogSummary = {
  count: number;
  minPrice: number | null;
  maxPrice: number | null;
};
