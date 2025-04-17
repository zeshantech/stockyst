import React from "react";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/ui/stats-card";

interface StatisticsData {
  totalItems?: {
    count: number;
    isPositive: boolean;
  };
  totalValue?: {
    count: number;
    isPositive: boolean;
  };
  lowStockItems?: {
    count: number;
    isPositive: boolean;
  };
  outOfStockItems?: {
    count: number;
    isPositive: boolean;
  };
}

interface StatisticsCardsProps {
  statistics: StatisticsData | null | undefined;
}

export function StatisticsCards({ statistics }: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Items"
        value={statistics?.totalItems?.count.toString() || "0"}
        trend={{
          value: statistics?.totalItems?.count ?? 0,
          isPositive: statistics?.totalItems?.isPositive ?? true,
        }}
        description="Total inventory items"
        subtitle="Compared to last month"
      />

      <StatsCard
        title="Total Value"
        value={`$${statistics?.totalValue?.count.toFixed(2) || "0.00"}`}
        trend={{
          value: statistics?.totalValue?.count ?? 0,
          isPositive: statistics?.totalValue?.isPositive ?? true,
        }}
        description="Total inventory value"
        subtitle="Current stock value"
      />

      <StatsCard
        title="Low Stock"
        value={statistics?.lowStockItems?.count.toString() || "0"}
        trend={{
          value: statistics?.lowStockItems?.count ?? 0,
          isPositive: statistics?.lowStockItems?.isPositive ?? false,
        }}
        description="Items below reorder point"
        subtitle="Requires attention"
        badge={<Badge variant="warning">Needs Attention</Badge>}
      />

      <StatsCard
        title="Out of Stock"
        value={statistics?.outOfStockItems?.count.toString() || "0"}
        trend={{
          value: statistics?.outOfStockItems?.count ?? 0,
          isPositive: statistics?.outOfStockItems?.isPositive ?? false,
        }}
        description="Items with zero inventory"
        subtitle="Urgent restock needed"
        badge={<Badge variant="error">Critical</Badge>}
      />
    </div>
  );
}
