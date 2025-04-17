"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { DialogComponent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IStockLevel } from "@/types/stock";
import { toast } from "sonner";

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
          <div className="space-y-2">
            <label htmlFor="productId" className="text-sm font-medium">
              Product
            </label>
            <select
              id="productId"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...form.register("productId")}
            >
              <option value="">Select a product</option>
              <option value="product-1">Laptop Pro X1</option>
              <option value="product-2">Office Chair Ergo</option>
              <option value="product-3">Wireless Mouse</option>
            </select>
            {form.formState.errors.productId && (
              <p className="text-sm text-error">
                {form.formState.errors.productId.message}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="minLevel" className="text-sm font-medium">
              Min Level
            </label>
            <Input
              id="minLevel"
              type="number"
              min="0"
              {...form.register("minLevel")}
            />
            {form.formState.errors.minLevel && (
              <p className="text-sm text-error">
                {form.formState.errors.minLevel.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="maxLevel" className="text-sm font-medium">
              Max Level
            </label>
            <Input
              id="maxLevel"
              type="number"
              min="0"
              {...form.register("maxLevel")}
            />
            {form.formState.errors.maxLevel && (
              <p className="text-sm text-error">
                {form.formState.errors.maxLevel.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="reorderPoint" className="text-sm font-medium">
              Reorder Point
            </label>
            <Input
              id="reorderPoint"
              type="number"
              min="0"
              {...form.register("reorderPoint")}
            />
            {form.formState.errors.reorderPoint && (
              <p className="text-sm text-error">
                {form.formState.errors.reorderPoint.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="safetyStock" className="text-sm font-medium">
              Safety Stock
            </label>
            <Input
              id="safetyStock"
              type="number"
              min="0"
              {...form.register("safetyStock")}
            />
            {form.formState.errors.safetyStock && (
              <p className="text-sm text-error">
                {form.formState.errors.safetyStock.message}
              </p>
            )}
          </div>

          <div className="space-y-2 col-span-2">
            <label
              htmlFor="preferredStockLevel"
              className="text-sm font-medium"
            >
              Preferred Stock Level
            </label>
            <Input
              id="preferredStockLevel"
              type="number"
              min="0"
              {...form.register("preferredStockLevel")}
            />
            {form.formState.errors.preferredStockLevel && (
              <p className="text-sm text-error">
                {form.formState.errors.preferredStockLevel.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Notes
          </label>
          <textarea
            id="notes"
            className="flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Add any notes about this stock level"
            {...form.register("notes")}
          ></textarea>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit">{isEditing ? "Update" : "Create"}</Button>
        </div>
      </form>
    </DialogComponent>
  );
}
