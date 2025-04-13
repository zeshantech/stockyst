"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/ui/stats-card";
import { useProductStatistics } from "@/hooks/use-products";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductsStats() {
  const { data: stats, isLoading } = useProductStatistics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Products"
        value={stats.totalProducts.toString()}
        trend={{
          value: stats.monthlyGrowth,
          isPositive: stats.monthlyGrowth > 0,
        }}
        description="Growing inventory"
        subtitle="Compared to last month"
      />

      <StatsCard
        title="Low Stock Items"
        value={stats.lowStockItems.toString()}
        trend={{
          value: 0,
          isPositive: false,
        }}
        description="Below reorder point"
        subtitle="Requires immediate action"
        badge={<Badge variant="warning">Needs Attention</Badge>}
      />

      <StatsCard
        title="Out of Stock"
        value={stats.outOfStockItems.toString()}
        trend={{
          value: 0,
          isPositive: false,
        }}
        description="Zero inventory"
        subtitle="Urgent restock needed"
        badge={<Badge variant="error">Critical</Badge>}
      />

      <StatsCard
        title="Total Value"
        value={formatCurrency(stats.totalValue)}
        trend={{
          value: stats.monthlyGrowth,
          isPositive: stats.monthlyGrowth > 0,
        }}
        description="Inventory value"
        subtitle="Current stock value"
      />
    </div>
  );
}
