import { AppSidebar } from "@/components/(private)/dashboard/layout/app-sidebar";
import { SiteHeader } from "@/components/(private)/dashboard/layout/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
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
