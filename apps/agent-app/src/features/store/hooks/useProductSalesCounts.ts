import { useCallback, useEffect, useState } from "react";

import { getSalesBySessionStore } from "../services/sales-services";
import {
  countSoldByProduct,
  type ProductSalesCount,
} from "../core/count-sold-by-product";

export function useProductSalesCounts(sessionStoreId: string) {
  const [salesCounts, setSalesCounts] = useState<
    Record<string, ProductSalesCount>
  >({});

  const refetchSalesCounts = useCallback(() => {
    if (!sessionStoreId) return;
    setSalesCounts(countSoldByProduct(getSalesBySessionStore(sessionStoreId)));
  }, [sessionStoreId]);

  useEffect(() => {
    refetchSalesCounts();
  }, [refetchSalesCounts]);

  return { salesCounts, refetchSalesCounts };
}
