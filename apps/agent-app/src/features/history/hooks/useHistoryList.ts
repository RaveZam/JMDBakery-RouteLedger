import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import RouteSessionsDao from "@/src/lib/dao/route-sessions-dao";

export type SessionRow = ReturnType<typeof RouteSessionsDao.getAll>[number];

export function useHistoryList() {
  const [sessions, setSessions] = useState<SessionRow[]>(() =>
    RouteSessionsDao.getAll(),
  );

  const refresh = useCallback(() => {
    setSessions(RouteSessionsDao.getAll());
  }, []);

  useFocusEffect(refresh);

  return { history: { sessions, refresh } };
}
