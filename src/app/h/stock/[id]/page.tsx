"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  IconArrowLeft,
  IconCheck,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { IStock } from "@/types/stock";
import { useStockActions } from "@/hooks/use-stock-actions";

// Sample data - replace with actual data fetching
const sampleStock: IStock = {
  id: "1",
  productId: "1",
  productName: "Laptop Pro X1",
  sku: "LP-X1-2024",
  location: "Warehouse A",
  quantity: 45,
  reorderPoint: 10,
  unitCost: 899.99,
  totalValue: 40499.55,
  status: "in-stock",
  lastRestocked: "2024-03-15",
  createdAt: "2024-01-01",
  updatedAt: "2024-03-15",
  notes: "High-demand item",
};

const formSchema = z.object({
  quantity: z.string().min(1, {
    message: "Quantity is required.",
  }),
  location: z.string().min(1, {
    message: "Location is required.",
  }),
  notes: z.string().optional(),
});

export default function StockDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [stock, setStock] = React.useState<IStock>(sampleStock);
  const { deleteStock, updateStockQuantity, updateStockLocation } =
    useStockActions();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantity: stock.quantity.toString(),
      location: stock.location,
      notes: stock.notes,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Update stock quantity
    updateStockQuantity.mutate(
      {
        id: stock.id,
        quantity: Number(data.quantity),
        notes: data.notes,
      },
      {
        onSuccess: () => {
          // Update stock location
          updateStockLocation.mutate(
            {
              id: stock.id,
              location: data.location,
            },
            {
              onSuccess: () => {
                toast.success("Stock updated successfully");
                setIsSubmitting(false);
                setIsEditing(false);
              },
            }
          );
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <IconArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Stock Details</h1>
          <p className="text-muted-foreground">
            View and manage stock information
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          {isEditing ? (
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Edit Stock</h2>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-6 space-y-4"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Quantity
                  </label>
                  <Input type="number" {...form.register("quantity")} />
                  {form.formState.errors.quantity && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.quantity.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Location
                  </label>
                  <Input {...form.register("location")} />
                  {form.formState.errors.location && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.location.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Notes
                  </label>
                  <Textarea {...form.register("notes")} />
                  <p className="text-sm text-muted-foreground">
                    Add any additional notes about this stock item
                  </p>
                  {form.formState.errors.notes && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.notes.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Saving..."
                    ) : (
                      <>
                        <IconCheck className="mr-2 size-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Stock Information</h2>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <IconEdit className="mr-2 size-4" />
                  Edit Stock
                </Button>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Product Name</p>
                  <p className="font-medium">{stock.productName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SKU</p>
                  <p className="font-medium">{stock.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{stock.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{stock.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reorder Point</p>
                  <p className="font-medium">{stock.reorderPoint}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={
                      stock.status === "in-stock"
                        ? "success"
                        : stock.status === "low-stock"
                        ? "warning"
                        : "error"
                    }
                  >
                    {stock.status.charAt(0).toUpperCase() +
                      stock.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unit Cost</p>
                  <p className="font-medium">${stock.unitCost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="font-medium">${stock.totalValue.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Last Restocked
                  </p>
                  <p className="font-medium">
                    {new Date(stock.lastRestocked).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {new Date(stock.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Updated At</p>
                  <p className="font-medium">
                    {new Date(stock.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                {stock.notes && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="font-medium">{stock.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Status</CardTitle>
              <CardDescription>
                Current status of the stock item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Badge
                variant={
                  stock.status === "in-stock"
                    ? "success"
                    : stock.status === "low-stock"
                    ? "warning"
                    : "error"
                }
              >
                {stock.status.charAt(0).toUpperCase() + stock.status.slice(1)}
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                {stock.status === "in-stock"
                  ? "This item is in stock and available"
                  : stock.status === "low-stock"
                  ? "This item is running low and needs attention"
                  : "This item is out of stock and needs to be restocked"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory Value</CardTitle>
              <CardDescription>Current value of the stock item</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                ${stock.totalValue.toFixed(2)}
              </div>
              <p className="text-sm text-muted-foreground">
                Total value of {stock.quantity} units
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reorder Point</CardTitle>
              <CardDescription>
                Stock level that triggers reordering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stock.reorderPoint}</div>
              <p className="text-sm text-muted-foreground">
                {stock.quantity <= stock.reorderPoint
                  ? "Stock is below reorder point"
                  : "Stock is above reorder point"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
