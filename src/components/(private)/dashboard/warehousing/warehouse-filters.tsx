"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWarehousing } from "@/hooks/use-warehousing";
import { useDebounce } from "@/hooks/use-debounce";

export function WarehouseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { warehouses } = useWarehousing();

  // Get filter values from URL
  const statusParam = searchParams.get("status") || "all";
  const locationParam = searchParams.get("location") || "all";
  const searchParam = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "name-asc";

  // Local state for filter values
  const [status, setStatus] = useState(statusParam);
  const [location, setLocation] = useState(locationParam);
  const [search, setSearch] = useState(searchParam);
  const [sort, setSort] = useState(sortParam);

  // Debounce search to avoid excessive URL updates
  const debouncedSearch = useDebounce(search, 300);

  // Extract unique locations from warehouses
  const uniqueLocations = warehouses
    ? [
        ...new Set(
          warehouses.map((w) => {
            // Extract city name from address
            const addressParts = w.address.split(",");
            return addressParts.length > 1
              ? addressParts[addressParts.length - 2].trim()
              : w.address;
          })
        ),
      ]
    : [];

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    if (location && location !== "all") {
      params.set("location", location);
    } else {
      params.delete("location");
    }

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    if (sort && sort !== "name-asc") {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    router.push(`/h/warehousing?${params.toString()}`);
  }, [debouncedSearch, status, location, sort, router, searchParams]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search warehouses..."
          className="w-full pl-8"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
        </SelectContent>
      </Select>

      <Select value={location} onValueChange={setLocation}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Location" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Locations</SelectItem>
          {uniqueLocations.map((loc) => (
            <SelectItem key={loc} value={loc}>
              {loc}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={setSort}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="name-asc">Name (A-Z)</SelectItem>
          <SelectItem value="name-desc">Name (Z-A)</SelectItem>
          <SelectItem value="capacity-asc">Capacity (Low-High)</SelectItem>
          <SelectItem value="capacity-desc">Capacity (High-Low)</SelectItem>
          <SelectItem value="utilization-asc">Usage (Low-High)</SelectItem>
          <SelectItem value="utilization-desc">Usage (High-Low)</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => {
          setSearch("");
          setStatus("all");
          setLocation("all");
          setSort("name-asc");
        }}
      >
        Reset Filters
      </Button>
    </div>
  );
}
