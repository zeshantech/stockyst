"use client";

import React from "react";
import { StatsCard } from "@/components/ui/stats-card";
import { useWarehousing } from "@/hooks/use-warehousing";
import { Badge } from "@/components/ui/badge";
import { Warehouse, Package, TruckIcon, LayoutGrid } from "lucide-react";

export function WarehousingsStats() {
  // Get warehousing data from the useWarehousing hook
  const { warehouses, locations, transfers, isLoadingWarehouses } =
    useWarehousing();

  // Count active warehouses and calculate space utilization
  const activeWarehouses = warehouses
    ? warehouses.filter((w) => w.status === "active").length
    : 0;
  const totalCapacity = warehouses
    ? warehouses.reduce((acc, w) => acc + w.capacity, 0)
    : 0;
  const usedCapacity = warehouses
    ? warehouses.reduce((acc, w) => acc + w.utilization, 0)
    : 0;
  const utilizationPercentage =
    totalCapacity > 0 ? Math.round((usedCapacity / totalCapacity) * 100) : 0;

  // Count transfers by status
  const pendingTransfers = transfers
    ? transfers.filter(
        (t) => t.status === "pending" || t.status === "in-transit"
      ).length
    : 0;
  const totalLocations = locations ? locations.length : 0;

  if (isLoadingWarehouses) {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="Warehouses"
        value={warehouses?.length || 0}
        description="Total warehouse facilities"
        subtitle={`${activeWarehouses} active warehouses`}
        trend={{ value: 5, isPositive: true }}
        icon={<Warehouse className="h-5 w-5 text-muted-foreground" />}
        badge={<Badge variant="outline">Facilities</Badge>}
      />

      <StatsCard
        title="Space Utilization"
        value={`${utilizationPercentage}%`}
        description="Warehouse space usage"
        subtitle={`${usedCapacity} of ${totalCapacity} units used`}
        trend={{ value: 8, isPositive: utilizationPercentage < 85 }}
        icon={<LayoutGrid className="h-5 w-5 text-muted-foreground" />}
        badge={
          <Badge variant="outline">
            {utilizationPercentage > 85 ? "High" : "Optimal"}
          </Badge>
        }
      />

      <StatsCard
        title="Active Transfers"
        value={pendingTransfers}
        description="Transfers in progress"
        subtitle="Between warehouses"
        trend={{ value: 3, isPositive: false }}
        icon={<TruckIcon className="h-5 w-5 text-muted-foreground" />}
        badge={<Badge variant="outline">Moving</Badge>}
      />

      <StatsCard
        title="Storage Locations"
        value={totalLocations}
        description="Bins and shelves"
        subtitle="Across all warehouses"
        trend={{ value: 12, isPositive: true }}
        icon={<Package className="h-5 w-5 text-muted-foreground" />}
        badge={<Badge variant="outline">Organized</Badge>}
      />
    </div>
  );
}
