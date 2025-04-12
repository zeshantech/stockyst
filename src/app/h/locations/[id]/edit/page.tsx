"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocationForm } from "@/components/(private)/dashboard/locations/location-form";
import { ILocation } from "@/types/location";

// Mock data - Replace with actual API call
const mockLocation: ILocation = {
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
};

export default function EditLocationPage({
  params,
}: {
  params: { id: string };
}) {
  // Mock query - Replace with actual API call
  const { data: location = mockLocation } = useQuery({
    queryKey: ["location", params.id],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockLocation;
    },
  });

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Location</CardTitle>
        </CardHeader>
        <CardContent>
          <LocationForm location={location} mode="edit" />
        </CardContent>
      </Card>
    </div>
  );
}
