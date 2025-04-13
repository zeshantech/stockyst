"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  IconBox,
  IconFilter,
  IconPlus,
  IconSearch,
  IconTrendingDown,
  IconTrendingUp,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StockTable } from "@/components/(private)/dashboard/stock/stock-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IStock } from "@/types/stock";
import StatsCard from "@/components/ui/stats-card";
import { useStock } from "@/hooks/use-stock";

export default function StockPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const { data: stock = [], isLoading } = useStock();

  // Filter stock based on status and search query
  const filteredStock = React.useMemo(() => {
    return stock.filter((item) => {
      const matchesSearch =
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || item.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [stock, searchQuery, selectedStatus]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalItems = stock.length;
    const totalValue = stock.reduce((sum, item) => sum + item.totalValue, 0);
    const lowStockItems = stock.filter(
      (item) => item.quantity <= item.reorderPoint
    ).length;
    const outOfStockItems = stock.filter((item) => item.quantity === 0).length;

    return {
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
    };
  }, [stock]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage your inventory
          </p>
        </div>
        <Button onClick={() => router.push("/h/stock/add")}>
          <IconPlus />
          Add Stock
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Items"
          value={stats.totalItems.toString()}
          trend={{
            value: 12.5,
            isPositive: true,
          }}
          description="Total inventory items"
          subtitle="Compared to last month"
        />

        <StatsCard
          title="Total Value"
          value={`$${stats.totalValue.toFixed(2)}`}
          trend={{
            value: 8.3,
            isPositive: true,
          }}
          description="Total inventory value"
          subtitle="Current stock value"
        />

        <StatsCard
          title="Low Stock"
          value={stats.lowStockItems.toString()}
          trend={{
            value: 5.2,
            isPositive: false,
          }}
          description="Items below reorder point"
          subtitle="Requires attention"
          badge={<Badge variant="warning">Needs Attention</Badge>}
        />

        <StatsCard
          title="Out of Stock"
          value={stats.outOfStockItems.toString()}
          trend={{
            value: 0,
            isPositive: false,
          }}
          description="Items with zero inventory"
          subtitle="Urgent restock needed"
          badge={<Badge variant="error">Critical</Badge>}
        />
      </div>

      {/* Stock Table */}
      <StockTable data={filteredStock} />
    </div>
  );
}
