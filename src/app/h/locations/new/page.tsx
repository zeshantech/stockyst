"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { LocationMap } from "@/components/(private)/locations/location-map";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(1, "Location name is required"),
  type: z.enum(["warehouse", "store", "distribution-center"]),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  latitude: z.number(),
  longitude: z.number(),
  capacity: z.number().min(0, "Capacity must be a positive number"),
  manager: z.string().min(1, "Manager name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewLocationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: FormValues) => {
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
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);
  };

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data);
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

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-6 md:grid-cols-2"
      >
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              {...form.register("name")}
              label="Name"
              placeholder="Enter location name"
              error={form.formState.errors.name?.message}
              info="The name of your location that will be displayed throughout the system"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select
                value={form.watch("type")}
                onValueChange={(value: FormValues["type"]) =>
                  form.setValue("type", value)
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

            <Input
              {...form.register("address")}
              label="Address"
              placeholder="Enter address"
              error={form.formState.errors.address?.message}
              info="Street address of the location"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                {...form.register("city")}
                label="City"
                placeholder="Enter city"
                error={form.formState.errors.city?.message}
              />
              <Input
                {...form.register("state")}
                label="State"
                placeholder="Enter state"
                error={form.formState.errors.state?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                {...form.register("country")}
                label="Country"
                placeholder="Enter country"
                error={form.formState.errors.country?.message}
              />
              <Input
                {...form.register("postalCode")}
                label="Postal Code"
                placeholder="Enter postal code"
                error={form.formState.errors.postalCode?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                {...form.register("latitude", { valueAsNumber: true })}
                type="number"
                step="any"
                label="Latitude"
                placeholder="Enter latitude"
                error={form.formState.errors.latitude?.message}
                info="Click on the map to set coordinates"
              />
              <Input
                {...form.register("longitude", { valueAsNumber: true })}
                type="number"
                step="any"
                label="Longitude"
                placeholder="Enter longitude"
                error={form.formState.errors.longitude?.message}
                info="Click on the map to set coordinates"
              />
            </div>

            <Input
              {...form.register("capacity", { valueAsNumber: true })}
              type="number"
              label="Capacity"
              placeholder="Enter capacity"
              error={form.formState.errors.capacity?.message}
              info="Maximum storage capacity of the location"
            />

            <Input
              {...form.register("manager")}
              label="Manager"
              placeholder="Enter manager name"
              error={form.formState.errors.manager?.message}
              info="Name of the person managing this location"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                {...form.register("phone")}
                label="Phone"
                placeholder="Enter phone number"
                error={form.formState.errors.phone?.message}
                info="Contact number for this location"
              />
              <Input
                {...form.register("email")}
                type="email"
                label="Email"
                placeholder="Enter email"
                error={form.formState.errors.email?.message}
                info="Contact email for this location"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden">
              <LocationMap
                locations={[]}
                selectedLocation={null}
                onMapClick={handleMapClick}
                isSelecting={true}
                currentPosition={
                  form.watch("latitude") && form.watch("longitude")
                    ? {
                        lat: form.watch("latitude"),
                        lng: form.watch("longitude"),
                      }
                    : null
                }
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Click on the map to select the location coordinates
            </p>
          </CardContent>
        </Card>

        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create Location"}
          </Button>
        </div>
      </form>
    </div>
  );
}
