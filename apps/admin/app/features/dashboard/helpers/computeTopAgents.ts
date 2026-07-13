import type { AgentSaleRecord } from "../types/dashboard-types";

export function computeTopAgents(data: AgentSaleRecord[]) {
  const totals: { [agent: string]: number } = {};

  for (const row of data) {
    if (!totals[row.agent]) totals[row.agent] = 0;
    totals[row.agent] += row.total;
  }

  return Object.entries(totals)
    .map(([agent, revenue]) => ({ agent, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}
