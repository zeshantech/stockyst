"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { IconAlertCircle, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { StockAlerts } from "@/components/dashboard/stock/stock-alerts";
import { useStockAlerts } from "@/hooks/use-stock-alerts";
import { Badge } from "@/components/ui/badge";
import { Link, Settings } from "lucide-react";
import NextLink from "next/link";

export default function StockAlertsPage() {
  const router = useRouter();
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

    return {
      totalAlerts,
      activeAlerts,
      highSeverityAlerts,
      lowStockAlerts,
    };
  }, [stockAlerts]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IconAlertCircle className="size-8 text-red-500" />
          <div>
            <h1 className="text-3xl font-bold">Stock Alerts</h1>
            <p className="text-muted-foreground">
              Monitor and manage your stock alerts
            </p>
          </div>
        </div>
        <div className="flex gap-2 mr-2">
          <Button onClick={() => router.push("/h/stock")}>
            <IconPlus />
            View Stock
          </Button>
          <Button
            href="/h/stock/alerts/settings"
            size={"icon"}
            variant={"outline"}
          >
            <Settings />
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Total Alerts
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="text-2xl font-bold">{stats.totalAlerts}</div>
            <Badge variant="outline">All time</Badge>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Active Alerts
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="text-2xl font-bold">{stats.activeAlerts}</div>
            <Badge variant="info">
              Active
            </Badge>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            High Severity
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="text-2xl font-bold">{stats.highSeverityAlerts}</div>
            <Badge variant="error">
              Critical
            </Badge>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="text-sm font-medium text-muted-foreground">
            Low Stock
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="text-2xl font-bold">{stats.lowStockAlerts}</div>
            <Badge variant="warning">
              Warning
            </Badge>
          </div>
        </div>
      </div>

      {/* Stock Alerts Table */}
      <StockAlerts data={stockAlerts} />
    </div>
  );
}
