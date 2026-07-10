import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { formatSessionDate } from "../core/format-session-date";
import {
  getSessionBadgeVariant,
  type SessionBadgeVariant,
} from "../core/session-badge-variant";
import type { SessionRow } from "../hooks/useHistoryList";

export function HistorySessionCard({ session }: { session: SessionRow }) {
  const variant = getSessionBadgeVariant(session.status);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: "/main/history/[sessionId]" as any,
          params: { sessionId: session.id, routeName: session.route_name },
        })
      }
    >
      <View style={styles.cardIcon}>
        <Ionicons name="document-text-outline" size={18} color="#1b6e40" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {session.route_name}
        </Text>
        <Text style={styles.cardMeta}>
          {formatSessionDate(session.session_date)} •{" "}
          {session.conducted_by.slice(0, 5)}
        </Text>
      </View>
      <View style={[styles.badge, badgeStyle[variant]]}>
        <Text style={[styles.badgeText, badgeTextStyle[variant]]}>
          {session.status}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: { flex: 1, gap: 2 },
  cardTitle: { fontSize: 15, fontWeight: "600", color: "#0F172A" },
  cardMeta: { fontSize: 12, color: "#94A3B8" },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderWidth: 1,
  },
  badgeText: { fontSize: 11, fontWeight: "600" },
  badgeDone: { backgroundColor: "#16A34A", borderColor: "#15803D" },
  badgeOngoing: { backgroundColor: "#F8FAFC", borderColor: "#CBD5E1" },
  badgeCancelled: { backgroundColor: "#FEE2E2", borderColor: "#FCA5A5" },
  badgeTextDone: { color: "#FFFFFF" },
  badgeTextOngoing: { color: "#94A3B8" },
  badgeTextCancelled: { color: "#B91C1C" },
});

const badgeStyle: Record<SessionBadgeVariant, object> = {
  done: styles.badgeDone,
  ongoing: styles.badgeOngoing,
  cancelled: styles.badgeCancelled,
};

const badgeTextStyle: Record<SessionBadgeVariant, object> = {
  done: styles.badgeTextDone,
  ongoing: styles.badgeTextOngoing,
  cancelled: styles.badgeTextCancelled,
};
