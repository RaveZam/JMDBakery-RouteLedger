"use client";

import { useEffect, useState } from "react";

import { getSessionStores } from "../services/sessionsService";
import type { SessionStoreRow } from "../types/session-types";

export function useSessionStores(sessionId: string): {
  stores: SessionStoreRow[];
  loading: boolean;
} {
  const [stores, setStores] = useState<SessionStoreRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getSessionStores(sessionId)
      .then((result) => {
        if (!cancelled) setStores(result);
      })
      .catch((err) => {
        console.error(`Failed to load stores for session ${sessionId}`, err);
        if (!cancelled) setStores([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return { stores, loading };
}
