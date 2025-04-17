"use client";

import React from "react";
import { useStocks } from "@/hooks/use-stock";
import { QuickActions } from "@/components/(private)/dashboard/stock/quick-actions";
import { StatisticsCards } from "@/components/(private)/dashboard/stock/statistics-cards";
import { InventoryChart } from "@/components/(private)/dashboard/stock/inventory-chart";
import { StockTabs } from "@/components/(private)/dashboard/stock/stock-tabs";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { IconBoxSeam, IconPlus } from "@tabler/icons-react";
import { Page } from "@/components/(private)/dashboard/page";

export default function StockPage() {
  const {
    stocks,
    stockAlerts,
    statistics,
    isLoadingStock,
    isLoadingStatistics,
  } = useStocks();

  return (
    <Page>
      {/* Header Section */}
      <PageHeader
        title="Stock Management"
        description="Monitor and manage your inventory across all locations"
        action={
          <div className="space-x-2">
            <Button variant="outline">
              <IconBoxSeam />
              Import
            </Button>
            <Button>
              <IconPlus />
              Add Stock
            </Button>
          </div>
        }
      />

      {/* Quick Actions */}
      <QuickActions />

      {/* Statistics Cards */}
      <StatisticsCards statistics={statistics} />

      {/* Overview Chart */}
      {statistics && (
        <InventoryChart
          statistics={statistics}
          isLoading={isLoadingStatistics}
        />
      )}

      {/* Tabs for Stock Data */}
      <StockTabs />
    </Page>
  );
}
