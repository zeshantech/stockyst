"use client";

import React from "react";
import { StatsCard } from "@/components/ui/stats-card";
import { useStocks } from "@/hooks/use-stock";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";

export function StockLevelsStats() {
  const { stocks, isLoadingStock } = useStocks();

  if (isLoadingStock) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-24 rounded-lg border bg-card animate-pulse"
          />
        ))}
      </div>
    );
  }

  // Calculate statistics from stock data
  const totalProducts = stocks.length;

  const underMinCount = stocks.filter(
    (stock) => stock.quantity < Math.floor(stock.reorderPoint * 0.8)
  ).length;

  const optimalCount = stocks.filter(
    (stock) =>
      stock.quantity >= Math.floor(stock.reorderPoint * 0.8) &&
      stock.quantity <= Math.floor(stock.reorderPoint * 2)
  ).length;

  const overMaxCount = stocks.filter(
    (stock) => stock.quantity > Math.floor(stock.reorderPoint * 2)
  ).length;

  // Calculate percentages
  const underMinPercentage = Math.round((underMinCount / totalProducts) * 100);
  const optimalPercentage = Math.round((optimalCount / totalProducts) * 100);
  const overMaxPercentage = Math.round((overMaxCount / totalProducts) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="Total Products"
        value={totalProducts.toString()}
        trend={{ value: 0, isPositive: true }}
        description="Products with defined levels"
        subtitle="Inventory tracking"
        badge={<TrendingUp className="h-4 w-4" />}
      />

      <StatsCard
        title="Under Min Level"
        value={underMinCount.toString()}
        trend={{ value: underMinPercentage, isPositive: false }}
        description="Need restocking"
        subtitle={`${underMinPercentage}% of inventory`}
        badge={<AlertCircle className="h-4 w-4 text-destructive" />}
      />

      <StatsCard
        title="Optimal Range"
        value={optimalCount.toString()}
        trend={{ value: optimalPercentage, isPositive: true }}
        description="Within target levels"
        subtitle={`${optimalPercentage}% of inventory`}
        badge={<CheckCircle className="h-4 w-4 text-success" />}
      />

      <StatsCard
        title="Over Max Level"
        value={overMaxCount.toString()}
        trend={{ value: overMaxPercentage, isPositive: false }}
        description="Excess inventory"
        subtitle={`${overMaxPercentage}% of inventory`}
        badge={<AlertTriangle className="h-4 w-4 text-warning" />}
      />
    </div>
  );
}
