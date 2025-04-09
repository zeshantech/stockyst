"use client";

import * as React from "react";
import { IconDatabase } from "@tabler/icons-react";

import { InventoryStats } from "@/components/dashboard/inventory/inventory-stats";
import { InventoryTrends } from "@/components/dashboard/inventory/inventory-trends";
import { InventoryChart } from "@/components/dashboard/inventory/inventory-chart";
import { useInventoryOverview } from "@/hooks/use-inventory-overview";
import { Skeleton } from "@/components/ui/skeleton";

export default function InventoryOverviewPage() {
  const { data, isLoading, error } = useInventoryOverview();

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <IconDatabase className="size-8 text-blue-500" />
        <div>
          <h1 className="text-3xl font-bold">Inventory Overview</h1>
          <p className="text-muted-foreground">
            Monitor your inventory performance and trends
          </p>
        </div>
      </div>

      {/* Stats Section */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-lg" />
          ))}
        </div>
      ) : (
        <InventoryStats
          totalProducts={data.totalProducts}
          totalStock={data.totalStock}
          lowStockItems={data.lowStockItems}
          outOfStockItems={data.outOfStockItems}
          totalValue={data.totalValue}
          monthlyGrowth={data.monthlyGrowth}
        />
      )}

      {/* Chart Section */}
      {isLoading ? (
        <Skeleton className="h-[400px] rounded-lg" />
      ) : (
        <InventoryChart data={data.monthlyData} />
      )}

      {/* Trends Section */}
      {isLoading ? (
        <div className="space-y-6">
          <Skeleton className="h-[400px] rounded-lg" />
        </div>
      ) : (
        <InventoryTrends monthlyData={data.monthlyData} />
      )}
    </div>
  );
}
