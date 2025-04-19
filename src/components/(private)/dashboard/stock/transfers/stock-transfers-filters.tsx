"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Selector } from "@/components/ui/selector";
import { useStocks } from "@/hooks/use-stock";
import { SearchInput } from "@/components/ui/search-input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { XIcon } from "lucide-react";

export function StockTransfersFilters() {
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
  const [sourceLocationFilter, setSourceLocationFilter] = useState(
    searchParams.get("source") || "all"
  );
  const [destinationLocationFilter, setDestinationLocationFilter] = useState(
    searchParams.get("destination") || "all"
  );
  const [dateRangeFilter, setDateRangeFilter] = useState(
    searchParams.get("date") || "all"
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "date-desc");

  const hasFiltersApplied = useMemo(() => {
    return (
      searchTerm !== "" ||
      statusFilter !== "all" ||
      sourceLocationFilter !== "all" ||
      destinationLocationFilter !== "all" ||
      dateRangeFilter !== "all" ||
      sortBy !== "date-desc"
    );
  }, [
    searchTerm,
    statusFilter,
    sourceLocationFilter,
    destinationLocationFilter,
    dateRangeFilter,
    sortBy,
  ]);

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

    if (sourceLocationFilter && sourceLocationFilter !== "all") {
      params.set("source", sourceLocationFilter);
    } else {
      params.delete("source");
    }

    if (destinationLocationFilter && destinationLocationFilter !== "all") {
      params.set("destination", destinationLocationFilter);
    } else {
      params.delete("destination");
    }

    if (dateRangeFilter && dateRangeFilter !== "all") {
      params.set("date", dateRangeFilter);
    } else {
      params.delete("date");
    }

    if (sortBy && sortBy !== "date-desc") {
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
    sourceLocationFilter,
    destinationLocationFilter,
    dateRangeFilter,
    sortBy,
    router,
    pathname,
    searchParams,
  ]);

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSourceLocationFilter("all");
    setDestinationLocationFilter("all");
    setDateRangeFilter("all");
    setSortBy("date-desc");
    router.push(pathname);
  };

  return (
    <div className="flex gap-2 items-center flex-wrap">
      <SearchInput
        placeholder="Search transfers..."
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      <Selector
        value={statusFilter}
        onChange={setStatusFilter}
        options={[
          { label: "All Statuses", value: "all" },
          { label: "Draft", value: "draft" },
          { label: "In Progress", value: "in-progress" },
          { label: "Completed", value: "completed" },
          { label: "Cancelled", value: "cancelled" },
        ]}
        placeholder="Status"
      />
      <Selector
        value={sourceLocationFilter}
        onChange={setSourceLocationFilter}
        options={[
          { label: "All Source Locations", value: "all" },
          ...locations.map((location) => ({
            label: location.name,
            value: location.id,
          })),
        ]}
        placeholder="From Location"
        disabled={isLoadingLocations}
      />
      <Selector
        value={destinationLocationFilter}
        onChange={setDestinationLocationFilter}
        options={[
          { label: "All Destination Locations", value: "all" },
          ...locations.map((location) => ({
            label: location.name,
            value: location.id,
          })),
        ]}
        placeholder="To Location"
        disabled={isLoadingLocations}
      />
      <Selector
        value={dateRangeFilter}
        onChange={setDateRangeFilter}
        options={[
          { label: "All Dates", value: "all" },
          { label: "Today", value: "today" },
          { label: "This Week", value: "week" },
          { label: "This Month", value: "month" },
          { label: "Last 3 Months", value: "quarter" },
        ]}
        placeholder="Date Range"
      />

      {hasFiltersApplied && (
        <Button variant="outline" onClick={handleReset}>
          <XIcon className="h-4 w-4 mr-2" />
          Clear
        </Button>
      )}
    </div>
  );
}
