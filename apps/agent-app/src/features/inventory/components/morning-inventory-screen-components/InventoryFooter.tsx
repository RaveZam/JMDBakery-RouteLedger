import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMorningInventory } from "@/src/features/inventory/context/useMorningInventory";
import { ConfirmActionModal } from "@/src/shared/components/ConfirmActionModal";

const HEADER_BG = "#0b4c29";

function confirmCancel(cancelInventorySession: () => void) {
  Alert.alert(
    "Cancel this session?",
    "This discards the current session. You can start a new one afterward.",
    [
      { text: "Keep session", style: "cancel" },
      {
        text: "Cancel session",
        style: "destructive",
        onPress: cancelInventorySession,
      },
    ],
  );
}

export function InventoryFooter() {
  const { inventory } = useMorningInventory();
  const [confirmVisible, setConfirmVisible] = useState(false);

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.continueBtn}
        activeOpacity={0.85}
        onPress={() => setConfirmVisible(true)}
      >
        <Text style={styles.continueBtnText}>Continue to Route</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelBtn}
        activeOpacity={0.7}
        onPress={() => confirmCancel(inventory.cancelInventorySession)}
      >
        <Text style={styles.cancelBtnText}>Cancel Session</Text>
      </TouchableOpacity>

      <ConfirmActionModal
        visible={confirmVisible}
        title="Continue to Route"
        body="Are you sure you want to start, inventory is not editable after this point."
        confirmLabel="Continue"
        icon="arrow-forward"
        onConfirm={() => {
          setConfirmVisible(false);
          inventory.handleContinue();
        }}
        onCancel={() => setConfirmVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  continueBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: HEADER_BG,
  },
  continueBtnText: { fontSize: 15, fontWeight: "600", color: "#FFFFFF" },
  cancelBtn: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 10,
  },
  cancelBtnText: { fontSize: 14, fontWeight: "600", color: "#64748B" },
});
