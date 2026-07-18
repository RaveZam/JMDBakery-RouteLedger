import { Card } from "@/components/ui/card";
import type { BoRateRow } from "../helpers/computeBoRateByKey";

function boRateColor(pct: number): string {
  if (pct >= 20) return "text-red-600 dark:text-red-500";
  if (pct >= 10) return "text-amber-600 dark:text-amber-500";
  return "text-muted-foreground";
}

export function BoRateTable({
  title,
  labelHeader,
  rows,
}: {
  title: string;
  labelHeader: string;
  rows: BoRateRow[];
}) {
  return (
    <Card className="overflow-hidden border-border/70 p-0 shadow-soft dark:shadow-soft-dark">
      <div className="border-b border-border/70 px-4 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {rows.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">
          No data for this period.
        </p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-2 font-medium">{labelHeader}</th>
              <th className="px-4 py-2 text-right font-medium">Sold</th>
              <th className="px-4 py-2 text-right font-medium">Bad order</th>
              <th className="px-4 py-2 text-right font-medium">Bad order rate</th>
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums">
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-border/50 last:border-0 hover:bg-muted/50">
                <td className="px-4 py-2 font-sans">{row.key}</td>
                <td className="px-4 py-2 text-right text-muted-foreground">{row.sold}</td>
                <td className="px-4 py-2 text-right text-muted-foreground">{row.bo}</td>
                <td className={`px-4 py-2 text-right font-semibold ${boRateColor(row.boRatePct)}`}>
                  {row.boRatePct.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}
