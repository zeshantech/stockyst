"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/(private)/dashboard/page";
import { useStocks } from "@/hooks/use-stock";
import { toast } from "sonner";
import { Trash, Plus, ArrowLeft } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { IStockTransfer } from "@/types/stock";
import { ProductSelector } from "@/components/(private)/dashboard/product-selector";

// Define form schema with zod
const stockTransferSchema = z.object({
  sourceLocationId: z.string().min(1, "Source location is required"),
  destinationLocationId: z.string().min(1, "Destination location is required"),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        stockId: z.string().min(1, "Stock item is required"),
        quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
        notes: z.string().optional(),
      })
    )
    .min(1, "At least one item is required"),
});

type StockTransferFormValues = z.infer<typeof stockTransferSchema>;

export default function EditStockTransferPage() {
  const router = useRouter();
  const params = useParams();
  const transferId = params.id as string;
  const [transfer, setTransfer] = useState<IStockTransfer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    stocks,
    locations,
    isLoadingStock,
    isLoadingLocations,
    updateStockTransfer,
    isUpdatingStockTransfer,
  } = useStocks();

  // Mock function to get transfer by ID (in a real app, this would come from the hooks)
  useEffect(() => {
    // This would be replaced with a real API call
    const mockGetTransferById = async (id: string) => {
      // Mock data for demonstration
      const mockTransfer: IStockTransfer = {
        id: id,
        transferNumber: `TR-${id.padStart(3, "0")}`,
        status: "in-progress",
        sourceLocationId: "1",
        sourceLocationName: "Warehouse A",
        destinationLocationId: "2",
        destinationLocationName: "Warehouse B",
        requestedBy: "John Doe",
        requestedDate: new Date().toISOString(),
        notes: "Sample transfer notes",
        items: [
          {
            id: "1",
            transferId: id,
            stockId: "1",
            productName: "Laptop Pro X1",
            sku: "LP-X1-2023",
            quantity: 5,
            notes: "Item note",
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return mockTransfer;
    };

    const loadTransfer = async () => {
      try {
        const data = await mockGetTransferById(transferId);
        setTransfer(data);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load transfer");
        router.push("/h/stock/transfers");
      }
    };

    loadTransfer();
  }, [transferId, router]);

  const form = useForm<StockTransferFormValues>({
    resolver: zodResolver(stockTransferSchema),
    defaultValues: {
      sourceLocationId: "",
      destinationLocationId: "",
      notes: "",
      items: [{ stockId: "", quantity: 1, notes: "" }],
    },
  });

  // Update form when transfer data loads
  useEffect(() => {
    if (transfer) {
      form.reset({
        sourceLocationId: transfer.sourceLocationId,
        destinationLocationId: transfer.destinationLocationId,
        notes: transfer.notes || "",
        items: transfer.items.map((item) => ({
          stockId: item.stockId,
          quantity: item.quantity,
          notes: item.notes || "",
        })),
      });
    }
  }, [transfer, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: StockTransferFormValues) => {
    if (transfer) {
      updateStockTransfer({
        id: transfer.id,
        ...data,
      });
      toast.success("Stock transfer updated successfully");
      router.push(`/h/stock/transfers/${transfer.id}`);
    }
  };

  const handleAddItem = () => {
    append({ stockId: "", quantity: 1, notes: "" });
  };

  const handleRemoveItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("At least one item is required");
    }
  };

  const isFormValid = form.formState.isValid;
  const isSubmitting = isUpdatingStockTransfer;

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full inline-block"></div>
            <p className="mt-2">Loading transfer data...</p>
          </div>
        </div>
      </Page>
    );
  }

  return (
    <Page>
      <PageHeader
        title={`Edit Stock Transfer: ${transfer?.transferNumber || ""}`}
        description="Update stock transfer details"
        action={
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push(`/h/stock/transfers/${transferId}`)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Update Transfer"}
            </Button>
          </div>
        }
      />

      <form className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Source Location
              </label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                {...form.register("sourceLocationId")}
                disabled={isSubmitting || isLoadingLocations}
              >
                <option value="">Select source location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.sourceLocationId && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.sourceLocationId.message}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">
                Destination Location
              </label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                {...form.register("destinationLocationId")}
                disabled={isSubmitting || isLoadingLocations}
              >
                <option value="">Select destination location</option>
                {locations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
              {form.formState.errors.destinationLocationId && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.destinationLocationId.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Notes</label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              rows={3}
              placeholder="Enter any additional notes here"
              {...form.register("notes")}
              disabled={isSubmitting}
            />
            {form.formState.errors.notes && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.notes.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium block">Items</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddItem}
                disabled={isSubmitting}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-2 border rounded-md p-3"
              >
                <div className="col-span-5">
                  <label className="text-xs font-medium mb-1 block">
                    Stock Item
                  </label>
                  <ProductSelector
                    selectedProductIds={[form.watch(`items.${index}.stockId`)]}
                    onSelect={(ids) => {
                      if (ids.length > 0) {
                        form.setValue(`items.${index}.stockId`, ids[0], {
                          shouldValidate: true,
                        });
                      } else {
                        form.setValue(`items.${index}.stockId`, "", {
                          shouldValidate: true,
                        });
                      }
                    }}
                    placeholder="Select a product"
                  />
                  {form.formState.errors.items?.[index]?.stockId && (
                    <p className="text-destructive text-xs mt-1">
                      {form.formState.errors.items?.[index]?.stockId?.message}
                    </p>
                  )}
                </div>

                <div className="col-span-3">
                  <label className="text-xs font-medium mb-1 block">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
                    {...form.register(`items.${index}.quantity`)}
                    disabled={isSubmitting}
                  />
                  {form.formState.errors.items?.[index]?.quantity && (
                    <p className="text-destructive text-xs mt-1">
                      {form.formState.errors.items?.[index]?.quantity?.message}
                    </p>
                  )}
                </div>

                <div className="col-span-3">
                  <label className="text-xs font-medium mb-1 block">
                    Notes
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background"
                    placeholder="Optional"
                    {...form.register(`items.${index}.notes`)}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="col-span-1 flex items-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(index)}
                    disabled={isSubmitting || fields.length <= 1}
                    className="p-0 h-8 w-8 rounded-full"
                  >
                    <Trash className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}

            {form.formState.errors.items &&
              "root" in form.formState.errors.items && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.items.root?.message}
                </p>
              )}
          </div>
        </div>
      </form>
    </Page>
  );
}
