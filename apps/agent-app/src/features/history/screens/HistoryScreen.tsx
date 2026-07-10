import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { HistoryHeader } from "../components/HistoryHeader";
import { HistorySessionList } from "../components/HistorySessionList";

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right"]}>
      <ThemedView style={styles.container}>
        <HistoryHeader />
        <HistorySessionList />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F0F0EB" },
  container: { flex: 1, backgroundColor: "#F0F0EB" },
});
