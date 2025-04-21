import React from "react";
import {
  IconBox,
  IconBoxSeam,
  IconBuildingWarehouse,
  IconExchange,
} from "@tabler/icons-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWarehouseStatistics } from "@/hooks/use-warehousing";

// Stats card for individual stat
export function StatCard({
  title,
  value,
  description,
  icon,
  loading = false,
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold">{value}</p>
                {description && (
                  <p className="text-xs text-muted-foreground">{description}</p>
                )}
              </div>
            )}
          </div>
          <div className="rounded-md bg-secondary p-2 text-secondary-foreground">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main warehouse stats component
export function WarehouseStats() {
  const { data: stats, isLoading } = useWarehouseStatistics();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Warehouses"
        value={stats?.totalWarehouses || 0}
        icon={<IconBuildingWarehouse className="h-5 w-5" />}
        loading={isLoading}
      />
      <StatCard
        title="Warehouse Utilization"
        value={`${stats?.utilizationRate || 0}%`}
        description={`${stats?.totalUtilization || 0} / ${
          stats?.totalCapacity || 0
        } units`}
        icon={<IconBoxSeam className="h-5 w-5" />}
        loading={isLoading}
      />
      <StatCard
        title="Pending Transfers"
        value={stats?.pendingTransfers || 0}
        icon={<IconExchange className="h-5 w-5" />}
        loading={isLoading}
      />
      <StatCard
        title="Pending Actions"
        value={(stats?.pendingReceiving || 0) + (stats?.pendingPutaways || 0)}
        description={`${stats?.pendingReceiving || 0} receiving, ${
          stats?.pendingPutaways || 0
        } putaway`}
        icon={<IconBox className="h-5 w-5" />}
        loading={isLoading}
      />
    </div>
  );
}
