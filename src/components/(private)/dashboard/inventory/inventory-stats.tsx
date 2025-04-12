import * as React from "react";
import {
  IconBox,
  IconPackage,
  IconAlertCircle,
  IconTrendingUp,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

interface InventoryStatsProps {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  monthlyGrowth: number;
}

export function InventoryStats({
  totalProducts,
  totalStock,
  lowStockItems,
  outOfStockItems,
  totalValue,
  monthlyGrowth,
}: InventoryStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Total Products */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">
            Total Products
          </div>
          <IconBox className="size-5 text-blue-500" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold">{totalProducts}</div>
          <div className="text-sm text-muted-foreground">
            Unique items in inventory
          </div>
        </div>
      </div>

      {/* Total Stock */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">
            Total Stock
          </div>
          <IconPackage className="size-5 text-green-500" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold">{totalStock}</div>
          <div className="text-sm text-muted-foreground">
            Total units in stock
          </div>
        </div>
      </div>

      {/* Inventory Value */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">
            Total Value
          </div>
          <IconTrendingUp className="size-5 text-purple-500" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold">
            ${totalValue.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            {monthlyGrowth >= 0 ? "+" : ""}
            {monthlyGrowth}% this month
          </div>
        </div>
      </div>

      {/* Stock Alerts */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">
            Low Stock
          </div>
          <IconAlertCircle className="size-5 text-yellow-500" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold">{lowStockItems}</div>
          <div className="text-sm text-muted-foreground">
            Items need attention
          </div>
        </div>
      </div>

      {/* Out of Stock */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">
            Out of Stock
          </div>
          <IconAlertCircle className="size-5 text-red-500" />
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold">{outOfStockItems}</div>
          <div className="text-sm text-muted-foreground">
            Items need restocking
          </div>
        </div>
      </div>

      {/* Stock Health */}
      <div className="rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-muted-foreground">
            Stock Health
          </div>
          <Badge
            variant={lowStockItems + outOfStockItems > 10 ? "error" : "default"}
          >
            {lowStockItems + outOfStockItems > 10
              ? "Needs Attention"
              : "Healthy"}
          </Badge>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-bold">
            {Math.round(
              ((totalProducts - lowStockItems - outOfStockItems) /
                totalProducts) *
                100
            )}
            %
          </div>
          <div className="text-sm text-muted-foreground">
            of items in good condition
          </div>
        </div>
      </div>
    </div>
  );
}
