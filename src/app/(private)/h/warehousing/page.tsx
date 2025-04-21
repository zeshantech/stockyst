"use client";

import React from "react";
import dynamic from "next/dynamic";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Page } from "@/components/(private)/dashboard/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WarehouseStatsGrid } from "@/components/(private)/dashboard/warehousing/warehouse-stats-grid";
import { WarehousesTable } from "@/components/(private)/dashboard/warehousing/warehousing-table";

// Dynamically import map components with no SSR
const WarehouseMapView = dynamic(
  () =>
    import(
      "@/components/(private)/dashboard/warehousing/warehouse-map-view"
    ).then((mod) => mod.WarehouseMapView),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p>Loading map view...</p>
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
      <div className="h-[500px] w-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p>Loading floor plan...</p>
      </div>
    ),
  }
);

export default function WarehousePage() {
  return (
    <Page>
      <PageHeader
        title="Warehousing"
        description="Manage warehouses and storage locations"
        action={
          <Button href="/h/warehousing/add">
            <IconPlus className="mr-2 h-4 w-4" />
            Add Warehouse
          </Button>
        }
      />

      <div className="space-y-6">
        <WarehouseStatsGrid />

        <Tabs defaultValue="map">
          <TabsList className="w-full">
            <TabsTrigger value="map" className="flex-1">
              Map View
            </TabsTrigger>
            <TabsTrigger value="floor" className="flex-1">
              Floor Plan
            </TabsTrigger>
            <TabsTrigger value="table" className="flex-1">
              Table View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-4">
            <WarehouseMapView />

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Nearby Locations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Placeholder for nearby locations */}
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">Nearby Location {i + 1}</h4>
                        <p className="text-sm text-muted-foreground">
                          15 km away
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        Details
                      </Button>
                    </div>
                    <div className="text-sm">
                      <p>123 Main St, City {i + 1}</p>
                      <p className="mt-1 text-muted-foreground">
                        Stock: 4,567 units · Capacity: 12,000 units
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="floor" className="mt-4">
            <WarehouseFloorPlan />
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <WarehousesTable />
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  );
}
