import { useState, useCallback, useEffect, useRef } from "react";
import { Swipeable } from "react-native-gesture-handler";
import RoutesDao from "@/src/lib/dao/routes-dao";
import { routeSaveService } from "../services/route-save-service";
import { Route } from "../types/routes-type";

export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [pendingDelete, setPendingDelete] = useState<Route | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  //used to track swiped routes for deletion
  const swipeableRefs = useRef<Record<string, Swipeable | null>>({});

  const loadRoutes = useCallback(() => {
    setRoutes(RoutesDao.getAllRoutes());
  }, []);

  useEffect(() => {
    loadRoutes();
  }, [loadRoutes]);

  const registerRef = (id: string, ref: Swipeable | null) => {
    swipeableRefs.current[id] = ref;
  };

  const requestDelete = (route: Route) => setPendingDelete(route);

  const handleDeleteConfirm = () => {
    if (!pendingDelete) return;
    routeSaveService.deleteRoute(pendingDelete.id);
    setPendingDelete(null);
    loadRoutes();
  };

  const handleDeleteCancel = () => {
    if (!pendingDelete) return;
    swipeableRefs.current[pendingDelete.id]?.close();
    setPendingDelete(null);
  };

  const openCreateModal = () => setShowCreateModal(true);
  const closeCreateModal = () => setShowCreateModal(false);

  const handleCreateRoute = (routeName: string) => {
    routeSaveService.createRoute(routeName);
    setShowCreateModal(false);
    loadRoutes();
  };

  return {
    routes,
    loadRoutes,
    swipe: { registerRef, requestDelete },
    createModal: {
      isOpen: showCreateModal,
      open: openCreateModal,
      close: closeCreateModal,
      submit: handleCreateRoute,
    },
    deleteModal: {
      pending: pendingDelete,
      confirm: handleDeleteConfirm,
      cancel: handleDeleteCancel,
    },
  };
}
