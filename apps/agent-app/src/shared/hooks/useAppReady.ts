import { useEffect } from "react";
import { router } from "expo-router";
import { supabase } from "@/src/lib/supabase";
import RouteSessionsDao from "@/src/lib/dao/route-sessions-dao";

export function useAppReady(checkingSession: boolean) {
  useEffect(() => {
    if (checkingSession) return;

    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        const ongoing = RouteSessionsDao.getOngoing();
        if (ongoing) {
          if (!ongoing.morning_inventory_finished) {
            router.replace({
              pathname: "/main/routes/inventory",
              params: { sessionId: ongoing.id, routeName: ongoing.route_name },
            });
          } else {
            router.replace({
              pathname: "/main/routes/session",
              params: { sessionId: ongoing.id, routeName: ongoing.route_name },
            });
          }
        }
      }
    })();
  }, [checkingSession]);
}
