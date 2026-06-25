import { useState, useCallback, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import ProvincesDao from "@/src/lib/dao/province-dao";
import StoresDao from "@/src/lib/dao/store-dao";
import { routeSaveService } from "../services/route-save-service";
import { ProvinceRow, StoreRow } from "../types/db-rows";


export function useProvinces() {
  const { routeId: routeIdParam } = useLocalSearchParams<{ routeId?: string }>();
  const routeId =
    typeof routeIdParam === "string" ? routeIdParam : undefined;

  const [provinces, setProvinces] = useState<ProvinceRow[]>([]);
  const [storesByProvince, setStoresByProvince] = useState<
    Record<string, StoreRow[]>
  >({});

  const loadProvinces = useCallback(() => {
    if (!routeId) return;
    const loaded = ProvincesDao.getProvincesForRoute(routeId);
    setProvinces(loaded);
    const map: Record<string, StoreRow[]> = {};
    for (const p of loaded) {
      map[p.id] = StoresDao.getStoresForProvince(p.id);
    }
    setStoresByProvince(map);
  }, [routeId]);

  const loadStoresForProvince = useCallback((provinceId: string) => {
    setStoresByProvince((prev) => ({
      ...prev,
      [provinceId]: StoresDao.getStoresForProvince(provinceId),
    }));
  }, []);

  useEffect(() => {
    loadProvinces();
  }, [loadProvinces]);

  const deleteProvince = useCallback(
    (id: string) => {
      routeSaveService.deleteProvince(id);
      loadProvinces();
    },
    [loadProvinces],
  );

  const deleteStore = useCallback(
    (store: StoreRow) => {
      routeSaveService.deleteStore(store.id);
      loadStoresForProvince(store.province_id);
    },
    [loadStoresForProvince],
  );

  return {
    provinces,
    storesByProvince,
    loadProvinces,
    loadStoresForProvince,
    deleteProvince,
    deleteStore,
  };
}
