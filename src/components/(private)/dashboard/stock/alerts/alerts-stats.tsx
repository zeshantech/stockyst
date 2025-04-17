"use client";

import React from "react";
import { useStockAlerts } from "@/hooks/use-stock-alerts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

const StatCard = ({
  title,
  value,
  badge,
  badgeVariant,
}: {
  title: string;
  value: number;
  badge: string;
  badgeVariant:
    | "default"
    | "secondary"
    | "outline"
    | "error"
    | "success"
    | "warning"
    | "info"
    | "muted";
}) => {
  return (
    <Card className="rounded-lg border p-4">
      <div className="text-sm font-medium text-muted-foreground">{title}</div>
      <div className="mt-2 flex items-center gap-2">
        <div className="text-2xl font-bold">{value}</div>
        <Badge variant={badgeVariant}>{badge}</Badge>
      </div>
    </Card>
  );
};

const AlertsStats = () => {
  const { stockAlerts, isLoading } = useStockAlerts();

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalAlerts = stockAlerts.length;
    const activeAlerts = stockAlerts.filter(
      (alert) => alert.status === "active"
    ).length;
    const highSeverityAlerts = stockAlerts.filter(
      (alert) => alert.severity === "high" && alert.status === "active"
    ).length;
    const lowStockAlerts = stockAlerts.filter(
      (alert) => alert.alertType === "low-stock" && alert.status === "active"
    ).length;
    const outOfStockAlerts = stockAlerts.filter(
      (alert) => alert.alertType === "out-of-stock" && alert.status === "active"
    ).length;
    const resolvedAlerts = stockAlerts.filter(
      (alert) => alert.status === "resolved"
    ).length;

    return {
      totalAlerts,
      activeAlerts,
      highSeverityAlerts,
      lowStockAlerts,
      outOfStockAlerts,
      resolvedAlerts,
    };
  }, [stockAlerts]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-24">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard
        title="Total Alerts"
        value={stats.totalAlerts}
        badge="All time"
        badgeVariant="outline"
      />

      <StatCard
        title="Active Alerts"
        value={stats.activeAlerts}
        badge="Active"
        badgeVariant="secondary"
      />

      <StatCard
        title="High Severity"
        value={stats.highSeverityAlerts}
        badge="Critical"
        badgeVariant="error"
      />

      <StatCard
        title="Low Stock"
        value={stats.lowStockAlerts}
        badge="Warning"
        badgeVariant="warning"
      />

      <StatCard
        title="Out of Stock"
        value={stats.outOfStockAlerts}
        badge="Alert"
        badgeVariant="error"
      />

      <StatCard
        title="Resolved"
        value={stats.resolvedAlerts}
        badge="Completed"
        badgeVariant="success"
      />
    </div>
  );
};

export default AlertsStats;
