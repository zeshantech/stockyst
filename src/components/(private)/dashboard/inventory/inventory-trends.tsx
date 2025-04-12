import * as React from "react";
import { IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

interface InventoryTrendsProps {
  monthlyData: {
    month: string;
    value: number;
    stock: number;
  }[];
}

export function InventoryTrends({ monthlyData }: InventoryTrendsProps) {
  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return 0;
    const first = data[0];
    const last = data[data.length - 1];
    return ((last - first) / first) * 100;
  };

  const valueTrend = calculateTrend(monthlyData.map((d) => d.value));
  const stockTrend = calculateTrend(monthlyData.map((d) => d.stock));

  return (
    <div className="space-y-6">
      {/* Trend Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">
              Value Trend
            </div>
            <Badge variant={valueTrend >= 0 ? "default" : "error"}>
              {valueTrend >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {Math.abs(valueTrend).toFixed(1)}%
            </Badge>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">
              ${monthlyData[monthlyData.length - 1].value.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Current inventory value
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">
              Stock Trend
            </div>
            <Badge variant={stockTrend >= 0 ? "default" : "error"}>
              {stockTrend >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
              {Math.abs(stockTrend).toFixed(1)}%
            </Badge>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-bold">
              {monthlyData[monthlyData.length - 1].stock.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">
              Current stock level
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Data Table */}
      <div className="rounded-lg border">
        <div className="p-4">
          <h3 className="text-lg font-medium">Monthly Overview</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t">
                <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                  Month
                </th>
                <th className="p-4 text-right text-sm font-medium text-muted-foreground">
                  Value
                </th>
                <th className="p-4 text-right text-sm font-medium text-muted-foreground">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody>
              {monthlyData.map((data, index) => (
                <tr key={index} className="border-t">
                  <td className="p-4 text-sm">{data.month}</td>
                  <td className="p-4 text-right text-sm">
                    ${data.value.toLocaleString()}
                  </td>
                  <td className="p-4 text-right text-sm">
                    {data.stock.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
