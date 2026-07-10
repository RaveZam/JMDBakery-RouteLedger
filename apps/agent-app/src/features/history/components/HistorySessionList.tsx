import { ScrollView, StyleSheet } from "react-native";
import { useHistoryList } from "../hooks/useHistoryList";
import { EmptyHistoryList } from "./EmptyHistoryList";
import { HistorySessionCard } from "./HistorySessionCard";

export function HistorySessionList() {
  const { history } = useHistoryList();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {history.sessions.length === 0 ? (
        <EmptyHistoryList />
      ) : (
        history.sessions.map((s) => <HistorySessionCard key={s.id} session={s} />)
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: 16, gap: 10 },
});
