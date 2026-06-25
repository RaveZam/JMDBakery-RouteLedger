import { useState } from "react";
import { StyleSheet, View, ScrollView, Text } from "react-native";
import { router } from "expo-router";
import { useRoutes } from "../../hooks/useRoutes";
import { CreateRouteModal } from "./CreateRouteModal";
import { RouteCard } from "./RouteCard";
import { EmptyRoutes } from "./EmptyRoutes";
import { CreateRouteFab } from "./CreateRouteFab";
import { DeleteRouteModal } from "./DeleteRouteModal";

export function RouteList() {
  const {
    routes,
    loadRoutes,
    pendingDelete,
    registerRef,
    requestDelete,
    handleDeleteConfirm,
    handleDeleteCancel,
  } = useRoutes();
  const [showCreateRouteModal, setShowCreateRouteModal] = useState(false);

  return (
    <>
      <View style={styles.content}>
        {routes.length > 0 && (
          <Text style={styles.sectionLabel}>
            {routes.length} {routes.length === 1 ? "route" : "routes"} available
          </Text>
        )}

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {routes.length === 0 ? (
            <EmptyRoutes />
          ) : (
            routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                registerRef={registerRef}
                onPress={() =>
                  router.push({
                    pathname: "/main/routes/list",
                    params: { routeId: route.id, routeName: route.name },
                  })
                }
                onDelete={() => requestDelete(route)}
              />
            ))
          )}
        </ScrollView>
      </View>

      {!showCreateRouteModal && (
        <CreateRouteFab onPress={() => setShowCreateRouteModal(true)} />
      )}

      {showCreateRouteModal && (
        <CreateRouteModal
          onClose={() => {
            setShowCreateRouteModal(false);
            loadRoutes();
          }}
        />
      )}

      <DeleteRouteModal
        route={pendingDelete}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    gap: 10,
    paddingBottom: 100,
  },
});
