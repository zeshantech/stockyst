"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IconSearch, IconX } from "@tabler/icons-react";

interface WarehouseInventoryFiltersProps {
  warehouseId: string;
}

export function WarehouseInventoryFilters({
  warehouseId,
}: WarehouseInventoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current filters
  const currentSearch = searchParams.get("search") || "";
  const currentCategory = searchParams.get("category") || "all";
  const currentStatus = searchParams.get("status") || "all";
  const currentLocation = searchParams.get("location") || "all";
  const currentSort = searchParams.get("sort") || "name-asc";

  // Local state for controlled inputs
  const [search, setSearch] = useState(currentSearch);
  const [category, setCategory] = useState(currentCategory);
  const [status, setStatus] = useState(currentStatus);
  const [location, setLocation] = useState(currentLocation);
  const [sort, setSort] = useState(currentSort);

  // Update local state when search params change
  useEffect(() => {
    setSearch(currentSearch);
    setCategory(currentCategory);
    setStatus(currentStatus);
    setLocation(currentLocation);
    setSort(currentSort);
  }, [
    currentSearch,
    currentCategory,
    currentStatus,
    currentLocation,
    currentSort,
  ]);

  // Sample category options for the filter
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "Electronics", label: "Electronics" },
    { value: "Furniture", label: "Furniture" },
    { value: "Office Accessories", label: "Office Accessories" },
    { value: "Cables", label: "Cables" },
    { value: "Storage", label: "Storage" },
  ];

  // Sample location options for the filter
  const locationOptions = [
    { value: "all", label: "All Locations" },
    { value: "Zone A", label: "Zone A" },
    { value: "Zone B", label: "Zone B" },
    { value: "Zone C", label: "Zone C" },
    { value: "Receiving", label: "Receiving" },
    { value: "Shipping", label: "Shipping" },
  ];

  // Status options for the filter
  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "in-stock", label: "In Stock" },
    { value: "low-stock", label: "Low Stock" },
    { value: "out-of-stock", label: "Out of Stock" },
  ];

  // Sort options
  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "quantity-asc", label: "Quantity (Low to High)" },
    { value: "quantity-desc", label: "Quantity (High to Low)" },
    { value: "category-asc", label: "Category (A-Z)" },
    { value: "category-desc", label: "Category (Z-A)" },
  ];

  // Update URL with filters
  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category !== "all") params.set("category", category);
    if (status !== "all") params.set("status", status);
    if (location !== "all") params.set("location", location);
    if (sort !== "name-asc") params.set("sort", sort);

    router.push(`/h/warehousing/${warehouseId}?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setStatus("all");
    setLocation("all");
    setSort("name-asc");

    router.push(`/h/warehousing/${warehouseId}`);
  };

  // Apply filters on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      applyFilters();
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-auto">
        <IconSearch className="absolute h-4 w-4 left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search inventory..."
          className="w-full pl-10 sm:w-[250px]"
        />
        {search && (
          <Button
            variant="ghost"
            onClick={() => {
              setSearch("");
              applyFilters();
            }}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <IconX className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Select
        value={category}
        onValueChange={(value) => {
          setCategory(value);
          applyFilters();
        }}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categoryOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={location}
        onValueChange={(value) => {
          setLocation(value);
          applyFilters();
        }}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          {locationOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={status}
        onValueChange={(value) => {
          setStatus(value);
          applyFilters();
        }}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={sort}
        onValueChange={(value) => {
          setSort(value);
          applyFilters();
        }}
      >
        <SelectTrigger className="w-full sm:w-[210px]">
          <SelectValue placeholder="Sort By" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {(search ||
        category !== "all" ||
        status !== "all" ||
        location !== "all" ||
        sort !== "name-asc") && (
        <Button variant="ghost" onClick={clearFilters} className="ml-auto">
          Clear Filters
        </Button>
      )}
    </div>
  );
}
