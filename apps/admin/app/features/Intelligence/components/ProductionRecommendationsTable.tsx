import type { ProductionRecommendation } from "../helpers/computeProductionRecommendations";
import { Card } from "@/components/ui/card";
import { ProductionRecommendationRow } from "./ProductionRecommendationRow";

export function ProductionRecommendationsTable({
  recommendations,
}: {
  recommendations: ProductionRecommendation[];
}) {
  return (
    <Card className="overflow-hidden border-border/70 p-0 shadow-soft dark:shadow-soft-dark">
      <div className="max-h-[70vh] overflow-auto">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-10 bg-card">
            <tr className="border-b border-border/70 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 text-right font-medium">30-day sold</th>
              <th className="px-4 py-3 text-right font-medium">Active days</th>
              <th className="px-4 py-3 text-right font-medium">Bake / day</th>
            </tr>
          </thead>
          <tbody className="font-mono tabular-nums">
            {recommendations.map((rec) => (
              <ProductionRecommendationRow key={rec.product} rec={rec} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
