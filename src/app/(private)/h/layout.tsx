"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/(private)/dashboard/layout/app-sidebar";
import { SiteHeader } from "@/components/(private)/dashboard/layout/site-header";
import { ErrorState } from "@/components/ui/empty-state";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SpinnerBackdrop } from "@/components/ui/spinner";
import { useInitializeStoreStore, useStoreStore } from "@/store/useStoreStore";
import { useInitializeUserStore } from "@/store/useUserStore";
import { AlertCircle } from "lucide-react";

export default function Layout({ children }: { children: ReactNode }) {
  useInitializeUserStore();
  useInitializeStoreStore();
  const isStoresLoading = useStoreStore((state) => state.isStoresLoading);
  const isStoresError = useStoreStore((state) => state.isStoresError);

  if (isStoresLoading) {
    return <SpinnerBackdrop show={true} size="xlarge" fullScreen />;
  }

  if (isStoresError) {
    return <ErrorState title="Error loading stores" description="Something went wrong while fetching the data. Please try again later." icon={<AlertCircle />} />;
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
