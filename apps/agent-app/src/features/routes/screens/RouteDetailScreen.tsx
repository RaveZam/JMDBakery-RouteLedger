import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ThemedView } from "@/src/shared/components/ThemedView";
import { Colors } from "@/src/shared/constants/Colors";

import { ProvinceList } from "../components/route-detail-screen-components/ProvinceList";
import { AddProvinceModal } from "../components/route-detail-screen-components/AddProvinceModal";
import { EditProvinceModal } from "../components/route-detail-screen-components/EditProvinceModal";
import { RouteDetailBanner } from "../components/route-detail-screen-components/RouteDetailBanner";
import { useProvinces } from "../hooks/useProvinces";
import { ProvinceRow } from "../types/db-rows";

export default function RouteDetailScreen() {
  const { routeId, routeName } = useLocalSearchParams<{
    routeId?: string;
    routeName?: string;
  }>();
  const { provinces, loadProvinces } = useProvinces();

  const [showAddProvince, setShowAddProvince] = useState(false);
  const [editProvince, setEditProvince] = useState<ProvinceRow | null>(null);

  return (
    <SafeAreaView style={styles.safeArea} edges={["left", "right", "bottom"]}>
      <ThemedView style={styles.container}>
        <RouteDetailBanner
          routeName={routeName ?? "Route"}
          provinceCount={provinces.length}
          onBack={() => router.back()}
          onAddLocation={() => setShowAddProvince(true)}
        />
        <ProvinceList
          provinces={provinces}
          onEditProvince={setEditProvince}
        />
      </ThemedView>

      <AddProvinceModal
        routeId={routeId ?? ""}
        visible={showAddProvince}
        onClose={() => setShowAddProvince(false)}
        onAdded={() => {
          setShowAddProvince(false);
          loadProvinces();
        }}
      />

      <EditProvinceModal
        province={editProvince}
        onClose={() => setEditProvince(null)}
        onChanged={loadProvinces}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});
