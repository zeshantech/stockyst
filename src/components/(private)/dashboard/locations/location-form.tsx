"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ILocation } from "@/types/location";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/selector";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const locationFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  type: z.enum(["warehouse", "store", "distribution-center"]),
  status: z.enum(["active", "inactive", "maintenance"]),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  country: z.string().min(2, {
    message: "Country must be at least 2 characters.",
  }),
  postalCode: z.string().min(3, {
    message: "Postal code must be at least 3 characters.",
  }),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  capacity: z.number().min(0),
  currentStock: z.number().min(0),
  manager: z.string().min(2, {
    message: "Manager name must be at least 2 characters.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  operatingHours: z.object({
    monday: z.string(),
    tuesday: z.string(),
    wednesday: z.string(),
    thursday: z.string(),
    friday: z.string(),
    saturday: z.string(),
    sunday: z.string(),
  }),
});

type LocationFormValues = z.infer<typeof locationFormSchema>;

interface LocationFormProps {
  location?: ILocation;
  mode: "create" | "edit";
}

// Mock API functions - Replace with actual API calls
const mockCreateLocation = async (data: LocationFormValues) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true, id: "new-id" };
};

const mockUpdateLocation = async ({
  id,
  data,
}: {
  id: string;
  data: LocationFormValues;
}) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true };
};

export function LocationForm({ location, mode }: LocationFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const defaultValues: Partial<LocationFormValues> = {
    name: location?.name ?? "",
    type: location?.type ?? "warehouse",
    status: location?.status ?? "active",
    address: location?.address ?? "",
    city: location?.city ?? "",
    state: location?.state ?? "",
    country: location?.country ?? "",
    postalCode: location?.postalCode ?? "",
    latitude: location?.latitude ?? 0,
    longitude: location?.longitude ?? 0,
    capacity: location?.capacity ?? 0,
    currentStock: location?.currentStock ?? 0,
    manager: location?.manager ?? "",
    phone: location?.phone ?? "",
    email: location?.email ?? "",
    operatingHours: location?.operatingHours ?? {
      monday: "9:00 AM - 5:00 PM",
      tuesday: "9:00 AM - 5:00 PM",
      wednesday: "9:00 AM - 5:00 PM",
      thursday: "9:00 AM - 5:00 PM",
      friday: "9:00 AM - 5:00 PM",
      saturday: "Closed",
      sunday: "Closed",
    },
  };

  const form = useForm<LocationFormValues>({
    resolver: zodResolver(locationFormSchema),
    defaultValues,
  });

  // Update form values when location changes (from map selection)
  React.useEffect(() => {
    if (location) {
      form.setValue("latitude", location.latitude);
      form.setValue("longitude", location.longitude);
    }
  }, [location, form]);

  const createMutation = useMutation({
    mutationFn: mockCreateLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      toast.success("Location created successfully");
      router.push("/h/locations");
    },
    onError: () => {
      toast.error("Failed to create location");
    },
  });

  const updateMutation = useMutation({
    mutationFn: mockUpdateLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
      queryClient.invalidateQueries({ queryKey: ["location", location?.id] });
      toast.success("Location updated successfully");
      router.push("/h/locations");
    },
    onError: () => {
      toast.error("Failed to update location");
    },
  });

  function onSubmit(data: LocationFormValues) {
    if (mode === "create") {
      createMutation.mutate(data);
    } else if (mode === "edit" && location) {
      updateMutation.mutate({ id: location.id, data });
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Input
            label="Name"
            placeholder="Enter location name"
            error={form.formState.errors.name?.message}
            {...form.register("name")}
          />
        </div>

        <div>
          <Selector
            label="Type"
            placeholder="Select location type"
            error={form.formState.errors.type?.message}
            value={form.watch("type")}
            onChange={(value) => form.setValue("type", value)}
            options={[
              { value: "warehouse", label: "Warehouse" },
              { value: "store", label: "Store" },
              { value: "distribution-center", label: "Distribution Center" },
            ]}
          />
        </div>

        <div>
          <Selector
            label="Status"
            placeholder="Select status"
            error={form.formState.errors.status?.message}
            value={form.watch("status")}
            onChange={(value) => form.setValue("status", value)}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "maintenance", label: "Maintenance" },
            ]}
          />
        </div>

        <div>
          <Input
            label="Address"
            placeholder="Enter address"
            error={form.formState.errors.address?.message}
            {...form.register("address")}
          />
        </div>

        <div>
          <Input
            label="City"
            placeholder="Enter city"
            error={form.formState.errors.city?.message}
            {...form.register("city")}
          />
        </div>

        <div>
          <Input
            label="State"
            placeholder="Enter state"
            error={form.formState.errors.state?.message}
            {...form.register("state")}
          />
        </div>

        <div>
          <Input
            label="Country"
            placeholder="Enter country"
            error={form.formState.errors.country?.message}
            {...form.register("country")}
          />
        </div>

        <div>
          <Input
            label="Postal Code"
            placeholder="Enter postal code"
            error={form.formState.errors.postalCode?.message}
            {...form.register("postalCode")}
          />
        </div>

        <div>
          <Input
            label="Latitude"
            type="number"
            step="any"
            placeholder="Enter latitude"
            error={form.formState.errors.latitude?.message}
            {...form.register("latitude", {
              valueAsNumber: true,
            })}
          />
        </div>

        <div>
          <Input
            label="Longitude"
            type="number"
            step="any"
            placeholder="Enter longitude"
            error={form.formState.errors.longitude?.message}
            {...form.register("longitude", {
              valueAsNumber: true,
            })}
          />
        </div>

        <div>
          <Input
            label="Capacity"
            type="number"
            placeholder="Enter capacity"
            error={form.formState.errors.capacity?.message}
            {...form.register("capacity", {
              valueAsNumber: true,
            })}
          />
        </div>

        <div>
          <Input
            label="Current Stock"
            type="number"
            placeholder="Enter current stock"
            error={form.formState.errors.currentStock?.message}
            {...form.register("currentStock", {
              valueAsNumber: true,
            })}
          />
        </div>

        <div>
          <Input
            label="Manager"
            placeholder="Enter manager name"
            error={form.formState.errors.manager?.message}
            {...form.register("manager")}
          />
        </div>

        <div>
          <Input
            label="Phone"
            placeholder="Enter phone number"
            error={form.formState.errors.phone?.message}
            {...form.register("phone")}
          />
        </div>

        <div>
          <Input
            label="Email"
            placeholder="Enter email"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Operating Hours</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(form.getValues("operatingHours")).map(
            ([day, hours]) => (
              <div key={day}>
                <Input
                  label={day.charAt(0).toUpperCase() + day.slice(1)}
                  placeholder="Enter operating hours"
                  error={form.formState.errors.operatingHours?.[day]?.message}
                  {...form.register(`operatingHours.${day}`)}
                />
              </div>
            )
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          {mode === "create" ? "Create Location" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
