"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LocationForm,
  LocationFormValues,
} from "@/components/(private)/dashboard/locations/location-form";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateLocationParams } from "@/types/location";

export default function NewLocationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const createMutation = useMutation({
    mutationFn: async (data: CreateLocationParams) => {
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
      setIsSubmitting(false);
    },
  });

  const handleSubmit = (data: LocationFormValues) => {
    setIsSubmitting(true);
    createMutation.mutate(data as CreateLocationParams);
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

      <LocationForm
        onSubmit={handleSubmit}
        onCancel={() => router.push("/h/locations")}
        isLoading={isSubmitting}
      />
    </div>
  );
}
