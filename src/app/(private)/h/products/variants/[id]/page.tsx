"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { VariantFormValues } from "@/types/product";
import {
  useVarient as useVariant,
  useProducts,
  useProduct,
  useDeleteProduct,
  useUpdateProductStatus,
} from "@/hooks/use-products";
import { VariantForm } from "@/components/(private)/dashboard/products/variant-form";
import { Loader } from "@/components/ui/loader";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { Page } from "@/components/(private)/dashboard/page";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import Link from "next/link";

export default function VariantDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  // Get the variant and its parent product if it has one
  const { data: variant, isLoading: isLoadingVariant } = useVariant(params.id);
  const { data: parentProduct, isLoading: isLoadingParent } = useProduct(
    variant?.parentProduct || ""
  );

  // Get products context for mutation functions
  const { updateVariant, isUpdatingVariant } = useProducts();
  const { mutate: deleteProduct, isPending: isDeletingProduct } =
    useDeleteProduct();
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateProductStatus();

  const isLoading =
    isLoadingVariant || (variant?.parentProduct && isLoadingParent);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!variant) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Variant Not Found</h1>
        <p className="text-muted-foreground mt-2">
          The variant you're looking for doesn't exist. If this is unexpected,
          report to <Link href="/h/help">Support</Link>
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => router.push("/h/products/variants")}
        >
          <IconArrowLeft />
          Back to Variants
        </Button>
      </div>
    );
  }

  const handleSubmit = (values: VariantFormValues) => {
    updateVariant({
      id: variant.id,
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
      status: values.status || variant.status,
      tags: values.tags || variant.tags,
      specifications: values.specifications || variant.specifications,
      parentProduct: values.parentProduct || variant.parentProduct,
      variantAttributes: values.variantAttributes || variant.variantAttributes,
      image: values.image,
    });

    router.push(`/h/products/variants/${params.id}`);
  };

  const handleDelete = async () => {
    deleteProduct({ id: variant.id });
    router.push("/h/products/variants");
  };

  const handleStatusChange = (
    status: "active" | "inactive" | "discontinued"
  ) => {
    updateStatus({ id: variant.id, status });
  };

  const getStatusBadge = () => {
    switch (variant.status) {
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

  // Initial values for the edit form
  const initialValues: VariantFormValues = {
    name: variant.name,
    sku: variant.sku,
    description: variant.description,
    categoryId: variant.categoryId,
    price: variant.price.toString(),
    cost: variant.cost.toString(),
    quantity: variant.quantity.toString(),
    reorderPoint: variant.reorderPoint.toString(),
    supplierId: variant.supplierId,
    location: variant.location,
    status: variant.status,
    tags: variant.tags,
    specifications: variant.specifications,
    parentProduct: variant.parentProduct,
    variantAttributes: variant.variantAttributes,
    image: variant.image,
  };

  if (isEditMode) {
    // Show edit form
    return (
      <div className="flex flex-col gap-6 p-6">
        <PageHeader
          title="Edit Variant"
          description="Modify the variant details and attributes"
          backButton
        />

        <div className="rounded-lg border p-6">
          <VariantForm
            initialValues={initialValues}
            onSubmit={handleSubmit}
            onCancel={() => router.push(`/h/products/variants/${params.id}`)}
            isSubmitting={isUpdatingVariant}
            submitButtonText="Update Variant"
          />
        </div>
      </div>
    );
  }

  // Show variant details
  return (
    <Page>
      <PageHeader
        title="Variant Details"
        description="View and manage this product variant"
        backButton
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeletingProduct}
            >
              <IconTrash />
              Delete
            </Button>
            <Button
              onClick={() =>
                router.push(`/h/products/variants/${params.id}?edit=true`)
              }
            >
              <IconEdit />
              Edit Variant
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{variant.name}</CardTitle>
            <CardDescription>SKU: {variant.sku}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-base font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{variant.description}</p>
            </div>

            {/* Parent Product */}
            {parentProduct && (
              <div>
                <h3 className="text-base font-medium mb-2">Parent Product</h3>
                <Link href={`/h/products/${parentProduct.id}`}>
                  <div className="flex items-center gap-2 p-3 border rounded-md hover:bg-accent">
                    <div className="h-12 w-12 rounded-md overflow-hidden flex items-center justify-center bg-muted">
                      {parentProduct.image ? (
                        <img
                          src={parentProduct.image}
                          alt={parentProduct.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-muted flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            No image
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{parentProduct.name}</p>
                      <p className="text-sm text-muted-foreground">
                        SKU: {parentProduct.sku}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Variant Attributes */}
            <div>
              <h3 className="text-base font-medium mb-2">Variant Attributes</h3>
              {Object.keys(variant.variantAttributes).length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(variant.variantAttributes).map(
                    ([key, value]) => (
                      <div key={key} className="border rounded-md p-3">
                        <div className="text-sm text-muted-foreground">
                          {key}
                        </div>
                        <div className="font-medium">{value}</div>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No variant attributes defined
                </p>
              )}
            </div>

            {/* Specifications */}
            {Object.keys(variant.specifications).length > 0 && (
              <div>
                <h3 className="text-base font-medium mb-2">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(variant.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="border rounded-md p-3">
                        <div className="text-sm text-muted-foreground">
                          {key}
                        </div>
                        <div className="font-medium">{value}</div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar with stats and metadata */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-bold">${variant.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cost:</span>
                <span>${variant.cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit:</span>
                <span className="text-green-600">
                  ${(variant.price - variant.cost).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">In Stock:</span>
                <Badge variant={variant.quantity > 0 ? "success" : "error"}>
                  {variant.quantity}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reorder Point:</span>
                <span>{variant.reorderPoint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  variant={variant.status === "active" ? "success" : "warning"}
                >
                  {variant.status}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span>{variant.categoryId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Supplier:</span>
                <span>{variant.supplierId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span>{variant.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Restocked:</span>
                <span>
                  {new Date(variant.lastRestocked).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {variant.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Product Status</CardTitle>
              <CardDescription>Manage variant availability</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Button
                  variant={variant.status === "active" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => handleStatusChange("active")}
                  disabled={isUpdatingStatus || variant.status === "active"}
                >
                  <Badge variant="success" className="mr-2">
                    Active
                  </Badge>
                  <span>Variant is available for sale</span>
                </Button>

                <Button
                  variant={
                    variant.status === "inactive" ? "default" : "outline"
                  }
                  className="justify-start"
                  onClick={() => handleStatusChange("inactive")}
                  disabled={isUpdatingStatus || variant.status === "inactive"}
                >
                  <Badge variant="warning" className="mr-2">
                    Inactive
                  </Badge>
                  <span>Temporarily unavailable</span>
                </Button>

                <Button
                  variant={
                    variant.status === "discontinued" ? "default" : "outline"
                  }
                  className="justify-start"
                  onClick={() => handleStatusChange("discontinued")}
                  disabled={
                    isUpdatingStatus || variant.status === "discontinued"
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

      {/* Product Image */}
      {variant.image && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Product Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md overflow-hidden">
              <img
                src={variant.image}
                alt={variant.name}
                className="w-full h-auto object-cover"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialogComponent
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Are you sure?"
        description={`This will permanently delete the variant "${variant.name}". This action cannot be undone.`}
        cancelButton="Cancel"
        confirmButton={
          <>
            <IconTrash />
            Delete Variant
          </>
        }
      />
    </Page>
  );
}
