import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { InventoryRow } from "./InventoryRow";
import { InventoryAdderModal } from "./InventoryAdderModal";
import { useMorningInventory } from "../../context/useMorningInventory";

export function InventoryTable() {
  const { inventory } = useMorningInventory();
  const [editProductId, setEditProductId] = useState<string | null>(null);

  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        <Text style={[styles.colHead, styles.colHeadProduct]}>PRODUCT</Text>
        <Text style={[styles.colHead, styles.colHeadQty]}>QTY</Text>
        <View style={styles.colHeadDelete} />
      </View>
      {inventory.items.map((item) => (
        <InventoryRow
          key={item.inventoryId}
          item={item}
          onEdit={() => setEditProductId(item.productId)}
        />
      ))}
      <InventoryAdderModal
        visible={editProductId !== null}
        onClose={() => setEditProductId(null)}
        editing={true}
        editProductId={editProductId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F0",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  colHead: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  colHeadProduct: { flex: 1 },
  colHeadQty: { width: 132, textAlign: "center" },
  colHeadDelete: { width: 24 },
});
