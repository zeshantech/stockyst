"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationsOverviewMap } from "@/components/(private)/dashboard/locations/locations-overview-map";
import { LocationsTable } from "@/components/(private)/dashboard/locations/locations-table";
import { useQuery } from "@tanstack/react-query";
import { ILocation } from "@/types/location";

// Mock data - Replace with actual API call
const mockLocations: ILocation[] = [
  {
    id: "1",
    name: "Main Warehouse",
    address: "123 Industrial Park",
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10001",
    latitude: 40.7128,
    longitude: -74.006,
    type: "warehouse",
    status: "active",
    capacity: 10000,
    currentStock: 7500,
    manager: "John Doe",
    phone: "+1 (555) 123-4567",
    email: "john@example.com",
    operatingHours: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Downtown Store",
    address: "456 Main Street",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    postalCode: "90012",
    latitude: 34.0522,
    longitude: -118.2437,
    type: "store",
    status: "active",
    capacity: 2000,
    currentStock: 1500,
    manager: "Jane Smith",
    phone: "+1 (555) 987-6543",
    email: "jane@example.com",
    operatingHours: {
      monday: "10:00 AM - 8:00 PM",
      tuesday: "10:00 AM - 8:00 PM",
      wednesday: "10:00 AM - 8:00 PM",
      thursday: "10:00 AM - 8:00 PM",
      friday: "10:00 AM - 9:00 PM",
      saturday: "10:00 AM - 9:00 PM",
      sunday: "11:00 AM - 6:00 PM",
    },
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
];

export default function LocationsPage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = React.useState<ILocation>();

  // Mock query - Replace with actual API call
  const { data: locations = mockLocations } = useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockLocations;
    },
  });

  const handleCreateLocation = () => {
    router.push("/h/locations/new");
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Locations</h1>
          <p className="text-muted-foreground">
            Manage and monitor your store locations
          </p>
        </div>
        <Button onClick={() => router.push("/h/locations/add")}>
          <IconPlus />
          Add Location
        </Button>
      </div>

      {/* Map Section */}
      <Card className="p-0">
        <LocationsOverviewMap
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationSelect={setSelectedLocation}
        />
      </Card>

      {/* Table Section */}
      <Card>
        <CardHeader>
          <CardTitle>All Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <LocationsTable data={locations} />
        </CardContent>
      </Card>
    </div>
  );
}
