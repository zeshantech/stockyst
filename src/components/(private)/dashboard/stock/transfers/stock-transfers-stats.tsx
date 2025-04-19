"use client";

import React from "react";
import { StatsCard } from "@/components/ui/stats-card";
import { useStocks } from "@/hooks/use-stock";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, AlertCircle, CheckCircle, Clock } from "lucide-react";

export function StockTransfersStats() {
  // In a real app, we would get this from the useStocks hook
  // For now, we'll use sample data
  const { stocks, isLoadingStock } = useStocks();

  // Calculate mock stats for demonstration
  const totalTransfers = 28;
  const pendingTransfers = 10;
  const completedTransfers = 15;
  const cancelledTransfers = 3;

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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatsCard
        title="Total Transfers"
        value={totalTransfers}
        description="All stock transfers"
        subtitle={`${stocks?.length || 0} total stock items`}
        trend={{ value: 12, isPositive: true }}
        badge={<Badge variant="outline">Recent</Badge>}
      />

      <StatsCard
        title="Pending Transfers"
        value={pendingTransfers}
        description="Awaiting processing"
        subtitle="Need attention"
        trend={{ value: 4, isPositive: false }}
        badge={<Badge variant="outline">Urgent</Badge>}
      />

      <StatsCard
        title="Completed Transfers"
        value={completedTransfers}
        description="Successfully processed"
        subtitle="Last 30 days"
        trend={{ value: 8, isPositive: true }}
        badge={<Badge variant="outline">Complete</Badge>}
      />

      <StatsCard
        title="Cancelled Transfers"
        value={cancelledTransfers}
        description="Transfers cancelled"
        subtitle="Last 30 days"
        trend={{ value: 1, isPositive: true }}
        badge={<Badge variant="outline">Low</Badge>}
      />
    </div>
  );
}
