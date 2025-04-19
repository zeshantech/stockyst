"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useProducts } from "@/hooks/use-products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X, Check, ChevronDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { IProduct } from "@/types/product";
import { Label } from "@/components/ui/label";
import { Info } from "@/components/ui/info";

interface ProductSelectorProps {
  multiple?: boolean;
  selectedProductIds?: string[];
  onSelect: (productIds: string[]) => void;
  placeholder?: string;
  maxItems?: number;
  disabled?: boolean;
  className?: string;
  showImages?: boolean;
  preloadedProducts?: IProduct[];
  label?: string;
  error?: string;
  info?: string;
  required?: boolean;
}

export function ProductSelector({
  multiple = false,
  selectedProductIds = [],
  onSelect,
  placeholder = "Select products",
  maxItems = 5,
  disabled = false,
  className,
  showImages = true,
  preloadedProducts,
  label,
  error,
  info,
  required,
}: ProductSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<string[]>(selectedProductIds || []);

  const { products, categories, isLoadingProducts } = useProducts();

  // Use preloaded products if provided, otherwise use products from the hook
  const allProducts = preloadedProducts || products;

  // Update internal state when prop changes
  useEffect(() => {
    setSelected(selectedProductIds || []);
  }, [selectedProductIds]);

  // Filter products based on search, category and status
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      const matchesSearch =
        search === "" ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.sku?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "all" || product.categoryId === category;

      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [allProducts, search, category, statusFilter]);

  // Get selected products details
  const selectedProducts = useMemo(() => {
    return selected.map(
      (id) => allProducts.find((product) => product.id === id) as IProduct
    );
  }, [selected, allProducts]);

  const handleSelect = (productId: string) => {
    let newSelected: string[];

    if (multiple) {
      if (selected.includes(productId)) {
        newSelected = selected.filter((id) => id !== productId);
      } else {
        newSelected = [...selected, productId];
      }
    } else {
      newSelected = [productId];
      setOpen(false);
    }

    setSelected(newSelected);
    onSelect(newSelected);
  };

  const handleRemove = (productId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newSelected = selected.filter((id) => id !== productId);
    setSelected(newSelected);
    onSelect(newSelected);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected([]);
    onSelect([]);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="flex gap-1 items-center">
          {label} {required && <span className="text-destructive">*</span>}
          {info && <Info tooltip={info} />}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-auto min-h-10",
              selected.length > 0 ? "h-auto" : "",
              disabled ? "opacity-50 cursor-not-allowed" : "",
              error
                ? "border-destructive ring-destructive/20 dark:ring-destructive/40"
                : ""
            )}
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1 items-center">
              {selected.length === 0 ? (
                <span className="text-muted-foreground">{placeholder}</span>
              ) : multiple ? (
                <div className="flex flex-wrap gap-1 py-1">
                  {selectedProducts.slice(0, maxItems).map((product) => (
                    <Badge
                      variant="secondary"
                      key={product.id}
                      className="flex items-center gap-1 py-1"
                    >
                      {product.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={(e) => handleRemove(product.id, e)}
                      />
                    </Badge>
                  ))}
                  {selected.length > maxItems && (
                    <Badge variant="secondary" className="py-1">
                      +{selected.length - maxItems} more
                    </Badge>
                  )}
                </div>
              ) : (
                <span>{selectedProducts[0]?.name || placeholder}</span>
              )}
            </div>
            <div className="flex items-center">
              {selected.length > 0 && multiple && (
                <X
                  className="h-4 w-4 mr-1 cursor-pointer text-muted-foreground hover:text-foreground"
                  onClick={handleClearAll}
                />
              )}
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0 sm:w-[500px]" align="start">
          <Command className="w-full">
            <div className="flex flex-col sm:flex-row border-b">
              <div className="relative w-full">
                <CommandInput
                  placeholder="Search products..."
                  className="rounded-none"
                  value={search}
                  onValueChange={setSearch}
                />
              </div>
              <div className="flex border-t sm:border-t-0 sm:border-l">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-10 w-[130px] rounded-none border-0">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 w-[110px] rounded-none border-0 border-l">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <CommandList className="max-h-[300px] overflow-auto">
              <CommandEmpty>No products found.</CommandEmpty>
              <CommandGroup>
                {isLoadingProducts ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Loading products...
                  </div>
                ) : (
                  filteredProducts.map((product) => {
                    const isSelected = selected.includes(product.id);
                    return (
                      <CommandItem
                        key={product.id}
                        onSelect={() => handleSelect(product.id)}
                        className={cn(
                          "flex items-center gap-2 py-2",
                          isSelected ? "bg-accent" : ""
                        )}
                      >
                        {multiple ? (
                          <Checkbox
                            checked={isSelected}
                            className="mr-1"
                            onCheckedChange={() => {}}
                          />
                        ) : isSelected ? (
                          <Check className="h-4 w-4" />
                        ) : null}
                        {showImages && product.image && (
                          <div className="h-8 w-8 overflow-hidden rounded-md border">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-medium">{product.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {product.sku} · {product.quantity} in stock
                          </span>
                        </div>
                        <Badge variant="outline" className="ml-auto">
                          ${product.price.toFixed(2)}
                        </Badge>
                      </CommandItem>
                    );
                  })
                )}
              </CommandGroup>
            </CommandList>
            {multiple && selected.length > 0 && (
              <div className="border-t p-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {selected.length} product{selected.length !== 1 ? "s" : ""}{" "}
                  selected
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setOpen(false)}
                >
                  Done
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
      {error && <span className="text-sm text-error">{error}</span>}

      {multiple && selected.length > 0 && (
        <div className="mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-auto p-1 text-xs text-muted-foreground"
          >
            Clear all selected
          </Button>
        </div>
      )}
    </div>
  );
}
