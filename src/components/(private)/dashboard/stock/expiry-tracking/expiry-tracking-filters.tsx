"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useStocks } from "@/hooks/use-stock";
import { SearchInput } from "@/components/ui/search-input";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  SearchIcon,
  FilterIcon,
  ChevronDownIcon,
  CalendarIcon,
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
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Select onValueChange={() => {}}>
              <Select.Trigger id="location">
                <Select.Value placeholder="All Locations" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="all">All Locations</Select.Item>
                {locations.map((location) => (
                  <Select.Item key={location.id} value={location.id}>
                    {location.name}
                  </Select.Item>
                ))}
              </Select.Content>
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
              <Select.Trigger id="status">
                <Select.Value placeholder="All Statuses" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="all">All Statuses</Select.Item>
                <Select.Item value="upcoming">Upcoming</Select.Item>
                <Select.Item value="imminent">Imminent</Select.Item>
                <Select.Item value="expired">Expired</Select.Item>
              </Select.Content>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Expiry Date Range</label>
            <DateRangePicker value={dateRange} onChange={setDateRange} />
          </div>

          <div className="space-y-2">
            <label htmlFor="daysToExpiry" className="text-sm font-medium">
              Days to Expiry
            </label>
            <Select onValueChange={() => {}}>
              <Select.Trigger id="daysToExpiry">
                <Select.Value placeholder="Any" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="any">Any</Select.Item>
                <Select.Item value="expired">Expired</Select.Item>
                <Select.Item value="0-30">0-30 days</Select.Item>
                <Select.Item value="31-60">31-60 days</Select.Item>
                <Select.Item value="61-90">61-90 days</Select.Item>
                <Select.Item value="90+">90+ days</Select.Item>
              </Select.Content>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="sort" className="text-sm font-medium">
              Sort By
            </label>
            <Select onValueChange={() => {}}>
              <Select.Trigger id="sort">
                <Select.Value placeholder="Expiry Date" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="expiryDate">Expiry Date</Select.Item>
                <Select.Item value="daysToExpiry">Days to Expiry</Select.Item>
                <Select.Item value="productName">Product Name</Select.Item>
                <Select.Item value="quantity">Quantity</Select.Item>
                <Select.Item value="status">Status</Select.Item>
              </Select.Content>
            </Select>
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
