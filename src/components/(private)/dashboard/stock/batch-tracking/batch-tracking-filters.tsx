"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useStocks } from "@/hooks/use-stock";
import { FilterIcon, XCircleIcon } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";

const BatchTrackingFilters = () => {
  const { locations } = useStocks();

  const [filters, setFilters] = React.useState({
    search: "",
    location: "",
    status: "",
    expiryRange: "",
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle selector change
  const handleSelectorChange = (name: string) => (value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const handleReset = () => {
    setFilters({
      search: "",
      location: "",
      status: "",
      expiryRange: "",
    });
  };

  // Location options for selector
  const locationOptions = React.useMemo(
    () => [
      { label: "All Locations", value: "" },
      ...locations.map((location) => ({
        label: location.name,
        value: location.id,
      })),
    ],
    [locations]
  );

  // Status options
  const statusOptions = [
    { label: "All Status", value: "" },
    { label: "Active", value: "active" },
    { label: "Depleted", value: "depleted" },
    { label: "Expired", value: "expired" },
  ];

  // Expiry range options
  const expiryRangeOptions = [
    { label: "All", value: "" },
    { label: "Expired", value: "expired" },
    { label: "Expires in 30 days", value: "30" },
    { label: "Expires in 90 days", value: "90" },
    { label: "Expires in 180 days", value: "180" },
  ];

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <SearchInput
          className="flex-1"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Search by batch number, product name, or SKU..."
        />

        <div className="flex gap-2">
          {/* <Selector
            options={locationOptions}
            value={filters.location}
            onChange={handleSelectorChange("location")}
            placeholder="Location"
            containerClass="w-40"
          /> */}

          {/* <Selector
            options={statusOptions}
            value={filters.status}
            onChange={handleSelectorChange("status")}
            placeholder="Status"
            containerClass="w-32"
          />

          <Selector
            options={expiryRangeOptions}
            value={filters.expiryRange}
            onChange={handleSelectorChange("expiryRange")}
            placeholder="Expiry"
            containerClass="w-40"
          /> */}

          {hasActiveFilters && (
            <Button variant="ghost" size="icon" onClick={handleReset}>
              <XCircleIcon />
            </Button>
          )}
        </div>
      </div>

      {/* Active filters display (only shown when filters are active) */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm">
          <FilterIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Filters:</span>

          {filters.location && (
            <div className="rounded-md bg-secondary px-2 py-1">
              Location:{" "}
              {locationOptions.find(
                (option) => option.value === filters.location
              )?.label || "Unknown"}
            </div>
          )}

          {filters.status && (
            <div className="rounded-md bg-secondary px-2 py-1">
              Status:{" "}
              {statusOptions.find((option) => option.value === filters.status)
                ?.label || "Unknown"}
            </div>
          )}

          {filters.expiryRange && (
            <div className="rounded-md bg-secondary px-2 py-1">
              Expiry:{" "}
              {expiryRangeOptions.find(
                (option) => option.value === filters.expiryRange
              )?.label || "Unknown"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BatchTrackingFilters;
