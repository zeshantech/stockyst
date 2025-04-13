"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { IconArrowLeft, IconEdit, IconTrash } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { ProductFormValues } from "@/types/product";
import {
  useProduct,
  useUpdateProduct,
  useDeleteProduct,
  useUpdateProductStatus,
} from "@/hooks/use-products";
import { ProductForm } from "@/components/(private)/dashboard/products/product-form";
import { Loader } from "@/components/ui/loader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProductDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const { data: product, isLoading } = useProduct(params.id);
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateProductStatus();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Product Not Found</h1>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => router.push("/h/products")}
        >
          Back to Products
        </Button>
      </div>
    );
  }

  const handleSubmit = (values: ProductFormValues) => {
    updateProduct({
      id: product.id,
      name: values.name,
      sku: values.sku,
      description: values.description,
      categoryId: values.categoryId,
      price: parseFloat(values.price),
      cost: parseFloat(values.cost),
      quantity: parseInt(values.quantity),
      reorderPoint: parseInt(values.reorderPoint),
      supplierId: values.supplierId,
      location: values.location,
      status: values.status || product.status,
      tags: values.tags || product.tags,
      specifications: values.specifications || product.specifications,
      lastRestocked: values.lastRestocked
        ? new Date(values.lastRestocked)
        : product.lastRestocked,
      image: values.image,
    });

    setIsEditing(false);
  };

  const handleDelete = async () => {
    deleteProduct({ id: product.id });
    router.push("/h/products");
  };

  const handleStatusChange = (
    status: "active" | "inactive" | "discontinued"
  ) => {
    updateStatus({ id: product.id, status });
  };

  const getStatusBadge = () => {
    switch (product.status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "inactive":
        return <Badge variant="warning">Inactive</Badge>;
      case "discontinued":
        return <Badge variant="error">Discontinued</Badge>;
      default:
        return null;
    }
  };

  const initialValues: ProductFormValues = {
    name: product.name,
    sku: product.sku,
    description: product.description,
    categoryId: product.categoryId,
    price: product.price.toString(),
    cost: product.cost.toString(),
    quantity: product.quantity.toString(),
    reorderPoint: product.reorderPoint.toString(),
    supplierId: product.supplierId,
    location: product.location,
    status: product.status,
    tags: product.tags,
    specifications: product.specifications,
    lastRestocked: product.lastRestocked
      ? new Date(product.lastRestocked).toISOString().split("T")[0]
      : "",
    image: product.image,
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
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Product Details</h1>
          <p className="text-muted-foreground">
            View and manage product information
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <IconEdit />
                Edit
              </Button>
              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="outline" color="error">
                    <IconTrash />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      the product and remove it from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          {isEditing ? (
            <div className="rounded-lg border p-6">
              <ProductForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
                onCancel={() => setIsEditing(false)}
                isSubmitting={isUpdating}
                submitButtonText="Update Product"
                cancelButtonText="Cancel Editing"
              />
            </div>
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">{product.name}</CardTitle>
                    <CardDescription>SKU: {product.sku}</CardDescription>
                  </div>
                  <div>{getStatusBadge()}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border p-4">
                  <h3 className="text-md font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="text-md font-medium mb-2">Price & Cost</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="text-md font-medium">
                          ${product.price.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cost</p>
                        <p className="text-md font-medium">
                          ${product.cost.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Margin</p>
                        <p className="text-md font-medium">
                          ${(product.price - product.cost).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Margin %
                        </p>
                        <p className="text-md font-medium">
                          {product.cost > 0
                            ? (
                                ((product.price - product.cost) /
                                  product.price) *
                                100
                              ).toFixed(2)
                            : "N/A"}
                          %
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="text-md font-medium mb-2">Inventory</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Quantity
                        </p>
                        <p className="text-md font-medium">
                          {product.quantity}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Reorder Point
                        </p>
                        <p className="text-md font-medium">
                          {product.reorderPoint}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Last Restocked
                        </p>
                        <p className="text-md font-medium">
                          {new Date(product.lastRestocked).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Stock Value
                        </p>
                        <p className="text-md font-medium">
                          ${(product.quantity * product.cost).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="text-md font-medium mb-2">Categories</h3>
                    <div className="grid gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Category
                        </p>
                        <p className="text-md font-medium">
                          {product.categoryId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tags</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {product.tags && product.tags.length > 0 ? (
                            product.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-xs text-muted-foreground">
                              No tags
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h3 className="text-md font-medium mb-2">
                      Supplier & Location
                    </h3>
                    <div className="grid gap-2">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Supplier
                        </p>
                        <p className="text-md font-medium">
                          {product.supplierId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Location
                        </p>
                        <p className="text-md font-medium">
                          {product.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {product.specifications &&
                  Object.keys(product.specifications).length > 0 && (
                    <div className="rounded-lg border p-4">
                      <h3 className="text-md font-medium mb-2">
                        Specifications
                      </h3>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(product.specifications).map(
                          ([key, value]) => (
                            <div key={key}>
                              <p className="text-xs text-muted-foreground">
                                {key}
                              </p>
                              <p className="text-md font-medium">{value}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
              <CardDescription>Manage product availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button
                  variant={product.status === "active" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => handleStatusChange("active")}
                  disabled={isUpdatingStatus || product.status === "active"}
                >
                  <Badge variant="success" className="mr-2">
                    Active
                  </Badge>
                  <span>Product is available for sale</span>
                </Button>

                <Button
                  variant={
                    product.status === "inactive" ? "default" : "outline"
                  }
                  className="justify-start"
                  onClick={() => handleStatusChange("inactive")}
                  disabled={isUpdatingStatus || product.status === "inactive"}
                >
                  <Badge variant="warning" className="mr-2">
                    Inactive
                  </Badge>
                  <span>Temporarily unavailable</span>
                </Button>

                <Button
                  variant={
                    product.status === "discontinued" ? "default" : "outline"
                  }
                  className="justify-start"
                  onClick={() => handleStatusChange("discontinued")}
                  disabled={
                    isUpdatingStatus || product.status === "discontinued"
                  }
                >
                  <Badge variant="error" className="mr-2">
                    Discontinued
                  </Badge>
                  <span>No longer sold</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {product.image && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
