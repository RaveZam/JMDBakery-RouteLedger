import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import RouteSessionsDao from "@/src/lib/dao/route-sessions-dao";

export type SessionRow = ReturnType<typeof RouteSessionsDao.getAll>[number];

export function useHistoryList() {
  const [sessions, setSessions] = useState<SessionRow[]>(() =>
    RouteSessionsDao.getAll(),
  );

  useFocusEffect(
    useCallback(() => {
      setSessions(RouteSessionsDao.getAll());
    }, []),
  );

  return { history: { sessions } };
}
