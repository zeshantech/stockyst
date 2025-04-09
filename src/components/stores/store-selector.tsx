"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, PlusCircle, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useStores, useActiveStore } from "@/hooks/use-stores";
import { useCreateStoreDialog } from "./use-create-store-dialog";

export function StoreSelector() {
  const [open, setOpen] = useState(false);
  const { data: stores, isLoading } = useStores();
  const { activeStore, setActiveStore } = useActiveStore();
  const { openCreateStoreDialog } = useCreateStoreDialog();

  if (isLoading) {
    return (
      <Button variant="outline" className="w-[200px] justify-start">
        <Store className="mr-2 h-4 w-4" />
        <span>Loading stores...</span>
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a store"
          className="w-[200px] justify-between"
        >
          <div className="flex items-center truncate">
            <Store className="mr-2 h-4 w-4 shrink-0" />
            <span className="truncate">
              {activeStore ? activeStore.name : "Select store"}
            </span>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search store..." />
          <CommandList>
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading="Stores">
              {stores?.map((store) => (
                <CommandItem
                  key={store.id}
                  value={store.id}
                  onSelect={() => {
                    setActiveStore(store.id);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      activeStore?.id === store.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{store.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  openCreateStoreDialog();
                }}
                className="cursor-pointer text-blue-600"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
