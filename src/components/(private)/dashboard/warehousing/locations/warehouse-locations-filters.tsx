"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface WarehouseLocationsFiltersProps {
  warehouseId: string;
}

export function WarehouseLocationsFilters(_: WarehouseLocationsFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current values from URL
  const searchTerm = searchParams.get("search") || "";
  const typeFilter = searchParams.get("type") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const sortParam = searchParams.get("sort") || "name-asc";

  // States for controlled inputs
  const [search, setSearch] = useState(searchTerm);
  const [type, setType] = useState(typeFilter);
  const [status, setStatus] = useState(statusFilter);
  const [sort, setSort] = useState(sortParam);

  // Update URL with filters
  const updateSearchParams = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  // Apply search when user types and stops
  useEffect(() => {
    const handler = setTimeout(() => {
      const newParams = updateSearchParams("search", search);
      router.push(`${pathname}?${newParams}`);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [search, pathname, router, updateSearchParams]);

  // Apply filters immediately when changed
  const handleFilterChange = (name: string, value: string) => {
    const newParams = updateSearchParams(name, value);
    router.push(`${pathname}?${newParams}`);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setType("all");
    setStatus("all");
    setSort("name-asc");
    router.push(pathname);
  };

  // Whether any filters are active
  const hasActiveFilters =
    search !== "" || type !== "all" || status !== "all" || sort !== "name-asc";

  // Warehouse location types and statuses
  const locationTypes = [
    { value: "all", label: "All Types" },
    { value: "storage", label: "Storage" },
    { value: "receiving", label: "Receiving" },
    { value: "shipping", label: "Shipping" },
    { value: "picking", label: "Picking" },
    { value: "sorting", label: "Sorting" },
    { value: "packing", label: "Packing" },
    { value: "quality-control", label: "Quality Control" },
  ];

  const locationStatuses = [
    { value: "all", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "maintenance", label: "Maintenance" },
    { value: "reserved", label: "Reserved" },
  ];

  const sortOptions = [
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "capacity-asc", label: "Capacity (Low to High)" },
    { value: "capacity-desc", label: "Capacity (High to Low)" },
    { value: "utilization-asc", label: "Utilization (Low to High)" },
    { value: "utilization-desc", label: "Utilization (High to Low)" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-4">
      <div className="w-full sm:w-auto relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 w-full sm:w-[250px]"
        />
        {search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full"
            onClick={() => setSearch("")}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      <Select
        value={type}
        onValueChange={(value) => {
          setType(value);
          handleFilterChange("type", value);
        }}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {locationTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={status}
        onValueChange={(value) => {
          setStatus(value);
          handleFilterChange("status", value);
        }}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {locationStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select
        value={sort}
        onValueChange={(value) => {
          setSort(value);
          handleFilterChange("sort", value);
        }}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={resetFilters}
          className="text-sm text-muted-foreground h-9"
        >
          Reset filters
        </Button>
      )}
    </div>
  );
}
