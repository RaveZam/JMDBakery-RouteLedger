import { useEffect, useState } from "react";

import { getStoreTopProducts } from "../services/storesService";
import type { TopProduct } from "../types/store-types";

type TopProductsState = {
  products: TopProduct[];
  loading: boolean;
  error: string | null;
};

const EMPTY_STATE: TopProductsState = { products: [], loading: false, error: null };

export function useStoreTopProducts(storeId: string | null): TopProductsState {
  const [state, setState] = useState<TopProductsState>(EMPTY_STATE);

  useEffect(() => {
    if (!storeId) return;

    let cancelled = false;
    setState({ products: [], loading: true, error: null });

    getStoreTopProducts(storeId)
      .then((products) => {
        if (!cancelled) setState({ products, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Failed to load top products";
          setState({ products: [], loading: false, error: message });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [storeId]);

  return storeId ? state : EMPTY_STATE;
}
