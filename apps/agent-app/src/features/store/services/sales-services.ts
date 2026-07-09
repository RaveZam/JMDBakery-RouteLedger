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
  boQty: number;
  boReason: string;
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
      input.boQty,
      input.boReason,
    );
    enqueueOutbox({
      entityType: "sale",
      entityId: id,
      operation: "create",
      payload: {
        id,
        session_store_id: input.sessionStoreId,
        product_id: input.productId,
        snapshot_product_name: input.productName,
        snapshot_price: input.price,
        quantity_sold: input.qty,
        quantity_bo: input.boQty,
        bo_reason: input.boReason,
      },
    });
  });
}

type UpdateSaleInput = AddSaleInput & { saleId: string };

export function updateSale(input: UpdateSaleInput): void {
  getDb().withTransactionSync(() => {
    SalesDao.updateSale(
      input.saleId,
      input.productId,
      input.productName,
      input.price,
      input.qty,
      input.boQty,
      input.boReason,
    );
    enqueueOutbox({
      entityType: "sale",
      entityId: input.saleId,
      operation: "update",
      payload: {
        id: input.saleId,
        session_store_id: input.sessionStoreId,
        product_id: input.productId,
        snapshot_product_name: input.productName,
        snapshot_price: input.price,
        quantity_sold: input.qty,
        quantity_bo: input.boQty,
        bo_reason: input.boReason,
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
