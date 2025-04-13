"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Page } from "@/components/(private)/dashboard/page";
import { Loader } from "@/components/ui/loader";
import { Button } from "@/components/ui/button";
import {
  IconPlus,
  IconLayoutGrid,
  IconChevronDown,
  IconListDetails,
  IconEdit,
  IconSearch,
  IconFilter,
  IconX,
} from "@tabler/icons-react";
import { IProduct, IVariant } from "@/types/product";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts, findVariantGroups } from "@/hooks/use-products";
import { SearchInput } from "@/components/ui/search-input";
import { Selector } from "@/components/ui/selector";

export default function ProductVariantsPage() {
  const router = useRouter();
  const {
    variants = [],
    products = [],
    isLoadingVariants,
    isLoadingProducts,
  } = useProducts();
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [search, setSearch] = React.useState("");
  const [stockFilter, setStockFilter] = React.useState("all");
  const [priceFilter, setPriceFilter] = React.useState("all");

  // Find product variants using the function from hooks
  const variantGroups = React.useMemo(() => {
    return findVariantGroups(variants, products);
  }, [variants, products]);

  // Filter variant groups based on search and filters
  const filteredVariantGroups = React.useMemo(() => {
    if (!search && stockFilter === "all" && priceFilter === "all") {
      return variantGroups;
    }

    return (
      variantGroups
        .map((group) => {
          // Filter the products within each group
          const filteredProducts = group.variants.filter((product) => {
            // Search filter (check name and SKU)
            const matchesSearch =
              search === "" ||
              product.name.toLowerCase().includes(search.toLowerCase()) ||
              product.sku.toLowerCase().includes(search.toLowerCase());

            // Stock filter
            let matchesStock = true;
            if (stockFilter === "inStock") matchesStock = product.quantity > 0;
            else if (stockFilter === "outOfStock")
              matchesStock = product.quantity <= 0;
            else if (stockFilter === "lowStock")
              matchesStock = product.quantity > 0 && product.quantity <= 10;

            // Price filter
            let matchesPrice = true;
            if (priceFilter === "under50") matchesPrice = product.price < 50;
            else if (priceFilter === "50to100")
              matchesPrice = product.price >= 50 && product.price <= 100;
            else if (priceFilter === "over100")
              matchesPrice = product.price > 100;

            return matchesSearch && matchesStock && matchesPrice;
          });

          // Return the group with filtered products
          return {
            ...group,
            products: filteredProducts,
          };
        })
        // Remove groups with no products after filtering
        .filter((group) => group.variants.length > 0)
    );
  }, [variantGroups, search, stockFilter, priceFilter]);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setStockFilter("all");
    setPriceFilter("all");
  };

  const isLoading = isLoadingVariants || isLoadingProducts;

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
        title="Product Variants"
        description="Manage product variations like size, color, and style"
        backButtonHref="/h/products"
        action={
          <Button onClick={() => router.push("/h/products/add?type=variant")}>
            <IconPlus />
            Add Variant
          </Button>
        }
      />

      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          <SearchInput
            className="flex-1"
            placeholder="Search variants by name or SKU..."
            value={search}
            onClear={() => setSearch("")}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="flex gap-2">
            <Selector
              value={stockFilter}
              onChange={setStockFilter}
              options={[
                { label: "All Stock", value: "all" },
                { label: "In Stock", value: "inStock" },
                { label: "Out of Stock", value: "outOfStock" },
                { label: "Low Stock", value: "lowStock" },
              ]}
              placeholder="Stock Status"
              className="w-[160px]"
            />
            <Selector
              value={priceFilter}
              onChange={setPriceFilter}
              options={[
                { label: "All Prices", value: "all" },
                { label: "Under $50", value: "under50" },
                { label: "$50 - $100", value: "50to100" },
                { label: "Over $100", value: "over100" },
              ]}
              placeholder="Price Range"
              className="w-[160px]"
            />
            {(search || stockFilter !== "all" || priceFilter !== "all") && (
              <Button variant="outline" onClick={clearFilters}>
                <IconX />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="text-sm text-muted-foreground">
          {filteredVariantGroups.length} variant groups found with{" "}
          {filteredVariantGroups.reduce(
            (acc, group) => acc + group.variants.length,
            0
          )}{" "}
          total variants
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <IconLayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <IconListDetails className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {variantGroups.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold">
            No Product Variants Found
          </h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Create product variants to offer different options like size, color,
            or style. Products with similar names will be grouped as variants.
          </p>
          <Button onClick={() => router.push("/h/products/add?type=variant")}>
            <IconPlus />
            Create Products with Variants
          </Button>
        </div>
      ) : filteredVariantGroups.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <IconFilter className="mb-2 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-semibold">
            No Matching Variants Found
          </h3>
          <p className="mb-6 text-sm text-muted-foreground">
            No variants match your current search criteria. Try adjusting your
            filters.
          </p>
          <Button variant="outline" onClick={clearFilters}>
            <IconX className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          {viewMode === "grid" ? (
            <div className="space-y-6">
              {filteredVariantGroups.map((group, index) => (
                <Card key={index}>
                  <CardHeader className="pb-3">
                    <CardTitle>{group.name}</CardTitle>
                    <CardDescription>
                      {group.variants.length} variants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {group.variants.map((product) => (
                        <div key={product.id} className="rounded-md border p-3">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {product.name
                                  .replace(group.name, "")
                                  .trim()
                                  .replace(/^[- ]+/, "")}
                              </span>
                              <Badge
                                variant={
                                  product.quantity > 0 ? "success" : "error"
                                }
                              >
                                {product.quantity > 0
                                  ? "In Stock"
                                  : "Out of Stock"}
                              </Badge>
                            </div>
                            <div className="text-muted-foreground text-sm">
                              SKU: {product.sku}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <span className="font-bold">
                                ${product.price.toFixed(2)}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  router.push(`/h/products/${product.id}`)
                                }
                              >
                                <IconEdit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVariantGroups.map((group, index) => (
                <Accordion type="single" collapsible key={index}>
                  <AccordionItem value={`group-${index}`}>
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full pr-4">
                        <div>{group.name}</div>
                        <Badge>{group.variants.length} variants</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Card>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Variant</TableHead>
                              <TableHead>SKU</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Stock</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead className="text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {group.variants.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>
                                  {product.name
                                    .replace(group.name, "")
                                    .trim()
                                    .replace(/^[- ]+/, "") || product.name}
                                </TableCell>
                                <TableCell>{product.sku}</TableCell>
                                <TableCell>
                                  ${product.price.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      product.quantity > 20
                                        ? "success"
                                        : product.quantity > 0
                                        ? "warning"
                                        : "error"
                                    }
                                  >
                                    {product.quantity}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      product.status === "active"
                                        ? "success"
                                        : product.status === "inactive"
                                        ? "warning"
                                        : "error"
                                    }
                                  >
                                    {product.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      router.push(`/h/products/${product.id}`)
                                    }
                                  >
                                    <IconEdit className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          )}
        </>
      )}
    </Page>
  );
}
