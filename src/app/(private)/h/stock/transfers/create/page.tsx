"use client";

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/(private)/dashboard/page";
import { useStocks } from "@/hooks/use-stock";
import { toast } from "sonner";
import { Trash, Plus, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Selector } from "@/components/ui/selector";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
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

export default function CreateStockTransferPage() {
  const router = useRouter();

  const {
    stocks,
    locations,
    isLoadingStock,
    isLoadingLocations,
    createStockTransfer,
    isCreatingStockTransfer,
  } = useStocks();

  const defaultValues: Partial<StockTransferFormValues> = {
    sourceLocationId: "",
    destinationLocationId: "",
    notes: "",
    items: [{ stockId: "", quantity: 1, notes: "" }],
  };

  const form = useForm<StockTransferFormValues>({
    resolver: zodResolver(stockTransferSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = (data: StockTransferFormValues) => {
    createStockTransfer(data);
    toast.success("Stock transfer created successfully");
    router.push("/h/stock/transfers");
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
  const isLoading = isCreatingStockTransfer;

  const locationOptions = locations.map((location) => ({
    label: location.name,
    value: location.id,
  }));

  const stockOptions = stocks.map((stock) => ({
    label: `${stock.productName} (${stock.sku})`,
    value: stock.id,
  }));

  return (
    <Page>
      <PageHeader
        backButton
        title="Create Stock Transfer"
        description="Create a new stock transfer between locations"
        action={
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? "Creating..." : "Create Transfer"}
          </Button>
        }
      />

      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Selector
            label="Source Location"
            options={locationOptions}
            value={form.watch("sourceLocationId")}
            onChange={(value) =>
              form.setValue("sourceLocationId", value, {
                shouldValidate: true,
              })
            }
            placeholder="Select source location"
            error={form.formState.errors.sourceLocationId?.message}
            disabled={isLoading || isLoadingLocations}
            required
          />

          <Selector
            label="Destination Location"
            options={locationOptions}
            value={form.watch("destinationLocationId")}
            onChange={(value) =>
              form.setValue("destinationLocationId", value, {
                shouldValidate: true,
              })
            }
            placeholder="Select destination location"
            error={form.formState.errors.destinationLocationId?.message}
            disabled={isLoading || isLoadingLocations}
            required
          />
        </div>

        <Textarea
          label="Notes"
          placeholder="Enter any additional notes here"
          rows={3}
          {...form.register("notes")}
          error={form.formState.errors.notes?.message}
          disabled={isLoading}
        />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-lg font-semibold">Items</Label>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddItem}
              disabled={isLoading}
            >
              <Plus />
              Add Item
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex items-end gap-2">
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
                className="flex-1"
              />
              <Input
                label="Quantity"
                type="number"
                min="1"
                {...form.register(`items.${index}.quantity`)}
                error={form.formState.errors.items?.[index]?.quantity?.message}
                disabled={isLoading}
                required
                container={{ className: "flex-1" }}
              />
              <Input
                label="Notes"
                type="text"
                placeholder="Optional"
                {...form.register(`items.${index}.notes`)}
                disabled={isLoading}
                container={{ className: "flex-1" }}
              />

              <Button
                variant="ghost"
                size="icon"
                color="error"
                onClick={() => handleRemoveItem(index)}
                disabled={isLoading || fields.length <= 1}
              >
                <Trash />
              </Button>
            </div>
          ))}

          {form.formState.errors.items &&
            "root" in form.formState.errors.items && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.items.root?.message}
              </p>
            )}
        </div>
      </form>
    </Page>
  );
}
