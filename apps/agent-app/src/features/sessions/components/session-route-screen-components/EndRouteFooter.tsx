import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSessionRoute } from "../../context/useSessionRoute";

export function EndRouteFooter() {
  const { session } = useSessionRoute();

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.endRouteButton}
        activeOpacity={0.7}
        onPress={session.openEndModal}
      >
        <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
        <Text style={styles.endRouteButtonText}>Finish Route</Text>
      </TouchableOpacity>
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
  endRouteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: "#0b4c29",
  },
  endRouteButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
