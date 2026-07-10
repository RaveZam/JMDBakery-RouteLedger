import { StyleSheet, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSessionRoute } from "../../context/useSessionRoute";
import { formatLongDate } from "@/src/shared/helpers/formatLongDate";
import { SessionCancelButton } from "./SessionCancelButton";

export function SessionRouteHeader() {
  const { session } = useSessionRoute();
  const insets = useSafeAreaInsets();

  const routeName = session.session?.route_name ?? "Route";
  const formattedDate = formatLongDate(session.session?.session_date);

  return (
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
      <View style={styles.headerTopRow}>
        <Text style={styles.headerLabel}>TODAY'S SESSION</Text>
        <View style={styles.headerTopRight}>
          <View style={styles.stopsBadge}>
            <Text style={styles.stopsBadgeText}>
              {session.progress.total} stops
            </Text>
          </View>
          <SessionCancelButton />
        </View>
      </View>
      <Text style={styles.headerTitle} numberOfLines={1}>
        {routeName}
      </Text>
      <View style={styles.headerMeta}>
        {formattedDate ? (
          <>
            <View style={styles.metaDot} />
            <Text style={styles.headerMetaText}>{formattedDate}</Text>
            <Text style={styles.headerMetaSep}>{"  •  "}</Text>
          </>
        ) : null}
        <Text style={styles.headerMetaText}>
          {session.progress.visited} of {session.progress.total} done
        </Text>
      </View>
      <View style={styles.progressRow}>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${session.progress.ratio * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressPct}>
          {session.progress.percent}% completed
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#0b4c29",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#86EFAC",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  headerTopRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stopsBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  stopsBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  headerMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4ADE80",
    marginRight: 6,
  },
  headerMetaText: {
    fontSize: 13,
    color: "#BBF7D0",
    fontWeight: "500",
  },
  headerMetaSep: {
    fontSize: 13,
    color: "#4ADE80",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4ADE80",
    borderRadius: 3,
  },
  progressPct: {
    fontSize: 12,
    color: "#BBF7D0",
    fontWeight: "500",
    minWidth: 80,
    textAlign: "right",
  },
});
