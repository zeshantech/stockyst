"use client";

import React from "react";
import dynamic from "next/dynamic";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Page } from "@/components/(private)/dashboard/page";
import { useParams, useRouter } from "next/navigation";
import { useWarehousing } from "@/hooks/use-warehousing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconBox,
  IconBuilding,
  IconChevronRight,
  IconEdit,
  IconLayoutGrid,
  IconListCheck,
  IconMap2,
  IconPackage,
  IconRuler,
  IconTruck,
  IconUsers,
} from "@tabler/icons-react";

// Dynamically import the map components with no SSR
const LocationPickerMap = dynamic(
  () =>
    import(
      "@/components/(private)/dashboard/locations/location-picker-map"
    ).then((mod) => mod.LocationPickerMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full flex items-center justify-center bg-gray-100">
        <p>Loading map...</p>
      </div>
    ),
  }
);

const WarehouseFloorPlan = dynamic(
  () =>
    import(
      "@/components/(private)/dashboard/warehousing/warehouse-floor-plan"
    ).then((mod) => mod.WarehouseFloorPlan),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full flex items-center justify-center bg-gray-100">
        <p>Loading floor plan...</p>
      </div>
    ),
  }
);

export default function WarehouseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const {
    warehouses,
    getLocationsByWarehouseId,
    isLoadingWarehouses,
    getWarehouseCoordinates,
  } = useWarehousing();

  const warehouse = warehouses.find((w) => w.id === id);
  const locations = warehouse ? getLocationsByWarehouseId(warehouse.id) : [];

  // Function to convert warehouse to location format
  const warehouseToLocation = (warehouse: any) => {
    const coordinates = getWarehouseCoordinates(warehouse.id);
    return {
      id: warehouse.id,
      name: warehouse.name,
      address: warehouse.address,
      city: warehouse.city,
      state: warehouse.state,
      country: warehouse.country,
      postalCode: warehouse.zipCode,
      latitude: coordinates.lat,
      longitude: coordinates.lng,
      type: "warehouse" as const,
      status: warehouse.status,
      capacity: warehouse.capacity,
      currentStock: warehouse.utilization,
      manager: warehouse.manager,
      phone: warehouse.phone,
      email: warehouse.email,
      operatingHours: {
        monday: "9:00 AM - 5:00 PM",
        tuesday: "9:00 AM - 5:00 PM",
        wednesday: "9:00 AM - 5:00 PM",
        thursday: "9:00 AM - 5:00 PM",
        friday: "9:00 AM - 5:00 PM",
        saturday: "Closed",
        sunday: "Closed",
      },
      notes: warehouse.description,
      createdAt: warehouse.createdAt,
      updatedAt: warehouse.updatedAt,
    };
  };

  if (isLoadingWarehouses) {
    return (
      <Page>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-1/2 mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-[400px] bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-6 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Page>
    );
  }

  if (!warehouse) {
    return (
      <Page>
        <PageHeader
          title="Warehouse Not Found"
          description="The requested warehouse could not be found"
          backButton={true}
        />
        <Card className="mt-6">
          <CardContent className="p-6 text-center">
            <p>
              The warehouse with ID {id} does not exist or you don't have
              permission to view it.
            </p>
            <Button
              className="mt-4"
              onClick={() => router.push("/h/warehousing")}
            >
              <IconArrowLeft className="mr-2 h-4 w-4" />
              Back to Warehouses
            </Button>
          </CardContent>
        </Card>
      </Page>
    );
  }

  // Calculate utilization percentage
  const utilizationPercentage =
    warehouse.capacity > 0
      ? Math.round((warehouse.utilization / warehouse.capacity) * 100)
      : 0;

  return (
    <Page>
      <PageHeader
        title={warehouse.name}
        description={`${warehouse.address}, ${warehouse.city}, ${warehouse.state} ${warehouse.zipCode}`}
        backButton={true}
        backUrl="/h/warehousing"
        action={
          <Button href={`/h/warehousing/${id}/edit`}>
            <IconEdit className="mr-2 h-4 w-4" />
            Edit Warehouse
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Left column - Map and key details */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="p-0 h-[400px] relative">
              <LocationPickerMap
                location={warehouse ? warehouseToLocation(warehouse) : null}
              />

              <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm p-4 rounded-md shadow-lg">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg">{warehouse.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {warehouse.address}, {warehouse.city}
                    </p>
                  </div>
                  <Badge
                    className="capitalize"
                    variant={
                      warehouse.status === "active"
                        ? "success"
                        : warehouse.status === "inactive"
                        ? "error"
                        : "warning"
                    }
                  >
                    {warehouse.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity</CardTitle>
              <CardDescription>
                Recent warehouse operations and status updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-start space-x-4 pb-4 border-b last:border-0"
                  >
                    <div
                      className={`p-2 rounded-full ${
                        i === 0
                          ? "bg-green-100 text-green-700"
                          : i === 1
                          ? "bg-blue-100 text-blue-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {i === 0 ? (
                        <IconPackage className="h-4 w-4" />
                      ) : i === 1 ? (
                        <IconTruck className="h-4 w-4" />
                      ) : (
                        <IconUsers className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {i === 0
                          ? "Shipment #SC-2345 received"
                          : i === 1
                          ? "Transfer #TRF-5678 initiated"
                          : "Staffing adjusted for peak hours"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {i === 0
                          ? "15,240 units processed and stored"
                          : i === 1
                          ? "4,568 units being transferred to Distribution Center"
                          : "Added 4 workers to evening shift for picking operations"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {i === 0
                          ? "2 hours ago"
                          : i === 1
                          ? "Yesterday, 15:30"
                          : "3 days ago"}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <IconChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Details and metrics */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Warehouse Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Type
                  </p>
                  <div className="flex items-center mt-1">
                    <IconBuilding className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="capitalize">
                      {getWarehouseCoordinates(warehouse.id).type.replace(
                        "-",
                        " "
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Manager
                  </p>
                  <div className="flex items-center mt-1">
                    <IconUsers className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{warehouse.manager}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Contact
                  </p>
                  <div className="grid grid-cols-2 mt-1 gap-2">
                    <span className="text-sm">{warehouse.phone}</span>
                    <span className="text-sm">{warehouse.email}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Capacity
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {warehouse.capacity.toLocaleString()} units
                  </p>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Current stock</span>
                      <span
                        className={
                          utilizationPercentage > 90
                            ? "text-red-500"
                            : utilizationPercentage > 75
                            ? "text-amber-500"
                            : "text-green-500"
                        }
                      >
                        {utilizationPercentage}%
                      </span>
                    </div>
                    <Progress
                      value={utilizationPercentage}
                      className={
                        utilizationPercentage > 90
                          ? "bg-red-200"
                          : utilizationPercentage > 75
                          ? "bg-amber-200"
                          : "bg-green-200"
                      }
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {warehouse.utilization.toLocaleString()} /{" "}
                      {warehouse.capacity.toLocaleString()} units
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Area
                  </p>
                  <div className="flex items-center mt-1">
                    <IconRuler className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>120,000 sq ft</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Storage Locations
                  </p>
                  <div className="flex items-center mt-1">
                    <IconLayoutGrid className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{locations.length} locations configured</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <IconBox className="mr-2 h-4 w-4" />
                  View Inventory
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <IconTruck className="mr-2 h-4 w-4" />
                  Manage Transfers
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <IconListCheck className="mr-2 h-4 w-4" />
                  View Reports
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <IconMap2 className="mr-2 h-4 w-4" />
                  View Floor Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="floor">
          <TabsList>
            <TabsTrigger value="floor">Floor Plan</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="floor" className="mt-4">
            <WarehouseFloorPlan />
          </TabsContent>

          <TabsContent value="inventory" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Inventory</CardTitle>
                <CardDescription>
                  View and manage inventory in this warehouse
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[400px]">
                <p className="text-muted-foreground">
                  Inventory view coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Storage Locations</CardTitle>
                <CardDescription>
                  All storage locations in this warehouse
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[400px]">
                <p className="text-muted-foreground">
                  Locations view coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>
                  Performance metrics and statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center h-[400px]">
                <p className="text-muted-foreground">
                  Statistics view coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  );
}
