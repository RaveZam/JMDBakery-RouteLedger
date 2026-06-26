import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { RouteDetailProvider } from "../context/RouteDetailContext";
import { RouteDetailHeader } from "../components/route-detail-screen-components/RouteDetailHeader";
import { StoreSearchBar } from "../components/route-detail-screen-components/StoreSearchBar";
import { ProvinceList } from "../components/route-detail-screen-components/ProvinceList";
import { StartRouteBar } from "../components/route-detail-screen-components/StartRouteBar";
import { RouteDetailModals } from "../components/route-detail-screen-components/RouteDetailModals";

export default function RouteDetailScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <ThemedView style={styles.container}>
        <RouteDetailProvider>
          <RouteDetailContent />
        </RouteDetailProvider>
      </ThemedView>
    </SafeAreaView>
  );
}

function RouteDetailContent() {
  return (
    <>
      <RouteDetailHeader />
      <View style={styles.content}>
        <StoreSearchBar />
        <ProvinceList />
      </View>
      <StartRouteBar />
      <RouteDetailModals />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F0F0EB",
  },
  container: {
    flex: 1,
    backgroundColor: "#F0F0EB",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
});
