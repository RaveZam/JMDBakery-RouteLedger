import { getDb } from "@/src/lib/db";
import { generateUUID } from "@/src/lib/uuid";
import SalesDao, { type LoggedItem } from "@/src/lib/dao/sales-dao";
import { enqueueOutbox } from "@/src/lib/sync/outbox";

type AddSaleInput = {
  sessionStoreId: string;
  productId: string;
  productName: string;
  price: number;
  qty: number;
};

// Reads the raw sale rows logged for one session store.
export function getSalesBySessionStore(sessionStoreId: string): LoggedItem[] {
  return SalesDao.getBySessionStoreId(sessionStoreId);
}

export function addSale(input: AddSaleInput): void {
  const id = generateUUID();
  getDb().withTransactionSync(() => {
    SalesDao.insertSale(
      id,
      input.sessionStoreId,
      input.productId,
      input.productName,
      input.price,
      input.qty,
      0,
      "",
    );
    enqueueOutbox({
      entityType: "sale",
      entityId: id,
      operation: "create",
      payload: {
        id,
        session_store_id: input.sessionStoreId,
        product_id: input.productId,
        snapshot_name: input.productName,
        snapshot_price: input.price,
        quantity_sold: input.qty,
        quantity_bo: 0,
        bo_reason: "",
      },
    });
  });
}

export function removeSale(saleId: string): void {
  getDb().withTransactionSync(() => {
    SalesDao.deleteSale(saleId);
    enqueueOutbox({
      entityType: "sale",
      entityId: saleId,
      operation: "delete",
      payload: { id: saleId },
    });
  });
}
