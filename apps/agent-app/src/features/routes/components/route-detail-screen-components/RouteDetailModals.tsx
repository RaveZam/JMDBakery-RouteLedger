import { AddProvinceModal } from "./addProvinceModal";
import { AddStoreModal } from "./addStoreModal";
import { ViewStoreModal } from "./ViewStoreModal";
import { DeleteProvinceModal } from "./DeleteProvinceModal";
import { DeleteStoreModal } from "./DeleteStoreModal";
import { useRouteDetailModals } from "../../hooks/useRouteDetailModals";

export function RouteDetailModals() {
  const {
    modal,
    close,
    routeId,
    loadProvinces,
    loadStoresForProvince,
    handleDeleteProvinceConfirm,
    handleDeleteStoreConfirm,
    handleDeleteStoreCancel,
  } = useRouteDetailModals();

  return (
    <>
      {modal?.type === "addProvince" && routeId && (
        <AddProvinceModal
          routeId={routeId}
          onClose={close}
          onAdded={() => {
            close();
            loadProvinces();
          }}
        />
      )}

      {modal?.type === "addStore" && (
        <AddStoreModal
          provinceId={modal.province.id}
          provinceName={modal.province.name}
          onClose={close}
          onAdded={() => {
            const provinceId = modal.province.id;
            close();
            loadStoresForProvince(provinceId);
          }}
        />
      )}

      {modal?.type === "editStore" && (
        <AddStoreModal
          provinceId={modal.province.id}
          provinceName={modal.province.name}
          initialStore={modal.store}
          onClose={close}
          onAdded={() => {}}
          onUpdated={() => {
            loadStoresForProvince(modal.province.id);
            close();
          }}
        />
      )}

      <ViewStoreModal
        store={modal?.type === "viewStore" ? modal.store : null}
        onClose={close}
      />

      <DeleteProvinceModal
        province={modal?.type === "deleteProvince" ? modal.province : null}
        onConfirm={handleDeleteProvinceConfirm}
        onCancel={close}
      />

      <DeleteStoreModal
        store={modal?.type === "deleteStore" ? modal.store : null}
        onConfirm={handleDeleteStoreConfirm}
        onCancel={handleDeleteStoreCancel}
      />
    </>
  );
}
