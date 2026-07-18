"use client";

import type { ReactElement } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SalesRecord } from "@/app/server/salesData/getBaseData";
import { formatCurrencyCompact } from "@/app/features/dashboard/helpers/formatCurrencyCompact";
import { computeProvinceRanking } from "../helpers/computeProvinceRanking";

const STRONG_COLOR = "#1f7a44";
const WEAK_COLOR = "#c76b3a";

function barColor(index: number, total: number): string {
  if (total <= 1) return STRONG_COLOR;
  const t = index / (total - 1);
  return t < 0.5 ? STRONG_COLOR : WEAK_COLOR;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: { province: string; revenue: number } }[];
}): ReactElement | null {
  if (!active || !payload?.length) return null;
  const { province, revenue } = payload[0].payload;
  return (
    <div
      style={{
        fontSize: 12,
        borderRadius: 10,
        border: "1px solid hsl(var(--border))",
        boxShadow: "0 10px 30px rgba(15,23,42,0.10)",
        background: "hsl(var(--card))",
        color: "hsl(var(--foreground))",
        padding: "6px 10px",
      }}
    >
      <p className="font-medium">{province}</p>
      <p className="text-muted-foreground">
        Revenue:{" "}
        <span className="font-semibold text-foreground">
          ₱{revenue.toLocaleString()}
        </span>
      </p>
    </div>
  );
}

const AXIS_TICK = { fontSize: 11, fill: "hsl(var(--muted-foreground))" };

function ProvinceBarChart({
  chartData,
}: {
  chartData: { province: string; revenue: number }[];
}): ReactElement {
  const chartHeight = Math.max(chartData.length * 36, 120);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
        <XAxis type="number" tickFormatter={formatCurrencyCompact} tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="province" width={88} tick={AXIS_TICK} axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }} />
        <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={22}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={barColor(i, chartData.length)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ProvinceRankingChart({
  records,
}: {
  records: SalesRecord[];
}): ReactElement {
  const chartData = computeProvinceRanking(records);

  return (
    <Card className="border-border/70 shadow-soft dark:shadow-soft-dark">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Province ranking</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No data for this period.
          </p>
        ) : (
          <ProvinceBarChart chartData={chartData} />
        )}
      </CardContent>
    </Card>
  );
}
