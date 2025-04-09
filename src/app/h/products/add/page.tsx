"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/selector";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Form validation schema
const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  sku: z.string().min(3, {
    message: "SKU must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  category: z.string({
    required_error: "Please select a category.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number.",
  }),
  cost: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Cost must be a positive number.",
  }),
  quantity: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Quantity must be a non-negative number.",
    }),
  reorderPoint: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Reorder point must be a non-negative number.",
    }),
  supplier: z.string().min(2, {
    message: "Supplier name must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const defaultValues: Partial<ProductFormValues> = {
  name: "",
  sku: "",
  description: "",
  category: "",
  price: "",
  cost: "",
  quantity: "0",
  reorderPoint: "10",
  supplier: "",
  location: "",
};

const categories = [
  { value: "Electronics", label: "Electronics" },
  { value: "Office Supplies", label: "Office Supplies" },
  { value: "Furniture", label: "Furniture" },
  { value: "Clothing", label: "Clothing" },
  { value: "Food", label: "Food" },
];

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  function onSubmit(data: ProductFormValues) {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log(data);
      toast.success("Product added successfully!");
      setIsSubmitting(false);
      router.push("/h/products");
    }, 1000);
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/h/products")}
        >
          <IconArrowLeft />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground">
            Create a new product in your inventory
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              {...form.register("name")}
              label="Product Name"
              placeholder="Enter product name"
              error={form.formState.errors.name?.message}
              required
            />

            <Input
              {...form.register("sku")}
              label="SKU"
              placeholder="Enter SKU"
              error={form.formState.errors.sku?.message}
              required
            />

            <Selector
              label="Category"
              value={form.watch("category")}
              onChange={(value) => form.setValue("category", value)}
              options={categories}
              placeholder="Select a category"
              error={form.formState.errors.category?.message}
              required
            />

            <Input
              {...form.register("supplier")}
              label="Supplier"
              placeholder="Enter supplier name"
              error={form.formState.errors.supplier?.message}
              required
            />

            <Input
              {...form.register("price")}
              type="number"
              label="Price"
              placeholder="0.00"
              step="0.01"
              min="0"
              error={form.formState.errors.price?.message}
              required
            />

            <Input
              {...form.register("cost")}
              type="number"
              label="Cost"
              placeholder="0.00"
              step="0.01"
              min="0"
              error={form.formState.errors.cost?.message}
              required
            />

            <Input
              {...form.register("quantity")}
              type="number"
              label="Quantity"
              placeholder="0"
              min="0"
              error={form.formState.errors.quantity?.message}
              required
            />

            <Input
              {...form.register("reorderPoint")}
              type="number"
              label="Reorder Point"
              placeholder="10"
              min="0"
              info="The quantity at which to reorder this product"
              error={form.formState.errors.reorderPoint?.message}
              required
            />

            <Input
              {...form.register("location")}
              label="Location"
              placeholder="Enter storage location"
              error={form.formState.errors.location?.message}
              required
            />
          </div>

          <Textarea
            {...form.register("description")}
            label="Description"
            placeholder="Enter product description"
            className="min-h-[100px]"
            error={form.formState.errors.description?.message}
            required
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/h/products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Saving...</>
              ) : (
                <>
                  <IconCheck className="mr-2 size-4" />
                  Save Product
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
