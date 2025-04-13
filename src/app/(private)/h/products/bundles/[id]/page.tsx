"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Page } from "@/components/(private)/dashboard/page";
import {
  useBundle,
  useProducts,
  useProductsByBundleId,
} from "@/hooks/use-products";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import {
  IconPackage,
  IconEdit,
  IconTrash,
  IconArrowLeft,
} from "@tabler/icons-react";
import { BundleFormValues } from "@/types/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BundleForm } from "@/components/(private)/dashboard/products/bundle-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useMemo, useState } from "react";

export default function BundleDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { data: bundle, isLoading: isBundleLoading } = useBundle(params.id);
  const { data: products, isLoading: isProductLoading } = useProductsByBundleId(
    params.id
  );
  const { updateBundle, isUpdatingBundle, deleteBundle, isDeletingBundle } =
    useProducts();

  const isLoading = isProductLoading || isBundleLoading;

  const bundledItems = useMemo(() => {
    if (!bundle || !products?.length) {
      return [];
    }

    return products
      .map((product) => {
        return {
          id: product.id,
          name: product.name,
          sku: product.sku,
          price: product.price,
          image: product.image || "/placeholder-product.png",
          quantity: bundle.bundledProductQuantities[product.id] || 1,
        };
      })
      .filter(Boolean);
  }, [bundle, products]);

  // Calculate total value of individual products
  const totalIndividualValue = useMemo(() => {
    return bundledItems.reduce((total: number, item) => {
      return total + (item?.price || 0) * (item?.quantity || 1);
    }, 0);
  }, [bundledItems]);

  // Calculate discount percentage
  const discountPercentage = useMemo(() => {
    if (!bundle || totalIndividualValue === 0) return 0;
    const discount = totalIndividualValue - bundle.price;
    return Math.round((discount / totalIndividualValue) * 100);
  }, [bundle, totalIndividualValue]);

  const handleSubmit = (data: BundleFormValues) => {
    if (!bundle) return;

    // Convert string values to appropriate types for API
    updateBundle({
      id: bundle.id,
      name: data.name,
      sku: data.sku,
      description: data.description,
      categoryId: data.categoryId,
      price: parseFloat(data.price),
      cost: parseFloat(data.cost),
      quantity: parseInt(data.quantity),
      reorderPoint: parseInt(data.reorderPoint),
      supplierId: data.supplierId,
      location: data.location,
      status: data.status || bundle.status,
      tags: data.tags || bundle.tags,
      specifications: data.specifications || bundle.specifications,
      bundledProducts: data.bundledProducts,
      bundledProductQuantities: data.bundledProductQuantities,
    });

    // Exit edit mode after successful update
    router.push(`/h/products/bundles/${params.id}`);
  };

  const handleDelete = () => {
    if (!bundle) return;
    deleteBundle({ id: bundle.id });
    router.push("/h/products/bundles");
  };

  const handleCancel = () => {
    router.push(`/h/products/bundles/${params.id}`);
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (!bundle) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Bundle Not Found</h1>
        <p className="text-muted-foreground mt-2">
          The Bundle you're looking for doesn't exist. If its unexpected report
          to <Link href={"/h/help"}>Support</Link>
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => router.push("/h/products/bundles")}
        >
          <IconArrowLeft />
          Back to Bundles
        </Button>
      </div>
    );
  }

  if (isEditMode) {
    // Show edit form
    return (
      <div className="flex flex-col gap-6 p-6">
        <PageHeader
          title="Edit Bundle"
          description="Modify the bundle details and contents"
          backButtonHref={`/h/products/bundles/${params.id}`}
        />

        <div className="rounded-lg border p-6">
          <BundleForm
            initialValues={{
              name: bundle.name,
              sku: bundle.sku,
              description: bundle.description,
              categoryId: bundle.categoryId,
              price: bundle.price.toString(),
              cost: bundle.cost.toString(),
              quantity: bundle.quantity.toString(),
              reorderPoint: bundle.reorderPoint.toString(),
              supplierId: bundle.supplierId,
              location: bundle.location,
              status: bundle.status,
              tags: bundle.tags,
              specifications: bundle.specifications,
              bundledProducts: bundle.bundledProducts,
              bundledProductQuantities: bundle.bundledProductQuantities,
              image: bundle.image,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isUpdatingBundle}
            submitButtonText="Update Bundle"
          />
        </div>
      </div>
    );
  }

  // Show bundle details
  return (
    <Page>
      <PageHeader
        title="Bundle Details"
        description="View and manage this product bundle"
        backButtonHref="/h/products/bundles"
        action={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeletingBundle}
            >
              <IconTrash />
              Delete
            </Button>
            <Button
              onClick={() =>
                router.push(`/h/products/bundles/${params.id}?edit=true`)
              }
            >
              <IconEdit />
              Edit Bundle
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Main details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{bundle.name}</CardTitle>
            <CardDescription>SKU: {bundle.sku}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-base font-medium mb-2">Description</h3>
              <p className="text-muted-foreground">{bundle.description}</p>
            </div>

            <div>
              <h3 className="text-base font-medium mb-2">Bundle Contents</h3>
              {bundledItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bundledItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-md overflow-hidden flex items-center justify-center bg-muted">
                              {item!.image ? (
                                <img
                                  src={item!.image}
                                  alt={item!.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <IconPackage className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <span>{item!.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item!.sku}</TableCell>
                        <TableCell>${item!.price.toFixed(2)}</TableCell>
                        <TableCell>{item!.quantity}</TableCell>
                        <TableCell>
                          ${(item!.price * item!.quantity).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={4} className="font-medium text-right">
                        Total Individual Value:
                      </TableCell>
                      <TableCell className="font-bold">
                        ${totalIndividualValue.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} className="font-medium text-right">
                        Bundle Price:
                      </TableCell>
                      <TableCell className="font-bold">
                        ${bundle.price.toFixed(2)}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={4} className="font-medium text-right">
                        Customer Savings:
                      </TableCell>
                      <TableCell className="font-bold text-green-600">
                        {discountPercentage}% ($
                        {(totalIndividualValue - bundle.price).toFixed(2)})
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 border rounded-md text-muted-foreground">
                  No products defined in this bundle
                </div>
              )}
            </div>
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
                <span className="font-bold">${bundle.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cost:</span>
                <span>${bundle.cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit:</span>
                <span className="text-green-600">
                  ${(bundle.price - bundle.cost).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">In Stock:</span>
                <Badge variant={bundle.quantity > 0 ? "success" : "error"}>
                  {bundle.quantity}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reorder Point:</span>
                <span>{bundle.reorderPoint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  variant={bundle.status === "active" ? "success" : "warning"}
                >
                  {bundle.status}
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
                <span>{bundle.categoryId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Supplier:</span>
                <span>{bundle.supplierId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span>{bundle.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Restocked:</span>
                <span>
                  {new Date(bundle.lastRestocked).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Tags:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {bundle.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the bundle "{bundle.name}". This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingBundle}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              loading={isDeletingBundle}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <IconTrash />
              Delete Bundle
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}
