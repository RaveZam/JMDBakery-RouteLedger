import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSessionRoute } from "../../context/useSessionRoute";

export function EndRouteFooter() {
  const { session } = useSessionRoute();

  const confirmCancel = () => {
    Alert.alert(
      "Cancel this session?",
      "This discards the current session. You can start a new one afterward.",
      [
        { text: "Keep session", style: "cancel" },
        {
          text: "Cancel session",
          style: "destructive",
          onPress: () => session.actions.cancelRoute(),
        },
      ],
    );
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.endRouteButton}
        activeOpacity={0.7}
        onPress={session.openEndModal}
      >
        <Ionicons name="stop-circle-outline" size={17} color="#DC2626" />
        <Text style={styles.endRouteButtonText}>End Route</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        activeOpacity={0.7}
        onPress={confirmCancel}
      >
        <Text style={styles.cancelButtonText}>Cancel Session</Text>
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
    gap: 10,
  },
  endRouteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: "#991B1B",
  },
  endRouteButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },
});
