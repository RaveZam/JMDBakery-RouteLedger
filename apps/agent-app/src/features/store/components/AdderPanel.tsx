import { StyleSheet, View, Text } from "react-native";
import { QtyStepper } from "./adder-panel-components/QtyStepper";
import { ProductSelector } from "./adder-panel-components/ProductSelector";
import { ReasonPicker } from "./adder-panel-components/ReasonPicker";
import { AddButton } from "./adder-panel-components/AddButton";
import { useProductQuantity } from "../context/useProductQuantity";

const BORDER = "#E2E8F0";

export function AdderPanel() {
  const { adderModal } = useProductQuantity();

  return (
    <View style={styles.panel}>
      <ProductSelector />
      {!!adderModal.inventory.selectedProduct && (
        <>
          <View style={styles.stepperSection}>
            <QtyStepper
              value={adderModal.inventory.quantity}
              onChange={adderModal.inventory.setQuantity}
            />
          </View>
          <View style={styles.sectionDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>Bad Order</Text>
            <View style={styles.dividerLine} />
          </View>
          <View style={styles.stepperSection}>
            <QtyStepper
              label="Bad Order Qty"
              value={adderModal.inventory.boQty}
              onChange={adderModal.inventory.setBoQty}
            />
            {adderModal.inventory.needsReason && (
              <Text style={styles.reasonWarning}>Reason required</Text>
            )}
          </View>

          <ReasonPicker />

          <AddButton />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: { gap: 20 },

  stepperSection: {
    alignItems: "center",
    paddingVertical: 4,
  },

  sectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: BORDER },
  dividerLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#CBD5E1",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  reasonWarning: {
    fontSize: 11,
    fontWeight: "600",
    color: "#EF4444",
  },
});
