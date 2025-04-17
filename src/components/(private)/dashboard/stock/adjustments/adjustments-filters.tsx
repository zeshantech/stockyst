"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Selector } from "@/components/ui/selector";
import { SearchIcon, FilterIcon, XCircleIcon } from "lucide-react";

const AdjustmentsFilters = () => {
  // Filter state
  const [filters, setFilters] = React.useState({
    search: "",
    type: "",
    status: "",
    location: "",
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
      type: "",
      status: "",
      location: "",
    });
  };

  // Type options
  const typeOptions = [
    { label: "All Types", value: "all" },
    { label: "Addition", value: "addition" },
    { label: "Subtraction", value: "subtraction" },
    { label: "Correction", value: "correction" },
    { label: "Write-off", value: "write-off" },
  ];

  // Status options
  const statusOptions = [
    { label: "All Status", value: "all" },
    { label: "Draft", value: "draft" },
    { label: "Pending Approval", value: "pending-approval" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" },
  ];

  // Sample location options (these would come from the API in a real app)
  const locationOptions = [
    { label: "All Locations", value: "0" },
    { label: "Warehouse A", value: "1" },
    { label: "Warehouse B", value: "2" },
    { label: "Store Front", value: "3" },
    { label: "Distribution Center", value: "4" },
  ];

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search adjustments by number, location, reason..."
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <Selector
            options={typeOptions}
            value={filters.type}
            onChange={handleSelectorChange("type")}
            placeholder="Type"
            containerClass="w-32"
          />

          <Selector
            options={statusOptions}
            value={filters.status}
            onChange={handleSelectorChange("status")}
            placeholder="Status"
            containerClass="w-40"
          />

          <Selector
            options={locationOptions}
            value={filters.location}
            onChange={handleSelectorChange("location")}
            placeholder="Location"
            containerClass="w-40"
          />

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              className="h-9 w-9"
            >
              <XCircleIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active filters display (only shown when filters are active) */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <FilterIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Filters:</span>

          {filters.type && (
            <div className="rounded-md bg-secondary px-2 py-1">
              Type:{" "}
              {typeOptions.find((option) => option.value === filters.type)
                ?.label || "Unknown"}
            </div>
          )}

          {filters.status && (
            <div className="rounded-md bg-secondary px-2 py-1">
              Status:{" "}
              {statusOptions.find((option) => option.value === filters.status)
                ?.label || "Unknown"}
            </div>
          )}

          {filters.location && (
            <div className="rounded-md bg-secondary px-2 py-1">
              Location:{" "}
              {locationOptions.find(
                (option) => option.value === filters.location
              )?.label || "Unknown"}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdjustmentsFilters;
