"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

// Fix Leaflet icon issues
const DefaultIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Custom warehouse icons
export const warehouseIcons = {
  distribution: new L.Icon({
    iconUrl: "/images/warehouses/distribution.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  fulfillment: new L.Icon({
    iconUrl: "/images/warehouses/fulfillment.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  manufacturing: new L.Icon({
    iconUrl: "/images/warehouses/manufacturing.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  storage: new L.Icon({
    iconUrl: "/images/warehouses/storage.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
  // Default icon as fallback
  default: new L.Icon({
    iconUrl: "/images/warehouses/default.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  }),
};

// Fallback to default icon if custom icons are not available
L.Marker.prototype.options.icon = DefaultIcon;

// Interface for warehouse data
export interface IWarehouseLocation {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  status: string;
  currentStock?: number;
}

// Map controller to fit bounds
function MapController({ warehouses }: { warehouses: IWarehouseLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (warehouses.length > 0) {
      const bounds = L.latLngBounds(
        warehouses.map((warehouse) =>
          L.latLng(warehouse.latitude, warehouse.longitude)
        )
      );
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [warehouses, map]);

  return null;
}

interface WarehouseMapComponentProps {
  warehouses: IWarehouseLocation[];
  selectedWarehouseId?: string;
  onWarehouseSelect?: (warehouseId: string) => void;
  height?: string | number;
  router?: any;
}

function WarehouseMapComponent({
  warehouses,
  selectedWarehouseId,
  onWarehouseSelect,
  height = "500px",
  router,
}: WarehouseMapComponentProps) {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(
    selectedWarehouseId || null
  );
  const mapRef = useRef<L.Map | null>(null);

  if (!warehouses || warehouses.length === 0) {
    return (
      <div className="h-[400px] w-full">
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "success";
      case "inactive":
        return "muted";
      case "maintenance":
        return "warning";
      case "closed":
        return "secondary";
      default:
        return "secondary";
    }
  };

  // Handle warehouse selection
  const handleWarehouseClick = (warehouseId: string) => {
    if (router) {
      router.push(`/dashboard/warehousing/${warehouseId}`);
    }
    if (onWarehouseSelect) {
      onWarehouseSelect(warehouseId);
    }
    setSelectedWarehouse(warehouseId);
  };

  return (
    <div style={{ height, width: "100%" }}>
      <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        <MapController warehouses={warehouses} />

        {warehouses.map((warehouse) => (
          <Marker
            key={warehouse.id}
            position={[warehouse.latitude, warehouse.longitude]}
            icon={
              warehouseIcons[warehouse.type as keyof typeof warehouseIcons] ||
              warehouseIcons.default
            }
            eventHandlers={{
              click: () => handleWarehouseClick(warehouse.id),
            }}
          >
            <Popup>
              <Card className="border-0 shadow-none">
                <CardHeader className="p-2 pb-1">
                  <CardTitle className="text-sm">{warehouse.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      Status:
                    </span>
                    <Badge variant={getStatusBadgeVariant(warehouse.status)}>
                      {warehouse.status}
                    </Badge>
                  </div>
                  {warehouse.currentStock !== undefined && (
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">
                        Stock:
                      </span>
                      <span className="text-xs font-medium">
                        {warehouse.currentStock} items
                      </span>
                    </div>
                  )}
                  {onWarehouseSelect && (
                    <Button
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => onWarehouseSelect(warehouse.id)}
                    >
                      View Details
                    </Button>
                  )}
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default WarehouseMapComponent;
