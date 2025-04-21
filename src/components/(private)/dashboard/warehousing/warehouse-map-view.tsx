"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useWarehousing } from "@/hooks/use-warehousing";
import { IWarehouseLocation } from "./map-components/warehouse-map-component";

// Dynamically import the map component with no SSR
const MapComponent = dynamic(
  () =>
    import("./map-components/warehouse-map-component").then(
      (mod) => mod.default
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] w-full flex items-center justify-center bg-gray-100">
        <p>Loading map...</p>
      </div>
    ),
  }
);

export function WarehouseMapView() {
  const router = useRouter();
  const {
    warehouses,
    isLoadingWarehouses,
    isLoadingLocations,
    getWarehouseCoordinates,
  } = useWarehousing();

  if (isLoadingWarehouses || isLoadingLocations) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-[400px] w-full flex items-center justify-center">
            <p>Loading map data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Convert warehouses to the format expected by MapComponent
  const warehouseLocations: IWarehouseLocation[] = warehouses.map(
    (warehouse) => {
      // Get coordinates from the centralized function
      const coordinates = getWarehouseCoordinates(warehouse.id);

      return {
        id: warehouse.id,
        name: warehouse.name,
        type: coordinates.type,
        latitude: coordinates.lat,
        longitude: coordinates.lng,
        status: warehouse.status,
        currentStock: coordinates.stock,
      };
    }
  );

  return (
    <Card className="shadow-md">
      <CardContent className="p-0 overflow-hidden">
        <MapComponent warehouses={warehouseLocations} router={router} />
      </CardContent>
    </Card>
  );
}
