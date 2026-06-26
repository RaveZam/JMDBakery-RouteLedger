import { getDb } from "@/src/lib/db";
import RoutesDao from "@/src/lib/dao/routes-dao";
import ProvincesDao from "@/src/lib/dao/province-dao";
import StoresDao from "@/src/lib/dao/store-dao";
import type { CreateRouteDraft } from "../types/routes-type";

export const routeSaveService = {
  createRouteFromDraft(draft: CreateRouteDraft) {
    const trimmedRouteName = draft.name.trim();

    if (!trimmedRouteName) {
      throw new Error("Route name is required.");
    }

    if (draft.provinces.length === 0) {
      throw new Error("Add at least one province.");
    }

    getDb().withTransactionSync(() => {
      const routeId = RoutesDao.insertRoute(trimmedRouteName);

      draft.provinces.forEach((province) => {
        const provinceName = province.name.trim();

        if (!provinceName) return;

        const provinceId = ProvincesDao.insertProvince(routeId, provinceName);

        province.stores.forEach((store) => {
          const storeName = store.name.trim();

          if (!storeName) return;

          StoresDao.insertStore({
            provinceId: provinceId,
            name: storeName,
            province: store.province?.trim() ?? "",
            city: store.city?.trim() ?? "",
            barangay: store.barangay?.trim() ?? "",
            contactName: store.contactName?.trim() ?? "",
            contactPhone: store.contactPhone?.trim() ?? "",
          });
        });
      });
    });

    return RoutesDao.getAllRoutes();
  },

  // Route-building entities (routes/provinces/stores added here) are local-only:
  // createRouteFromDraft never enqueues, so these mutations stay off the outbox
  // to match. If routes/provinces ever need to sync, wire create + these together.
  renameRoute(id: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    RoutesDao.renameRoute(id, trimmed);
  },

  deleteRoute(id: string) {
    RoutesDao.deleteRoute(id);
  },

  addProvince(routeId: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    ProvincesDao.insertProvince(routeId, trimmed);
  },

  deleteProvince(id: string) {
    ProvincesDao.deleteProvince(id);
  },

  deleteStore(id: string) {
    StoresDao.deleteStore(id);
  },
};
