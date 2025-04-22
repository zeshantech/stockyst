"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Selector } from "@/components/ui/selector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import dynamic from "next/dynamic";
import { ILocation } from "@/types/location";

// Dynamically import the map component with ssr disabled
const LocationPickerMap = dynamic(
  () => import("./location-picker-map").then((mod) => mod.LocationPickerMap),
  { ssr: false }
);

// Zod schema for form validation
const locationFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["warehouse", "store", "distribution-center"]),
  status: z.enum(["active", "inactive", "maintenance"]),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  latitude: z.number(),
  longitude: z.number(),
  capacity: z.number().min(0, "Capacity must be positive"),
  currentStock: z.number().min(0, "Current stock must be positive"),
  manager: z.string().min(1, "Manager name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  operatingHours: z.object({
    monday: z.string(),
    tuesday: z.string(),
    wednesday: z.string(),
    thursday: z.string(),
    friday: z.string(),
    saturday: z.string(),
    sunday: z.string(),
  }),
  notes: z.string().optional(),
});

export type LocationFormValues = z.infer<typeof locationFormSchema>;

interface LocationFormProps {
  initialData?: ILocation | null;
  onSubmit: (data: LocationFormValues) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function LocationForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: LocationFormProps) {
  const [activeTab, setActiveTab] = React.useState("basic");
  const isEditMode = !!initialData;

  // Default values for the form
  const defaultValues: Partial<LocationFormValues> = {
    name: "",
    type: "warehouse",
    status: "active",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    latitude: 0,
    longitude: 0,
    capacity: 0,
    currentStock: 0,
    manager: "",
    phone: "",
    email: "",
    operatingHours: {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
    notes: "",
  };

  // Create form instance
  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: initialData || defaultValues,
  });

  // Handle map click to update coordinates
  const handleMapClick = (lat: number, lng: number) => {
    form.setValue("latitude", lat, { shouldValidate: true });
    form.setValue("longitude", lng, { shouldValidate: true });
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="grid gap-6 md:grid-cols-2"
    >
      <Card>
        <CardHeader>
          <CardTitle>Location Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="hours">Hours</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <Input
                id="name"
                label="Name"
                placeholder="Enter location name"
                error={form.formState.errors.name?.message}
                {...form.register("name")}
              />

              <div className="grid grid-cols-2 gap-4">
                <Selector
                  label="Type"
                  value={form.watch("type")}
                  onChange={(value) => form.setValue("type", value as any)}
                  error={form.formState.errors.type?.message}
                  options={[
                    { label: "Warehouse", value: "warehouse" },
                    { label: "Store", value: "store" },
                    {
                      label: "Distribution Center",
                      value: "distribution-center",
                    },
                  ]}
                  placeholder="Select location type"
                />

                <Selector
                  label="Status"
                  value={form.watch("status")}
                  onChange={(value) => form.setValue("status", value as any)}
                  error={form.formState.errors.status?.message}
                  options={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                    { label: "Maintenance", value: "maintenance" },
                  ]}
                  placeholder="Select status"
                />
              </div>

              <Textarea
                id="notes"
                label="Notes"
                placeholder="Enter any additional notes"
                rows={3}
                error={form.formState.errors.notes?.message}
                {...form.register("notes")}
              />
            </TabsContent>

            <TabsContent value="address" className="space-y-4">
              <Input
                id="address"
                label="Address"
                placeholder="Enter address"
                error={form.formState.errors.address?.message}
                {...form.register("address")}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="city"
                  label="City"
                  placeholder="Enter city"
                  error={form.formState.errors.city?.message}
                  {...form.register("city")}
                />

                <Input
                  id="state"
                  label="State"
                  placeholder="Enter state"
                  error={form.formState.errors.state?.message}
                  {...form.register("state")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="country"
                  label="Country"
                  placeholder="Enter country"
                  error={form.formState.errors.country?.message}
                  {...form.register("country")}
                />

                <Input
                  id="postalCode"
                  label="Postal Code"
                  placeholder="Enter postal code"
                  error={form.formState.errors.postalCode?.message}
                  {...form.register("postalCode")}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="latitude"
                  label="Latitude"
                  type="number"
                  step="any"
                  placeholder="Enter latitude"
                  error={form.formState.errors.latitude?.message}
                  value={form.watch("latitude")}
                  onChange={(e) =>
                    form.setValue("latitude", parseFloat(e.target.value) || 0)
                  }
                />

                <Input
                  id="longitude"
                  label="Longitude"
                  type="number"
                  step="any"
                  placeholder="Enter longitude"
                  error={form.formState.errors.longitude?.message}
                  value={form.watch("longitude")}
                  onChange={(e) =>
                    form.setValue("longitude", parseFloat(e.target.value) || 0)
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="capacity"
                  label="Capacity"
                  type="number"
                  placeholder="Enter capacity"
                  error={form.formState.errors.capacity?.message}
                  value={form.watch("capacity")}
                  onChange={(e) =>
                    form.setValue("capacity", parseInt(e.target.value) || 0)
                  }
                />

                <Input
                  id="currentStock"
                  label="Current Stock"
                  type="number"
                  placeholder="Enter current stock"
                  error={form.formState.errors.currentStock?.message}
                  value={form.watch("currentStock")}
                  onChange={(e) =>
                    form.setValue("currentStock", parseInt(e.target.value) || 0)
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Input
                id="manager"
                label="Manager"
                placeholder="Enter manager name"
                error={form.formState.errors.manager?.message}
                {...form.register("manager")}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="phone"
                  label="Phone"
                  placeholder="Enter phone number"
                  error={form.formState.errors.phone?.message}
                  {...form.register("phone")}
                />

                <Input
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="Enter email"
                  error={form.formState.errors.email?.message}
                  {...form.register("email")}
                />
              </div>
            </TabsContent>

            <TabsContent value="hours" className="space-y-4">
              {Object.keys(form.getValues().operatingHours).map((day) => (
                <div key={day} className="flex items-center space-x-4">
                  <label
                    htmlFor={`hours-${day}`}
                    className="w-24 text-sm capitalize"
                  >
                    {day}
                  </label>
                  <Input
                    id={`hours-${day}`}
                    placeholder="e.g. 9:00 AM - 5:00 PM or Closed"
                    error={form.formState.errors.operatingHours?.[day]?.message}
                    {...form.register(`operatingHours.${day}` as any)}
                  />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Location Map</CardTitle>
            <p className="text-sm text-muted-foreground">
              Click on the map or drag the marker to set the location
              coordinates
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <LocationPickerMap
                onMapClick={handleMapClick}
                isPicker={true}
                currentPosition={
                  form.getValues().latitude && form.getValues().longitude
                    ? {
                        lat: form.getValues().latitude,
                        lng: form.getValues().longitude,
                      }
                    : null
                }
                locationType={form.getValues().type}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-2 flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading
            ? "Saving..."
            : isEditMode
            ? "Update Location"
            : "Create Location"}
        </Button>
      </div>
    </form>
  );
}
