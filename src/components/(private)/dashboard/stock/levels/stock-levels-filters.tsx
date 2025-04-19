"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Selector } from "@/components/ui/selector";
import { useStocks } from "@/hooks/use-stock";
import { SearchInput } from "@/components/ui/search-input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { XIcon } from "lucide-react";

export function StockLevelsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { locations, isLoadingLocations } = useStocks();

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

  const hasFiltersApplied = useMemo(() => {
    return (
      searchTerm !== "" ||
      statusFilter !== "all" ||
      locationFilter !== "all" ||
      stockLevelFilter !== "all" ||
      sortBy !== "name-asc"
    );
  }, [searchTerm, statusFilter, locationFilter, stockLevelFilter, sortBy]);

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
    <div className="flex gap-2 items-center">
      <SearchInput
        placeholder="Search by product name, SKU..."
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      <Selector
        value={locationFilter}
        onChange={setLocationFilter}
        options={[
          { label: "All Locations", value: "all" },
          ...locations.map((location) => ({
            label: location.name,
            value: location.id,
          })),
        ]}
        placeholder="All Locations"
        disabled={isLoadingLocations}
      />
      <Selector
        value={statusFilter}
        onChange={setStatusFilter}
        options={[
          { label: "All Statuses", value: "all" },
          { label: "In Stock", value: "in-stock" },
          { label: "Low Stock", value: "low-stock" },
          { label: "Out of Stock", value: "out-of-stock" },
        ]}
        placeholder="All Statuses"
      />
      <Selector
        value={stockLevelFilter}
        onChange={setStockLevelFilter}
        options={[
          { label: "All Levels", value: "all" },
          { label: "Under Minimum", value: "under-min" },
          { label: "Optimal", value: "optimal" },
          { label: "Over Maximum", value: "over-max" },
        ]}
        placeholder="All Levels"
      />

      {hasFiltersApplied && (
        <Button variant="outline" onClick={handleReset}>
          <XIcon />
          Clear
        </Button>
      )}
    </div>
  );
}
