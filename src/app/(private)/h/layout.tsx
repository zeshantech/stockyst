"use client";

import { ReactNode, useState } from "react";
import { AppSidebar } from "@/components/(private)/dashboard/layout/app-sidebar";
import { SiteHeader } from "@/components/(private)/dashboard/layout/site-header";
import { EmptyState, ErrorState } from "@/components/ui/empty-state";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SpinnerBackdrop } from "@/components/ui/spinner";
import { useInitializeStoreStore, useStoreStore } from "@/store/useStoreStore";
import { useInitializeUserStore } from "@/store/useUserStore";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateStoreDialog } from "@/components/(private)/dashboard/layout/create-store-dialog";

export default function Layout({ children }: { children: ReactNode }) {
  useInitializeUserStore();
  useInitializeStoreStore();
  const stores = useStoreStore((state) => state.stores);
  const isStoresLoading = useStoreStore((state) => state.isStoresLoading);
  const isStoresSuccess = useStoreStore((state) => state.isStoresSuccess);
  const isStoresError = useStoreStore((state) => state.isStoresError);
  const isCreateStoreLoading = useStoreStore((state) => state.isCreateStoreLoading);
  const [createStoreOpen, setCreateStoreOpen] = useState(false);

  if (isStoresLoading) {
    return <SpinnerBackdrop show={true} size="xlarge" fullScreen />;
  }

  if (isStoresError) {
    return <ErrorState title="Error loading stores" description="Something went wrong while fetching the data. Please try again later." icon={<AlertCircle />} />;
  }

  if (!stores?.length) {
    if (isStoresSuccess) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Button onClick={() => setCreateStoreOpen(true)} loading={isCreateStoreLoading}>
            Create Store
          </Button>
          <CreateStoreDialog open={createStoreOpen} onClose={() => setCreateStoreOpen(false)} />
        </div>
      );
    }

    return null;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset className="h-[calc(100vh-1rem)] overflow-y-auto">
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
