import { useRouteDetail } from "../context/useRouteDetail";

export function useRouteDetailModals() {
  const {
    modal,
    close,
    routeId,
    swipeableRefs,
    loadProvinces,
    loadStoresForProvince,
    deleteProvince,
    deleteStore,
  } = useRouteDetail();

  const handleDeleteProvinceConfirm = () => {
    if (modal?.type !== "deleteProvince") return;
    deleteProvince(modal.province.id);
    close();
  };

  const handleDeleteStoreConfirm = () => {
    if (modal?.type !== "deleteStore") return;
    deleteStore(modal.store);
    close();
  };

  const handleDeleteStoreCancel = () => {
    if (modal?.type === "deleteStore") {
      swipeableRefs.current[modal.store.id]?.close();
    }
    close();
  };

  return {
    modal,
    close,
    routeId,
    loadProvinces,
    loadStoresForProvince,
    handleDeleteProvinceConfirm,
    handleDeleteStoreConfirm,
    handleDeleteStoreCancel,
  };
}
