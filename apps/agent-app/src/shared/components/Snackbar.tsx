import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

type SnackbarProps = {
  visible: boolean;
  message: string;
};

export function Snackbar({ visible, message }: SnackbarProps) {
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <View
      style={[styles.container, { top: insets.top + 12 }]}
      pointerEvents="none"
    >
      <View style={styles.pill}>
        <Ionicons name="checkmark-circle" size={18} color="#0b4c29" />
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 16,
    left: 16,
    alignItems: "flex-end",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(134, 239, 172, 0.85)",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  message: {
    color: "#0b4c29",
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },
});
