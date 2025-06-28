"use client";

import { ChevronsUpDown, Plus, RefreshCcw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IStore } from "@/types/store";
import { CreateStoreDialog } from "./create-store-dialog";
import { useStoreStore } from "@/store/useStoreStore";
import { Button } from "@/components/ui/button";
import { cn, getLocalStorage } from "@/lib/utils";

export default function StoreSwitcher() {
  const { isMobile } = useSidebar();
  const stores = useStoreStore((state) => state.stores);
  const refetchStores = useStoreStore((state) => state.refetchStores);
  const isStoresFetching = useStoreStore((state) => state.isStoresFetching);
  const activeStore = useStoreStore((state) => state.activeStore);
  const setActiveStore = useStoreStore((state) => state.setActiveStore);

  const [createStoreOpen, setCreateStoreOpen] = useState(false);

  useEffect(() => {
    const storedActiveStoreId = getLocalStorage("activeStoreId");

    if (!activeStore && stores?.length) {
      const foundStore = stores.find((store) => store.ID === storedActiveStoreId);
      if (foundStore) {
        setActiveStore(foundStore);
      } else {
        setActiveStore(stores[0]);
      }
    }
  }, [activeStore, stores]);

  const handleStoreChange = (store: IStore) => {
    setActiveStore(store);
  };

  if (!activeStore) {
    return null;
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image src={activeStore.logoUrl ?? ""} alt={activeStore.name} width={96} height={96} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{activeStore.name}</span>
                  <span className="truncate text-xs">{activeStore.type}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg" align="start" side={isMobile ? "bottom" : "right"} sideOffset={4}>
              <div className="flex items-center justify-between">
                <DropdownMenuLabel className="text-xs text-muted-foreground">Stores</DropdownMenuLabel>
                <Button variant="ghost" size="iconSm" className="" onClick={refetchStores} disabled={isStoresFetching}>
                  <RefreshCcw className={cn(isStoresFetching && "animate-spin")} />
                </Button>
              </div>
              {stores.map((store, index) => (
                <DropdownMenuItem key={store.name} onClick={() => handleStoreChange(store)} className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Image src={store.logoUrl ?? ""} alt={store.name} width={44} height={44} />
                  </div>
                  {store.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 p-2" onClick={() => setCreateStoreOpen(true)}>
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">Add store</div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <CreateStoreDialog open={createStoreOpen} onClose={() => setCreateStoreOpen(false)} />
    </>
  );
}
