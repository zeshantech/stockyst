"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Page } from "@/components/(private)/dashboard/page";
import { useProducts } from "@/hooks/use-products";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import {
  IconPlus,
  IconPackage,
  IconPackageOff,
  IconSettings,
  IconSearch,
  IconFilter,
  IconX,
} from "@tabler/icons-react";
import { IProduct, IBundle } from "@/types/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/components/ui/search-input";
import { Selector } from "@/components/ui/selector";

const getBundledProductDetails = (
  bundleProduct: IBundle,
  allProducts: IProduct[]
) => {
  if (
    !bundleProduct.bundledProducts ||
    bundleProduct.bundledProducts.length === 0
  ) {
    return [];
  }

  return bundleProduct.bundledProducts
    .map((id) => {
      const product = allProducts.find((p) => p.id === id);
      if (!product) return null;
      return {
        id: product.id,
        name: product.name,
        sku: product.sku,
        price: product.price,
        image: product.image || "/placeholder-product.png",
        quantity: bundleProduct.bundledProductQuantities[id] || 1,
      };
    })
    .filter(Boolean);
};

export default function ProductBundlesPage() {
  const router = useRouter();
  const {
    bundles = [],
    isLoadingBundles,
    products,
    isLoadingProducts,
  } = useProducts();
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [priceFilter, setPriceFilter] = React.useState("all");

  const isLoading = isLoadingBundles || isLoadingProducts;

  // Filter bundles based on search and filters
  const filteredBundles = React.useMemo(() => {
    return bundles.filter((bundle) => {
      // Search filter
      const matchesSearch =
        search === "" ||
        bundle.name.toLowerCase().includes(search.toLowerCase()) ||
        bundle.sku.toLowerCase().includes(search.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "all" || bundle.status === statusFilter;

      // Price filter
      let matchesPrice = true;
      if (priceFilter === "under50") matchesPrice = bundle.price < 50;
      else if (priceFilter === "50to100")
        matchesPrice = bundle.price >= 50 && bundle.price <= 100;
      else if (priceFilter === "over100") matchesPrice = bundle.price > 100;

      return matchesSearch && matchesStatus && matchesPrice;
    });
  }, [bundles, search, statusFilter, priceFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriceFilter("all");
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <Page>
      <PageHeader
        title="Product Bundles"
        description="Manage your product bundles and kits"
        backButtonHref="/h/products"
        action={
          <Button onClick={() => router.push("/h/products/add?type=bundle")}>
            <IconPlus />
            Add Bundle
          </Button>
        }
      />

      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <SearchInput
            placeholder="Search bundles by name or SKU..."
            className="flex-1"
            onClear={() => setSearch("")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2">
            <Selector
              options={[
                { value: "all", label: "All Statuses" },
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "discontinued", label: "Discontinued" },
              ]}
              value={statusFilter}
              onChange={setStatusFilter}
              placeholder="Status"
            />
            <Selector
              options={[
                { value: "all", label: "All Prices" },
                { value: "under50", label: "Under $50" },
                { value: "50to100", label: "$50 - $100" },
                { value: "over100", label: "Over $100" },
              ]}
              value={priceFilter}
              onChange={setPriceFilter}
              placeholder="Price Range"
            />
            {(search || statusFilter !== "all" || priceFilter !== "all") && (
              <Button variant="outline" onClick={clearFilters}>
                <IconX className="mr-2 h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bundles Grid */}
      {bundles.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <IconPackageOff className="mb-2 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">
            No Product Bundles Found
          </h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Create product bundles to sell multiple items together at a special
            price. Add the "bundle" tag to products to mark them as bundles.
          </p>
          <Button onClick={() => router.push("/h/products/add?type=bundle")}>
            <IconPlus />
            Add Bundle
          </Button>
        </div>
      ) : filteredBundles.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <IconFilter className="mb-2 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">
            No Matching Bundles Found
          </h3>
          <p className="mb-6 text-sm text-muted-foreground">
            No bundles match your current search criteria. Try adjusting your
            filters.
          </p>
          <Button variant="outline" onClick={clearFilters}>
            <IconX className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBundles.map((bundle) => {
            // Get bundled product details
            const bundledItems = getBundledProductDetails(bundle, products);

            return (
              <Card key={bundle.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{bundle.name}</CardTitle>
                      <CardDescription>SKU: {bundle.sku}</CardDescription>
                    </div>
                    <Badge
                      variant={
                        bundle.status === "active" ? "success" : "warning"
                      }
                    >
                      {bundle.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Bundle Price</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">
                          ${bundle.price.toFixed(2)}
                        </span>
                        {/* Calculate actual discount based on bundled items */}
                        <Badge variant="outline" className="text-success">
                          Save 15%
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 font-medium">Includes</h4>
                      <div className="rounded-md border">
                        {/* Display actual bundled products */}
                        {bundledItems.length > 0 ? (
                          bundledItems.map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="p-3 border-b flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <div className="h-12 w-12 rounded-md overflow-hidden flex items-center justify-center bg-muted">
                                  {item.image ? (
                                    <Image
                                      src={item.image}
                                      alt={item.name}
                                      width={48}
                                      height={48}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <IconPackage className="h-6 w-6 text-muted-foreground" />
                                  )}
                                </div>
                                <div>{item.name}</div>
                              </div>
                              <Badge variant="secondary">
                                x{item.quantity}
                              </Badge>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 text-muted-foreground text-center">
                            No products defined in this bundle
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium">Inventory</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Available Bundles:
                        </span>
                        <Badge
                          variant={
                            bundle.quantity > 10
                              ? "success"
                              : bundle.quantity > 0
                              ? "warning"
                              : "error"
                          }
                        >
                          {bundle.quantity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() =>
                      router.push(`/h/products/bundles/${bundle.id}`)
                    }
                  >
                    View Details
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() =>
                      router.push(`/h/products/bundles/${bundle.id}?edit=true`)
                    }
                  >
                    <IconSettings />
                    Configure Bundle
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </Page>
  );
}
