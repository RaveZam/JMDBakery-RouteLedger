import type { ProductionRecommendation } from "../helpers/computeProductionRecommendations";

export function ProductionRecommendationRow({
  rec,
}: {
  rec: ProductionRecommendation;
}) {
  return (
    <tr className="border-b border-border/50 last:border-0 hover:bg-muted/50">
      <td className="px-4 py-3 font-sans">{rec.product}</td>
      <td className="px-4 py-3 text-right text-muted-foreground">{rec.totalSold}</td>
      <td className="px-4 py-3 text-right text-muted-foreground">
        {rec.avgSoldPerDay.toFixed(1)}
      </td>
      <td
        className={
          rec.avgBadOrderPerDay > 0
            ? "px-4 py-3 text-right font-semibold text-amber-600 dark:text-amber-500"
            : "px-4 py-3 text-right text-muted-foreground"
        }
      >
        {rec.avgBadOrderPerDay.toFixed(1)}
      </td>
      <td className="px-4 py-3 text-right font-semibold text-primary">
        {rec.recommended}
      </td>
    </tr>
  );
}
