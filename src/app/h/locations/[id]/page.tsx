"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { ILocation } from "@/types/location";
import { toast } from "sonner";
import { useLocationActions } from "@/hooks/use-location-actions";
import { LocationForm } from "@/components/(private)/dashboard/locations/location-form";
import { LocationMap } from "@/components/(private)/dashboard/locations/location-map";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

export default function LocationDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const { deleteLocation } = useLocationActions();

  // Mock query - Replace with actual API call
  const { data: location = mockLocation } = useQuery({
    queryKey: ["location", params.id],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockLocation;
    },
  });

  const handleDelete = async () => {
    try {
      await deleteLocation.mutateAsync({ id: params.id });
      toast.success("Location deleted successfully");
      router.push("/h/locations");
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/h/locations")}
        >
          <IconArrowLeft />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{location.name}</h1>
          <p className="text-muted-foreground">
            {location.address}, {location.city}, {location.state}{" "}
            {location.postalCode}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Location Details</CardTitle>
              {!isEditing ? (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <IconEdit />
                  Edit Location
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <LocationForm mode="edit" location={location} />
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Name
                    </p>
                    <p className="text-lg">{location.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Type
                    </p>
                    <Badge variant="outline">{location.type}</Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Status
                    </p>
                    <Badge
                      variant={
                        location.status === "active"
                          ? "secondary"
                          : location.status === "inactive"
                          ? "error"
                          : "default"
                      }
                    >
                      {location.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Capacity
                    </p>
                    <p className="text-lg">
                      {location.currentStock} / {location.capacity}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Address
                  </p>
                  <p className="text-lg">
                    {location.address}, {location.city}, {location.state}{" "}
                    {location.postalCode}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Manager
                    </p>
                    <p className="text-lg">{location.manager}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Phone
                    </p>
                    <p className="text-lg">{location.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="text-lg">{location.email}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Operating Hours
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(location.operatingHours).map(
                      ([day, hours]) => (
                        <div key={day} className="flex justify-between">
                          <span className="capitalize">{day}</span>
                          <span>{hours}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden">
              <LocationMap
                locations={[location]}
                selectedLocation={location}
                onLocationSelect={(loc) => {
                  if (isEditing) {
                    // Update location coordinates when map is clicked
                    // This will be handled by the form
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Delete Location</h3>
                  <p className="text-sm text-muted-foreground">
                    Once you delete a location, there is no going back. Please
                    be certain.
                  </p>
                </div>
                <Button color="error" onClick={() => setDeleteDialogOpen(true)}>
                  <IconTrash />
                  Delete Location
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              location and remove all associated data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
