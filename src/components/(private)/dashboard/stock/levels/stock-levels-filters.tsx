"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStocks } from "@/hooks/use-stock";
import { SearchInput } from "@/components/ui/search-input";
import { FilterIcon, ChevronDownIcon } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function StockLevelsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get values from URL search params or use defaults
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all"
  );
  const [locationFilter, setLocationFilter] = useState(
    searchParams.get("location") || "all"
  );
  const [stockLevelFilter, setStockLevelFilter] = useState(
    searchParams.get("level") || "all"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "name-asc");
  const [showFilters, setShowFilters] = useState(false);

  // Get locations from the stock hook
  const { locations, isLoadingLocations } = useStocks();

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }

    if (statusFilter && statusFilter !== "all") {
      params.set("status", statusFilter);
    } else {
      params.delete("status");
    }

    if (locationFilter && locationFilter !== "all") {
      params.set("location", locationFilter);
    } else {
      params.delete("location");
    }

    if (stockLevelFilter && stockLevelFilter !== "all") {
      params.set("level", stockLevelFilter);
    } else {
      params.delete("level");
    }

    if (sortBy && sortBy !== "name-asc") {
      params.set("sort", sortBy);
    } else {
      params.delete("sort");
    }

    // Only update the URL if the filters have changed
    const newSearch = params.toString();
    const currentSearch = searchParams.toString();
    if (newSearch !== currentSearch) {
      router.push(`${pathname}?${newSearch}`);
    }
  }, [
    searchTerm,
    statusFilter,
    locationFilter,
    stockLevelFilter,
    sortBy,
    router,
    pathname,
    searchParams,
  ]);

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setLocationFilter("all");
    setStockLevelFilter("all");
    setSortBy("name-asc");
    router.push(pathname);
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex-1 min-w-[240px] max-w-md">
          <SearchInput
            placeholder="Search by product name, SKU..."
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm}
          />
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1"
        >
          <FilterIcon className="h-4 w-4" />
          Filters
          <ChevronDownIcon
            className={`h-4 w-4 transition-transform ${
              showFilters ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md">
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Select
              onValueChange={(value) => setLocationFilter(value)}
              value={locationFilter}
            >
              <SelectTrigger
                id="location"
                className={isLoadingLocations ? "opacity-50" : ""}
              >
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select
              onValueChange={(value) => setStatusFilter(value)}
              value={statusFilter}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="low-stock">Low Stock</SelectItem>
                <SelectItem value="out-of-stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="stockLevel" className="text-sm font-medium">
              Stock Level
            </label>
            <Select
              onValueChange={(value) => setStockLevelFilter(value)}
              value={stockLevelFilter}
            >
              <SelectTrigger id="stockLevel">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="under-min">Under Minimum</SelectItem>
                <SelectItem value="optimal">Optimal</SelectItem>
                <SelectItem value="over-max">Over Maximum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="sort" className="text-sm font-medium">
              Sort By
            </label>
            <Select onValueChange={(value) => setSortBy(value)} value={sortBy}>
              <SelectTrigger id="sort">
                <SelectValue placeholder="Product Name (A-Z)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Product Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Product Name (Z-A)</SelectItem>
                <SelectItem value="quantity-asc">
                  Quantity (Low to High)
                </SelectItem>
                <SelectItem value="quantity-desc">
                  Quantity (High to Low)
                </SelectItem>
                <SelectItem value="min-stock-asc">
                  Min Stock (Low to High)
                </SelectItem>
                <SelectItem value="min-stock-desc">
                  Min Stock (High to Low)
                </SelectItem>
                <SelectItem value="max-stock-asc">
                  Max Stock (Low to High)
                </SelectItem>
                <SelectItem value="max-stock-desc">
                  Max Stock (High to Low)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1 md:col-span-3 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button size="sm">Apply Filters</Button>
          </div>
        </div>
      )}
    </div>
  );
}
