import { StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSessionRoute } from "../../context/useSessionRoute";

export function SessionCancelButton() {
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
    <TouchableOpacity
      style={styles.cancelButton}
      activeOpacity={0.7}
      onPress={confirmCancel}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name="close" size={14} color="#FCA5A5" />
      <Text style={styles.cancelButtonText}>Cancel</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(252,165,165,0.4)",
  },
  cancelButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FCA5A5",
  },
});
