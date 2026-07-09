import { getDb } from "@/src/lib/db";
import { generateUUID } from "@/src/lib/uuid";

export type EndingInventoryItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
};

const EndingInventoryDao = {
  getBySessionId(sessionId: string): EndingInventoryItem[] {
    const rows = getDb().getAllSync<{
      id: string;
      product_id: string;
      snapshot_product_name: string;
      quantity: number;
    }>(
      `SELECT id, product_id, snapshot_product_name, quantity
       FROM ending_inventory
       WHERE route_session_id = ?
       ORDER BY created_at ASC`,
      [sessionId],
    );
    return rows.map((r) => ({
      id: r.id,
      productId: r.product_id,
      productName: r.snapshot_product_name,
      quantity: r.quantity,
    }));
  },

  upsert(input: {
    sessionId: string;
    productId: string;
    snapshotName: string;
    quantity: number;
    createdAt: string;
    id?: string;
  }) {
    const id = input.id ?? generateUUID();
    getDb().runSync(
      `INSERT INTO ending_inventory (id, route_session_id, product_id, snapshot_product_name, quantity, created_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(route_session_id, product_id) DO UPDATE SET quantity = excluded.quantity`,
      [id, input.sessionId, input.productId, input.snapshotName, input.quantity, input.createdAt],
    );
    return id;
  },
};

export default EndingInventoryDao;
