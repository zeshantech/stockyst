"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Page } from "@/components/(private)/dashboard/page";
import { WarehouseForm } from "@/components/(private)/dashboard/warehousing/warehouse-form";
import { useCreateWarehouse } from "@/hooks/use-warehousing";
import { WarehouseFormValues } from "@/types/warehouse";

export default function AddWarehousePage() {
  const router = useRouter();
  const { mutate: createWarehouse, isPending } = useCreateWarehouse();

  const handleSubmit = (data: WarehouseFormValues) => {
    // Convert string values to numbers for capacity and utilization
    const formattedData = {
      ...data,
      capacity: Number(data.capacity),
      utilization: Number(data.utilization),
    };

    createWarehouse(formattedData, {
      onSuccess: () => {
        router.push("/h/warehousing");
      },
    });
  };

  return (
    <Page>
      {/* Header Section */}
      <PageHeader
        title="Add Warehouse"
        description="Create a new warehouse facility"
        action={
          <Button
            variant="outline"
            onClick={() => router.push("/h/warehousing")}
          >
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Warehouses
          </Button>
        }
      />

      {/* Form */}
      <div className="mx-auto max-w-4xl">
        <WarehouseForm onSubmit={handleSubmit} isSubmitting={isPending} />
      </div>
    </Page>
  );
}
