import { View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useHistoryList } from "../hooks/useHistoryList";

const HEADER_BG = "#0b4c29";

export function HistoryHeader() {
  const insets = useSafeAreaInsets();
  const { history } = useHistoryList();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.headerLabel}>SESSION HISTORY</Text>
      <Text style={styles.headerTitle}>Past Sessions</Text>
      <Text style={styles.headerSub}>
        {history.sessions.length}{" "}
        {history.sessions.length === 1 ? "session" : "sessions"} recorded
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: HEADER_BG,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#86EFAC",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  headerSub: { fontSize: 13, color: "#BBF7D0", marginTop: 6 },
});
