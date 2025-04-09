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
import { Selector } from "@/components/ui/selector";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { IProduct } from "@/types/product";
import { useProductActions } from "@/hooks/use-product-actions";

// Sample product data - replace with actual data fetching
const sampleProduct: IProduct = {
  id: "1",
  name: "Sample Product",
  sku: "SP-001",
  description: "This is a sample product description.",
  price: 99.99,
  cost: 49.99,
  quantity: 100,
  reorderPoint: 20,
  category: "Electronics",
  supplier: "Sample Supplier",
  location: "Warehouse A",
  status: "active",
  lastRestocked: "2024-03-15",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
  tags: ["electronics", "gadgets"],
  specifications: {
    Color: "Black",
    Weight: "500g",
    Dimensions: "10x5x2 cm",
  },
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  sku: z.string().min(1, {
    message: "SKU is required.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.string().min(1, {
    message: "Price is required.",
  }),
  cost: z.string().min(1, {
    message: "Cost is required.",
  }),
  quantity: z.string().min(1, {
    message: "Quantity is required.",
  }),
  category: z.string().min(1, {
    message: "Category is required.",
  }),
  supplier: z.string().min(1, {
    message: "Supplier is required.",
  }),
  status: z.enum(["active", "inactive", "discontinued"], {
    required_error: "Please select a status.",
  }),
});

export default function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [product, setProduct] = React.useState<IProduct>(sampleProduct);
  const { deleteProduct, updateProductStatus } = useProductActions();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      sku: product.sku,
      description: product.description,
      price: product.price.toString(),
      cost: product.cost.toString(),
      quantity: product.quantity.toString(),
      category: product.category,
      supplier: product.supplier,
      status: product.status,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProduct({
        ...product,
        ...values,
        price: parseFloat(values.price),
        cost: parseFloat(values.cost),
        quantity: parseInt(values.quantity),
        updatedAt: new Date().toISOString(),
      });
      setIsEditing(false);
      toast.success("Product updated successfully");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProduct.mutateAsync({ id: product.id });
      toast.success("Product deleted successfully");
      router.push("/h/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

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
          <h1 className="text-3xl font-bold">Product Details</h1>
          <p className="text-muted-foreground">
            View and manage product information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          {isEditing ? (
            <div className="rounded-lg border p-6">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <Input
                  {...form.register("name")}
                  label="Product Name"
                  error={form.formState.errors.name?.message}
                />

                <Input
                  {...form.register("sku")}
                  label="SKU"
                  error={form.formState.errors.sku?.message}
                />

                <Textarea
                  {...form.register("description")}
                  label="Description"
                  className="min-h-[100px]"
                  info="Provide a clear description of the product"
                  error={form.formState.errors.description?.message}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    {...form.register("price")}
                    type="number"
                    step="0.01"
                    label="Price"
                    error={form.formState.errors.price?.message}
                  />

                  <Input
                    {...form.register("cost")}
                    type="number"
                    step="0.01"
                    label="Cost"
                    error={form.formState.errors.cost?.message}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    {...form.register("quantity")}
                    type="number"
                    label="Quantity"
                    error={form.formState.errors.quantity?.message}
                  />

                  <Selector
                    label="Status"
                    value={form.watch("status")}
                    onChange={(value) => form.setValue("status", value)}
                    options={[
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                      { value: "discontinued", label: "Discontinued" },
                    ]}
                    info="Active products are available for sale"
                    error={form.formState.errors.status?.message}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    {...form.register("category")}
                    label="Category"
                    error={form.formState.errors.category?.message}
                  />

                  <Input
                    {...form.register("supplier")}
                    label="Supplier"
                    error={form.formState.errors.supplier?.message}
                  />
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
                <h2 className="text-xl font-semibold">Product Information</h2>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <IconEdit className="mr-2 size-4" />
                  Edit Product
                </Button>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{product.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SKU</p>
                  <p className="font-medium">{product.sku}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{product.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">${product.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cost</p>
                  <p className="font-medium">${product.cost.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{product.quantity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant="outline"
                    className={
                      product.status === "active"
                        ? "bg-green-100 text-green-800"
                        : product.status === "inactive"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {product.status.charAt(0).toUpperCase() +
                      product.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Supplier</p>
                  <p className="font-medium">{product.supplier}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Updated At</p>
                  <p className="font-medium">
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
              <CardDescription>Current status of the product</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge
                variant="outline"
                className={
                  product.status === "active"
                    ? "bg-green-100 text-green-800"
                    : product.status === "inactive"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {product.status.charAt(0).toUpperCase() +
                  product.status.slice(1)}
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                {product.status === "active"
                  ? "This product is active and available for sale"
                  : product.status === "inactive"
                  ? "This product is inactive and not available for sale"
                  : "This product is discontinued"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
              <CardDescription>Current stock information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{product.quantity}</div>
              <p className="text-sm text-muted-foreground">Units in stock</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Product pricing details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="text-xl font-semibold">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cost</p>
                  <p className="text-xl font-semibold">
                    ${product.cost.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Margin</p>
                  <p className="text-xl font-semibold">
                    ${(product.price - product.cost).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
              >
                <IconTrash className="mr-2 size-4" />
                Delete Product
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
