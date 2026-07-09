import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import SessionInventoryDao from "@/src/lib/dao/session-inventory-dao";
import { ProductsDao } from "@/src/lib/dao/products-dao";
import type { LoggedItem, Product } from "../types/store-types";
import { useLocalSearchParams } from "expo-router";
import { useProductSalesCounts } from "./useProductSalesCounts";
import {
  addSale,
  getSalesBySessionStore,
  removeSale,
  updateSale,
} from "../services/sales-services";

export function useAdderModal() {
  const { sessionId, sessionStoreId } = useLocalSearchParams<{
    sessionId?: string;
    sessionStoreId?: string;
  }>();
  const [visible, setVisible] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  //Sales Count holds simply the amount of X product sold, Remaining is derived from taking the session inventory - amount sold of the product_id
  const { salesCounts, refetchSalesCounts } = useProductSalesCounts(
    sessionStoreId ?? "",
  );
  const [remaining, setRemaining] = useState<Record<string, number>>({});

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [boQty, setBoQty] = useState(0);
  const [boReason, setBoReason] = useState("");

  const [soldItems, setSoldItems] = useState<LoggedItem[]>([]);
  const [editingSaleId, setEditingSaleId] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionStoreId || !sessionId) return;

    //maps out the price for each product since we dont store price in session inventory
    const priceById = new Map(
      ProductsDao.getAllProducts().map((p) => [p.id, p.price]),
    );
    const items = SessionInventoryDao.getBySessionId(sessionId);

    setProducts(
      items.map((item) => ({
        id: item.productId,
        name: item.productName,
        price: priceById.get(item.productId) ?? 0,
      })),
    );
    setRemaining(
      Object.fromEntries(
        items.map((item) => [
          item.productId,
          item.qty - (salesCounts[item.productId]?.sold ?? 0),
        ]),
      ),
    );
  }, [visible, sessionId, sessionStoreId, salesCounts]);

  const reloadSoldItems = useCallback(() => {
    if (!sessionStoreId) return;
    setSoldItems(getSalesBySessionStore(sessionStoreId));
  }, [sessionStoreId]);

  useEffect(() => {
    reloadSoldItems();
  }, [reloadSoldItems]);

  const resetForm = () => {
    setSelectedProduct(null);
    setQuantity(0);
    setBoQty(0);
    setBoReason("");
    setEditingSaleId(null);
  };

  const addOrder = () => {
    if (!sessionStoreId || !selectedProduct) return;
    if (quantity <= 0 && boQty <= 0) return;
    if (boQty > 0 && !boReason) return;

    const saleInput = {
      sessionStoreId,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      price: selectedProduct.price,
      qty: quantity,
      boQty,
      boReason,
    };

    if (editingSaleId) {
      updateSale({ ...saleInput, saleId: editingSaleId });
    } else {
      addSale(saleInput);
    }

    reloadSoldItems();
    refetchSalesCounts();
    resetForm();
    setVisible(false);
  };

  const onItemPress = (idx: number) => {
    const item = soldItems[idx];
    if (!item) return;

    setSelectedProduct(
      products.find((p) => p.id === item.productId) ?? {
        id: item.productId,
        name: item.productName,
        price: item.price,
      },
    );
    setQuantity(item.qty);
    setBoQty(item.boQty);
    setBoReason(item.boReason ?? "");
    setEditingSaleId(item.saleId);
    setVisible(true);
  };

  const onDeleteItem = (idx: number) => {
    const item = soldItems[idx];
    if (!item) return;

    Alert.alert(
      "Delete order?",
      `Remove ${item.productName} from this order.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeSale(item.saleId);
            reloadSoldItems();
            refetchSalesCounts();
          },
        },
      ],
    );
  };

  return {
    inventory: {
      soldItems,
      reloadSoldItems,
      selectedProduct,
      setSelectedProduct,
      quantity,
      setQuantity,
      boQty,
      setBoQty,
      boReason,
      setBoReason,
      salesCounts,
      remaining,
      visible,
      products,
      editingSaleId,
      open: () => setVisible(true),
      close: () => {
        setVisible(false);
        resetForm();
      },
      addOrder,
      onItemPress,
      onDeleteItem,
    },
  };
}
