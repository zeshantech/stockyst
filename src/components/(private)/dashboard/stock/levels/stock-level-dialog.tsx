"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DialogComponent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IStockLevel } from "@/types/stock";
import { toast } from "sonner";
import { ProductSelector } from "../../product-selector";

// Define form schema with zod
const stockLevelSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  minLevel: z.coerce.number().min(0, "Min level must be 0 or greater"),
  maxLevel: z.coerce.number().min(0, "Max level must be 0 or greater"),
  reorderPoint: z.coerce.number().min(0, "Reorder point must be 0 or greater"),
  safetyStock: z.coerce.number().min(0, "Safety stock must be 0 or greater"),
  preferredStockLevel: z.coerce
    .number()
    .min(0, "Preferred level must be 0 or greater"),
  notes: z.string().optional(),
});

type StockLevelFormValues = z.infer<typeof stockLevelSchema>;

interface StockLevelDialogProps {
  trigger: React.ReactNode;
  stockLevel?: IStockLevel;
}

export function StockLevelDialog({
  trigger,
  stockLevel,
}: StockLevelDialogProps) {
  const isEditing = !!stockLevel;

  const defaultValues: Partial<StockLevelFormValues> = isEditing
    ? {
        productId: stockLevel.productId,
        minLevel: stockLevel.minLevel,
        maxLevel: stockLevel.maxLevel,
        reorderPoint: stockLevel.reorderPoint,
        safetyStock: stockLevel.safetyStock,
        preferredStockLevel: stockLevel.preferredStockLevel,
        notes: stockLevel.notes || "",
      }
    : {
        minLevel: 0,
        maxLevel: 0,
        reorderPoint: 0,
        safetyStock: 0,
        preferredStockLevel: 0,
        notes: "",
      };

  const form = useForm<StockLevelFormValues>({
    resolver: zodResolver(stockLevelSchema),
    defaultValues,
  });

  const onSubmit = (data: StockLevelFormValues) => {
    // In a real app, this would call an API through a hook
    console.log("Form data submitted:", data);

    if (isEditing) {
      toast.success(`Stock level updated for ${stockLevel.productName}`);
    } else {
      toast.success("Stock level created successfully");
    }
  };

  return (
    <DialogComponent
      trigger={trigger}
      title={isEditing ? "Edit Stock Level" : "Add Stock Level"}
      description={
        isEditing
          ? `Update stock level settings for ${stockLevel.productName}`
          : "Configure stock level settings for a product"
      }
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!isEditing && (
          <ProductSelector
            selectedProductIds={[form.watch("productId")]}
            onSelect={(ids) => {
              if (ids.length > 0) {
                form.setValue("productId", ids[0], { shouldValidate: true });
              } else {
                form.setValue("productId", "", { shouldValidate: true });
              }
            }}
            placeholder="Select a product"
            error={form.formState.errors.productId?.message}
            // required
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Min Level"
            id="minLevel"
            type="number"
            min="0"
            {...form.register("minLevel")}
            error={form.formState.errors.minLevel?.message}
            required
          />

          <Input
            label="Max Level"
            id="maxLevel"
            type="number"
            min="0"
            {...form.register("maxLevel")}
            error={form.formState.errors.maxLevel?.message}
            required
          />

          <Input
            label="Reorder Point"
            id="reorderPoint"
            type="number"
            min="0"
            {...form.register("reorderPoint")}
            error={form.formState.errors.reorderPoint?.message}
            required
          />

          <Input
            label="Safety Stock"
            id="safetyStock"
            type="number"
            min="0"
            {...form.register("safetyStock")}
            error={form.formState.errors.safetyStock?.message}
            required
          />

          <Input
            label="Preferred Stock Level"
            id="preferredStockLevel"
            type="number"
            min="0"
            {...form.register("preferredStockLevel")}
            error={form.formState.errors.preferredStockLevel?.message}
            required
            container={{ className: "col-span-2" }}
          />
        </div>

        <Textarea
          label="Notes"
          id="notes"
          placeholder="Add any notes about this stock level"
          {...form.register("notes")}
          error={form.formState.errors.notes?.message}
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
        </div>
      </form>
    </DialogComponent>
  );
}
