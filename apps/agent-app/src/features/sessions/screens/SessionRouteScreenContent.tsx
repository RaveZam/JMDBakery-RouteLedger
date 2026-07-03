import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { EndRouteModal } from "../components/EndRouteModal";
import { SessionRouteHeader } from "../components/session-route-screen-components/SessionRouteHeader";
import { SessionStoreList } from "../components/session-route-screen-components/SessionStoreList";
import { EndRouteFooter } from "../components/session-route-screen-components/EndRouteFooter";
import { useSessionRoute } from "../context/useSessionRoute";

export default function SessionRouteScreen() {
  const { session } = useSessionRoute();
  const { endModal, actions } = session;

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <ThemedView style={styles.container}>
        <SessionRouteHeader />

        <SessionStoreList onPressStore={actions.openStore} />

        <EndRouteFooter onEndRoute={endModal.open} />

        <EndRouteModal
          visible={endModal.isOpen}
          onConfirm={actions.endRoute}
          onCancel={endModal.close}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b4c29",
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F0EB",
  },
});
