"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Selector } from "@/components/ui/selector"; // Assuming Selector is imported here
import { useStocks } from "@/hooks/use-stock";
import { SearchInput } from "@/components/ui/search-input";
import { DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {
  FilterIcon,
  ChevronDownIcon,
} from "lucide-react";

export function ExpiryTrackingFilters() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { locations } = useStocks();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // In a real app, this would trigger filtering logic
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex-1 min-w-[240px] max-w-md">
          <SearchInput
            placeholder="Search by product name, SKU..."
            onChange={(e) => handleSearch(e.target.value)}
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
            <Selector
              label="Location"
              placeholder="All Locations"
              onChange={() => {}}
              options={[
                { value: "all", label: "All Locations" },
                ...locations.map((location) => ({
                  value: location.id,
                  label: location.name,
                })),
              ]}
            />
          </div>

          <div className="space-y-2">
            <Selector
              label="Status"
              placeholder="All Statuses"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              options={[
                { value: "all", label: "All Statuses" },
                { value: "upcoming", label: "Upcoming" },
                { value: "imminent", label: "Imminent" },
                { value: "expired", label: "Expired" },
              ]}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Expiry Date Range</label>
            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
          </div>

          <div className="space-y-2">
            <Selector
              label="Days to Expiry"
              placeholder="Any"
              onChange={() => {}}
              options={[
                { value: "any", label: "Any" },
                { value: "expired", label: "Expired" },
                { value: "0-30", label: "0-30 days" },
                { value: "31-60", label: "31-60 days" },
                { value: "61-90", label: "61-90 days" },
                { value: "90+", label: "90+ days" },
              ]}
            />
          </div>

          <div className="space-y-2">
            <Selector
              label="Sort By"
              placeholder="Expiry Date"
              onChange={() => {}}
              options={[
                { value: "expiryDate", label: "Expiry Date" },
                { value: "daysToExpiry", label: "Days to Expiry" },
                { value: "productName", label: "Product Name" },
                { value: "quantity", label: "Quantity" },
                { value: "status", label: "Status" },
              ]}
            />
          </div>

          <div className="col-span-1 md:col-span-3 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateRange(undefined);
              }}
            >
              Reset
            </Button>
            <Button size="sm">Apply Filters</Button>
          </div>
        </div>
      )}
    </div>
  );
}
