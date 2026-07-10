import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Swipeable } from "react-native-gesture-handler";
import { formatSessionDate } from "../core/format-session-date";
import {
  getSessionBadgeVariant,
  type SessionBadgeVariant,
} from "../core/session-badge-variant";
import type { SessionRow } from "../hooks/useHistoryList";
import { deleteHistorySession } from "../services/delete-session-service";

function confirmDeleteSession(session: SessionRow, onDeleted: () => void) {
  Alert.alert(
    "Delete session?",
    `This removes "${session.route_name}" from this device. This can't be undone.`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteHistorySession(session.id);
          onDeleted();
        },
      },
    ],
  );
}

function DeleteSessionAction({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity
      style={styles.deleteAction}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
      <Text style={styles.deleteActionText}>Delete</Text>
    </TouchableOpacity>
  );
}

function SessionCardIcon({ variant }: { variant: SessionBadgeVariant }) {
  return (
    <View style={[styles.cardIcon, iconWrapStyle[variant]]}>
      <Ionicons name={iconName[variant]} size={18} color={iconColor[variant]} />
    </View>
  );
}

function SessionCardContent({
  session,
  variant,
}: {
  session: SessionRow;
  variant: SessionBadgeVariant;
}) {
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
      <SessionCardIcon variant={variant} />
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

export function HistorySessionCard({
  session,
  onDeleted,
}: {
  session: SessionRow;
  onDeleted: () => void;
}) {
  const variant = getSessionBadgeVariant(session.status);
  const deletable = session.status !== "completed";

  if (!deletable) {
    return <SessionCardContent session={session} variant={variant} />;
  }

  return (
    <Swipeable
      renderRightActions={() => (
        <DeleteSessionAction
          onPress={() => confirmDeleteSession(session, onDeleted)}
        />
      )}
      rightThreshold={60}
      overshootRight={false}
    >
      <SessionCardContent session={session} variant={variant} />
    </Swipeable>
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
  badgeText: { fontSize: 11, fontWeight: "600", textTransform: "capitalize" },
  deleteAction: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    borderRadius: 14,
    marginLeft: 8,
    gap: 4,
  },
  deleteActionText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
  },

  iconWrapDone: { backgroundColor: "#ECFDF5" },
  iconWrapOngoing: { backgroundColor: "#F1F5F9" },
  iconWrapCancelled: { backgroundColor: "#FEF2F2" },

  badgeDone: { backgroundColor: "#16A34A", borderColor: "#15803D" },
  badgeOngoing: { backgroundColor: "#F8FAFC", borderColor: "#CBD5E1" },
  badgeCancelled: { backgroundColor: "#FEE2E2", borderColor: "#FCA5A5" },
  badgeTextDone: { color: "#FFFFFF" },
  badgeTextOngoing: { color: "#94A3B8" },
  badgeTextCancelled: { color: "#B91C1C" },
});

const iconWrapStyle: Record<SessionBadgeVariant, object> = {
  done: styles.iconWrapDone,
  ongoing: styles.iconWrapOngoing,
  cancelled: styles.iconWrapCancelled,
};

const iconName: Record<SessionBadgeVariant, keyof typeof Ionicons.glyphMap> =
  {
    done: "checkmark-circle-outline",
    ongoing: "ellipse-outline",
    cancelled: "close-circle-outline",
  };

const iconColor: Record<SessionBadgeVariant, string> = {
  done: "#1b6e40",
  ongoing: "#64748B",
  cancelled: "#DC2626",
};

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
