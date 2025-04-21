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

export function TransfersFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { warehouses } = useWarehousing();

  // Get filter values from URL
  const statusParam = searchParams.get("status") || "all";
  const sourceParam = searchParams.get("source") || "all";
  const destinationParam = searchParams.get("destination") || "all";
  const dateParam = searchParams.get("date") || "all";
  const searchParam = searchParams.get("search") || "";
  const sortParam = searchParams.get("sort") || "date-desc";

  // Local state for filter values
  const [status, setStatus] = useState(statusParam);
  const [source, setSource] = useState(sourceParam);
  const [destination, setDestination] = useState(destinationParam);
  const [dateRange, setDateRange] = useState(dateParam);
  const [search, setSearch] = useState(searchParam);
  const [sort, setSort] = useState(sortParam);

  // Debounce search to avoid excessive URL updates
  const debouncedSearch = useDebounce(search, 300);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }

    if (source && source !== "all") {
      params.set("source", source);
    } else {
      params.delete("source");
    }

    if (destination && destination !== "all") {
      params.set("destination", destination);
    } else {
      params.delete("destination");
    }

    if (dateRange && dateRange !== "all") {
      params.set("date", dateRange);
    } else {
      params.delete("date");
    }

    if (debouncedSearch) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    if (sort && sort !== "date-desc") {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    router.push(`/h/warehousing/transfers?${params.toString()}`);
  }, [
    debouncedSearch,
    status,
    source,
    destination,
    dateRange,
    sort,
    router,
    searchParams,
  ]);

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
          placeholder="Search transfers..."
          className="w-full pl-8"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in-transit">In Transit</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Select value={source} onValueChange={setSource}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          {warehouses?.map((warehouse) => (
            <SelectItem key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={destination} onValueChange={setDestination}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Destination" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Destinations</SelectItem>
          {warehouses?.map((warehouse) => (
            <SelectItem key={warehouse.id} value={warehouse.id}>
              {warehouse.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="quarter">Last 3 Months</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        onClick={() => {
          setSearch("");
          setStatus("all");
          setSource("all");
          setDestination("all");
          setDateRange("all");
          setSort("date-desc");
        }}
      >
        Reset Filters
      </Button>
    </div>
  );
}
