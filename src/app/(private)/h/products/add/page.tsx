"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { ProductForm } from "@/components/(private)/dashboard/products/product-form";
import {
  ProductFormValues,
  BundleFormValues,
  VariantFormValues,
} from "@/types/product";
import { useCreateProduct } from "@/hooks/use-products";
import { VariantForm } from "@/components/(private)/dashboard/products/variant-form";
import { BundleForm } from "@/components/(private)/dashboard/products/bundle-form";

export default function AddProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const { mutate: createProduct, isPending: isSubmitting } = useCreateProduct();

  // Set page title and description based on product type

  const handleSubmit = (
    data: ProductFormValues | BundleFormValues | VariantFormValues
  ) => {
    // Add appropriate tags based on product type
    const tags = data.tags || [];

    if (type === "variant") {
      if (!tags.includes("variant")) {
        tags.push("variant");
      }
    } else if (type === "bundle") {
      if (!tags.includes("bundle")) {
        tags.push("bundle");
      }
    }

    // Convert string values to appropriate types for API
    createProduct({
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
      status: data.status || "active",
      tags: tags,
      specifications: data.specifications || {},
      lastRestocked: new Date(),
      image: data.image,
    });

    // Redirect to appropriate page based on product type
    if (type === "variant") {
      router.push("/h/products/variants");
    } else if (type === "bundle") {
      router.push("/h/products/bundles");
    } else {
      router.push("/h/products");
    }
  };

  const handleCancel = () => {
    // Redirect to appropriate page based on product type
    if (type === "variant") {
      router.push("/h/products/variants");
    } else if (type === "bundle") {
      router.push("/h/products/bundles");
    } else {
      router.push("/h/products");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <PageHeader
        title={
          type === "variant"
            ? "Add Product Variant"
            : type === "bundle"
            ? "Create Product Bundle"
            : "Add New Product"
        }
        description={
          type === "variant"
            ? "Create a new variant of an existing product"
            : type === "bundle"
            ? "Create a new bundle of products"
            : "Create a new product in your inventory"
        }
        backButtonHref={
          type === "variant"
            ? "/h/products/variants"
            : type === "bundle"
            ? "/h/products/bundles"
            : "/h/products"
        }
      />

      <div className="rounded-lg border p-6">
        {type === "variant" ? (
          <VariantForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            submitButtonText="Create Variant"
          />
        ) : type === "bundle" ? (
          <BundleForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            submitButtonText="Create Bundle"
          />
        ) : (
          <ProductForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            submitButtonText="Create Product"
          />
        )}
      </div>
    </div>
  );
}
