"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/(private)/dashboard/products/products-table";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Page } from "@/components/(private)/dashboard/page";
import { ProductsStats } from "@/components/(private)/dashboard/products/products-stats";
import { useAllProducts } from "@/hooks/use-products";
import { Loader } from "@/components/ui/loader";

export default function ProductsPage() {
  const router = useRouter();
  const { data: products, isLoading } = useAllProducts();

  return (
    <Page>
      {/* Header Section */}
      <PageHeader
        title="Products"
        description="Manage your inventory products"
        action={
          <Button href="/h/products/add">
            <IconPlus />
            Add Product
          </Button>
        }
      />

      {/* Statistics Cards */}
      <ProductsStats />

      {/* Products Table */}
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader size="lg" />
        </div>
      ) : (
        <ProductsTable data={products} />
      )}
    </Page>
  );
}
