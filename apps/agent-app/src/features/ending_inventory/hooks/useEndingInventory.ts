import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import SessionInventoryDao from "@/src/lib/dao/session-inventory-dao";
import EndingInventoryDao from "@/src/lib/dao/ending-inventory-dao";
import { countSoldByProduct } from "@/src/features/store/core/count-sold-by-product";
import { computeRemaining } from "@/src/features/store/core/compute-remaining";
import { getSalesByRouteSession } from "@/src/features/store/services/sales-services";
import { runOutboxSync } from "@/src/lib/sync/outbox";
import { upsertEndingInventoryQty } from "../services/ending-inventory-save-service";
import { mergeEndingInventoryRows } from "../core/merge-ending-inventory-rows";
import type { EndingInventoryRow } from "../types/ending-inventory-types";

export function useEndingInventory() {
  const params = useLocalSearchParams<{
    sessionId?: string;
    routeName?: string;
  }>();
  const sessionId = params.sessionId;
  const routeName =
    typeof params.routeName === "string" ? params.routeName : "";

  const [items, setItems] = useState<EndingInventoryRow[]>([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    if (!sessionId) return;

    const morningItems = SessionInventoryDao.getBySessionId(sessionId);
    const salesCounts = countSoldByProduct(getSalesByRouteSession(sessionId));
    const remaining = computeRemaining(
      morningItems.map((item) => ({
        productId: item.productId,
        qty: item.qty,
      })),
      salesCounts,
    );

    setItems(
      mergeEndingInventoryRows(
        morningItems,
        remaining,
        EndingInventoryDao.getBySessionId(sessionId),
      ),
    );
  }, [sessionId]);

  useEffect(() => {
    load();
  }, [load]);

  const updateQty = useCallback(
    (productId: string, delta: number) => {
      if (!sessionId || delta === 0) return;
      const item = items.find((it) => it.productId === productId);
      if (!item) return;

      const quantity = Math.max(0, item.quantity + delta);
      const id = upsertEndingInventoryQty({
        id: item.id,
        sessionId,
        productId: item.productId,
        productName: item.productName,
        quantity,
      });

      setItems((prev) =>
        prev.map((it) =>
          it.productId === productId ? { ...it, id, quantity } : it,
        ),
      );
    },
    [sessionId, items],
  );

  const save = useCallback(async () => {
    if (!sessionId) return;
    setSaving(true);
    try {
      // Write every row's current count, not just ones the driver tapped +/-
      // on — an untouched row (e.g. correctly 0) would otherwise never reach
      // the outbox and silently fail to sync.
      const persisted = items.map((item) => ({
        ...item,
        id: upsertEndingInventoryQty({
          id: item.id,
          sessionId,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
        }),
      }));
      setItems(persisted);

      const { failed } = await runOutboxSync();
      if (failed > 0) {
        Alert.alert(
          "Some items didn't sync",
          "They're saved on this device and will retry automatically.",
        );
      } else {
        Alert.alert("Saved", "Ending inventory sent to Supabase.");
      }
    } catch {
      Alert.alert(
        "Saved locally",
        "Couldn't reach Supabase right now. It's saved on this device and will retry automatically.",
      );
    } finally {
      setSaving(false);
    }
  }, [sessionId, items]);

  return { endingInventory: { routeName, items, saving, updateQty, save } };
}
