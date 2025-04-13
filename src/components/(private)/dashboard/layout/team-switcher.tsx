"use client";

import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useStores } from "@/hooks/use-stores";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IStore } from "@/types/store";
import { CreateStoreDialog } from "./create-store-dialog";

export function StoreSwitcher() {
  const { data } = useStores();
  const { isMobile } = useSidebar();
  const [activeStore, setActiveStore] = useState<IStore | null>(null);
  const [createStoreOpen, setCreateStoreOpen] = useState(false);

  useEffect(() => {
    if (!activeStore && data?.length) {
      setActiveStore(data[0]);
    }
  }, [data]);

  if (!activeStore || !data) {
    return null;
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image
                    src={activeStore.logo ?? ""}
                    alt={activeStore.name}
                    width={12}
                    height={12}
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeStore.name}
                  </span>
                  <span className="truncate text-xs">{activeStore.type}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Stores
              </DropdownMenuLabel>
              {data.map((store, index) => (
                <DropdownMenuItem
                  key={store.name}
                  onClick={() => setActiveStore(store)}
                  className="gap-2 p-2"
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Image
                      src={activeStore.logo ?? ""}
                      alt={activeStore.name}
                      width={12}
                      height={12}
                    />
                  </div>
                  {store.name}
                  <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => setCreateStoreOpen(true)}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add store
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <CreateStoreDialog
        open={createStoreOpen}
        onClose={() => setCreateStoreOpen(false)}
      />
    </>
  );
}
