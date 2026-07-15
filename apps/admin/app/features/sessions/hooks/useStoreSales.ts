"use client";

import { useEffect, useState } from "react";

import { getStoreSales } from "../services/sessionsService";
import type { SessionStoreSaleRow } from "../types/session-types";

export function useStoreSales(
  sessionStoreId: string,
  expanded: boolean,
): {
  sales: SessionStoreSaleRow[];
  loading: boolean;
} {
  const [sales, setSales] = useState<SessionStoreSaleRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!expanded || loaded) return;
    let cancelled = false;
    setLoading(true);
    getStoreSales(sessionStoreId)
      .then((result) => {
        if (!cancelled) setSales(result);
      })
      .catch((err) => {
        console.error(`Failed to load sales for store ${sessionStoreId}`, err);
        if (!cancelled) setSales([]);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [expanded, loaded, sessionStoreId]);

  return { sales, loading };
}
