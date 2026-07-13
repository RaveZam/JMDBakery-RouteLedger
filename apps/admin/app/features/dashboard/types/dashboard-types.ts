import type { ComponentType, ReactNode } from "react";

export type FilterRange = "today" | "7days" | "30days";
export const FILTERS: { label: string; value: FilterRange }[] = [
  { label: "Today", value: "today" },
  { label: "7 Days", value: "7days" },
  { label: "30 Days", value: "30days" },
];

export type KpiCardTone =
  | "neutral"
  | "hero"
  | "primary"
  | "healthy"
  | "medium"
  | "warning"
  | "critical";
export type KpiCardAccent = "green" | "gold" | "amber" | "red" | "slate";

export type StatsCardTone = "primary" | "neutral";

export type TeamMember = {
  name: string;
  subtitle: string;
  status: "Completed" | "In Progress" | "Pending";
  avatarFallback: string;
};

export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge?: ReactNode;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export type DayDatum = { day: string; value: number; tone?: "solid" | "striped" };

export type ProductBoRecord = {
  product: string;
  soldQty: number;
  boQty: number;
};

export type AgentSaleRecord = {
  agent: string;
  total: number;
};

export type ProductSoldRecord = {
  product: string;
  soldQty: number;
  total: number;
};
