"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LocationMap } from "@/components/locations/location-map";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface LocationFormData {
  name: string;
  type: "warehouse" | "store" | "distribution-center";
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  capacity: number;
  manager: string;
  phone: string;
  email: string;
}

export default function NewLocationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isMapSelecting, setIsMapSelecting] = React.useState(false);
  const [formData, setFormData] = React.useState<LocationFormData>({
    name: "",
    type: "warehouse",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    latitude: 0,
    longitude: 0,
    capacity: 0,
    manager: "",
    phone: "",
    email: "",
  });

  const createMutation = useMutation({
    mutationFn: async (data: LocationFormData) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { success: true, id: "new-id" };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location created successfully");
      router.push("/h/locations");
    },
    onError: () => {
      toast.error("Failed to create location");
    },
  });

  const handleMapClick = (lat: number, lng: number) => {
    if (isMapSelecting) {
      setFormData((prev) => ({
        ...prev,
        latitude: lat,
        longitude: lng,
      }));
      setIsMapSelecting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
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
          <h1 className="text-3xl font-bold">Add New Location</h1>
          <p className="text-muted-foreground">
            Create a new location in your inventory system
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="Enter location name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={formData.type}
                onValueChange={(value: LocationFormData["type"]) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="store">Store</SelectItem>
                  <SelectItem value="distribution-center">
                    Distribution Center
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input
                placeholder="Enter address"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <Input
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, state: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Country</label>
                <Input
                  placeholder="Enter country"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Postal Code</label>
                <Input
                  placeholder="Enter postal code"
                  value={formData.postalCode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      postalCode: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Latitude</label>
                <Input
                  type="number"
                  step="any"
                  placeholder="Enter latitude"
                  value={formData.latitude}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      latitude: parseFloat(e.target.value),
                    }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Longitude</label>
                <Input
                  type="number"
                  step="any"
                  placeholder="Enter longitude"
                  value={formData.longitude}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      longitude: parseFloat(e.target.value),
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Capacity</label>
              <Input
                type="number"
                placeholder="Enter capacity"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    capacity: parseInt(e.target.value),
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Manager</label>
              <Input
                placeholder="Enter manager name"
                value={formData.manager}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, manager: e.target.value }))
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Location Map</CardTitle>
              <Button
                variant={isMapSelecting ? "default" : "outline"}
                onClick={() => setIsMapSelecting(!isMapSelecting)}
                type="button"
              >
                {isMapSelecting ? "Cancel Selection" : "Select on Map"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden">
              <LocationMap
                locations={[]}
                selectedLocation={null}
                onMapClick={handleMapClick}
                isSelecting={isMapSelecting}
              />
            </div>
            {isMapSelecting && (
              <p className="mt-2 text-sm text-muted-foreground">
                Click on the map to select the location coordinates
              </p>
            )}
          </CardContent>
        </Card>

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit">Create Location</Button>
        </div>
      </form>
    </div>
  );
}
