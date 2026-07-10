import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function EmptyHistoryList() {
  return (
    <View style={styles.emptyCard}>
      <Ionicons name="time-outline" size={32} color="#94A3B8" />
      <Text style={styles.emptyText}>No sessions yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    padding: 32,
    alignItems: "center",
    gap: 10,
  },
  emptyText: { fontSize: 14, color: "#94A3B8" },
});
