import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { IconChartBarOff } from "@tabler/icons-react";

interface MonthlyData {
  month: string;
  stock: number;
  value: number;
}

interface StatisticsData {
  monthlyData?: MonthlyData[];
}

interface InventoryChartProps {
  statistics: StatisticsData | null | undefined;
  isLoading: boolean;
}

export function InventoryChart({ statistics, isLoading }: InventoryChartProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Inventory Overview</CardTitle>
        <CardDescription>
          Stock quantity and value over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <Spinner size="lg" />
            <span className="ml-2">Loading chart data...</span>
          </div>
        ) : statistics?.monthlyData ? (
          <ChartContainer
            config={{
              quantity: {
                label: "Stock Quantity",
                color: "rgb(99, 102, 241)",
              },
              value: {
                label: "Stock Value",
                color: "rgb(34, 197, 94)",
              },
            }}
            className="h-[300px] w-full"
          >
            <LineChart
              data={statistics.monthlyData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                orientation="left"
              />
              <YAxis
                yAxisId="right"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                orientation="right"
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="stock"
                name="quantity"
                stroke="rgb(99, 102, 241)"
                fill="rgba(99, 102, 241, 0.1)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="value"
                name="value"
                stroke="rgb(34, 197, 94)"
                fill="rgba(34, 197, 94, 0.1)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        ) : (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            <IconChartBarOff className="mr-2 h-5 w-5" />
            <span>No chart data available</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
