import { IntelligencePageClient } from "./components/IntelligencePageClient";

type SearchParams = Record<string, string | string[] | undefined>;

export async function IntelligencePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  return <IntelligencePageClient sp={sp} />;
}

export default IntelligencePage;
