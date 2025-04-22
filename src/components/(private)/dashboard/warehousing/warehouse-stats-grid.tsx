"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWarehousing } from "@/hooks/use-warehousing";
import {
  IconBuildingWarehouse,
  IconTruck,
  IconPackageExport,
  IconPaint,
  IconCircleCheck,
  IconAlertTriangle,
  IconMapPin,
  IconBox,
  IconChartPie,
} from "@tabler/icons-react";
import { Progress } from "@/components/ui/progress";

export function WarehouseStatsGrid() {
  const {
    warehouses,
    locations,
    isLoadingWarehouses,
    isLoadingLocations,
    statistics,
  } = useWarehousing();

  if (isLoadingWarehouses || isLoadingLocations) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-12 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate statistics
  const totalWarehouses = warehouses.length;
  const activeWarehouses = warehouses.filter(
    (w) => w.status === "active"
  ).length;
  const inactiveWarehouses = warehouses.filter(
    (w) => w.status === "inactive"
  ).length;
  const maintenanceWarehouses = warehouses.filter(
    (w) => w.status === "maintenance"
  ).length;

  const totalLocations = locations.length;

  // Count types of warehouses
  const warehousesByType = warehouses.reduce((acc, warehouse) => {
    const type = warehouse.type || "unknown";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <IconBuildingWarehouse className="mr-2 h-5 w-5 text-blue-500" />
              Warehouses
            </CardTitle>
            <CardDescription>Total facilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{totalWarehouses}</div>
              <div className="flex flex-col gap-1">
                <Badge variant="outline" className="flex items-center">
                  <IconCircleCheck className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-xs">{activeWarehouses} active</span>
                </Badge>
                {inactiveWarehouses > 0 && (
                  <Badge variant="outline" className="flex items-center">
                    <IconAlertTriangle className="mr-1 h-3 w-3 text-amber-500" />
                    <span className="text-xs">
                      {inactiveWarehouses} inactive
                    </span>
                  </Badge>
                )}
                {maintenanceWarehouses > 0 && (
                  <Badge variant="outline" className="flex items-center">
                    <IconPaint className="mr-1 h-3 w-3 text-blue-500" />
                    <span className="text-xs">
                      {maintenanceWarehouses} maintenance
                    </span>
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <IconMapPin className="mr-2 h-5 w-5 text-indigo-500" />
              Locations
            </CardTitle>
            <CardDescription>Across all warehouses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold">{totalLocations}</div>
              <div className="flex flex-col gap-1">
                {warehousesByType["warehouse"] && (
                  <Badge variant="outline" className="flex items-center">
                    <IconBox className="mr-1 h-3 w-3 text-green-500" />
                    <span className="text-xs">
                      {warehousesByType["warehouse"]} warehouses
                    </span>
                  </Badge>
                )}
                {warehousesByType["store"] && (
                  <Badge variant="outline" className="flex items-center">
                    <IconPackageExport className="mr-1 h-3 w-3 text-blue-500" />
                    <span className="text-xs">
                      {warehousesByType["store"]} stores
                    </span>
                  </Badge>
                )}
                {warehousesByType["distribution-center"] && (
                  <Badge variant="outline" className="flex items-center">
                    <IconTruck className="mr-1 h-3 w-3 text-purple-500" />
                    <span className="text-xs">
                      {warehousesByType["distribution-center"]} dist. centers
                    </span>
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <IconBox className="mr-2 h-5 w-5 text-orange-500" />
              Inventory
            </CardTitle>
            <CardDescription>Total stock across all warehouses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="text-3xl font-bold">
                {statistics?.totalUtilization || 124578}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>
                  Capacity: {statistics?.totalCapacity || 250000} units
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs">
                  <span>Utilization</span>
                  <span className="text-amber-500 font-medium">
                    {statistics?.utilizationRate
                      ? `${Math.round(statistics.utilizationRate)}%`
                      : "49%"}
                  </span>
                </div>
                <Progress
                  value={statistics?.utilizationRate || 49}
                  className="text-amber-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-lg">
              <IconChartPie className="mr-2 h-5 w-5 text-purple-500" />
              Distribution
            </CardTitle>
            <CardDescription>Stock across facility types</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.keys(warehousesByType).map((type) => (
                <div key={type} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="capitalize">{type.replace("-", " ")}</span>
                    <span>34% used</span>
                  </div>
                  <Progress value={34} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="incoming">Incoming</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Total Area</span>
                  <span className="text-2xl font-bold">125,400 m²</span>
                  <span className="text-xs text-muted-foreground">
                    Across all facilities
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Picking Locations</span>
                  <span className="text-2xl font-bold">4,578</span>
                  <span className="text-xs text-muted-foreground">
                    Active picking slots
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Storage Bins</span>
                  <span className="text-2xl font-bold">12,842</span>
                  <span className="text-xs text-muted-foreground">
                    Total storage containers
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Avg. Utilization</span>
                  <span className="text-2xl font-bold">
                    {statistics?.utilizationRate
                      ? `${Math.round(statistics.utilizationRate)}%`
                      : "49%"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Space efficiency rate
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="incoming">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Pending Receipts</span>
                  <span className="text-2xl font-bold">
                    {statistics?.pendingReceiving || 48}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Awaiting delivery
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Items Expected</span>
                  <span className="text-2xl font-bold">12,450</span>
                  <span className="text-xs text-muted-foreground">
                    Units in transit
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Dock Allocation</span>
                  <span className="text-2xl font-bold">87%</span>
                  <span className="text-xs text-muted-foreground">
                    Receiving capacity
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Processing Time</span>
                  <span className="text-2xl font-bold">3.2 hrs</span>
                  <span className="text-xs text-muted-foreground">
                    Average per shipment
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outgoing">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Active Shipments</span>
                  <span className="text-2xl font-bold">
                    {statistics?.pendingTransfers || 72}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    In progress
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Items Allocated</span>
                  <span className="text-2xl font-bold">8,925</span>
                  <span className="text-xs text-muted-foreground">
                    Reserved for shipping
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Pick Rate</span>
                  <span className="text-2xl font-bold">98.7%</span>
                  <span className="text-xs text-muted-foreground">
                    Fill rate accuracy
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">Avg. Fulfillment</span>
                  <span className="text-2xl font-bold">2.4 days</span>
                  <span className="text-xs text-muted-foreground">
                    Order to ship time
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
