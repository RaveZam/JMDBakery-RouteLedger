import { getDb } from "@/src/lib/db";
import EndingInventoryDao from "@/src/lib/dao/ending-inventory-dao";
import { enqueueOutbox } from "@/src/lib/sync/outbox";
import { getPhTime } from "@/src/shared/helpers/getPhTime";

type UpsertEndingInventoryInput = {
  id?: string;
  sessionId: string;
  productId: string;
  productName: string;
  quantity: number;
};

// Upserts one product's ending-inventory count. Reuses the row's existing id
// (passed in from the hook once known) so repeated autosaves update the same
// local row and outbox entity instead of drifting apart.
export function upsertEndingInventoryQty(
  input: UpsertEndingInventoryInput,
): string {
  const createdAt = getPhTime().toISOString();
  // withTransactionSync runs its callback synchronously, but TS can't see
  // that through the callback boundary — assert we always assign below.
  let id!: string;
  getDb().withTransactionSync(() => {
    id = EndingInventoryDao.upsert({
      id: input.id,
      sessionId: input.sessionId,
      productId: input.productId,
      snapshotName: input.productName,
      quantity: input.quantity,
      createdAt,
    });
    enqueueOutbox({
      entityType: "ending_inventory",
      entityId: id,
      operation: "create",
      payload: {
        id,
        route_session_id: input.sessionId,
        product_id: input.productId,
        snapshot_product_name: input.productName,
        quantity: input.quantity,
        created_at: createdAt,
      },
    });
  });
  return id;
}
