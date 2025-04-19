"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { NotificationPopup } from "@/components/(private)/dashboard/notifications/notification-popup";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function SiteHeader() {
  const { setTheme, theme } = useTheme();

  return (
    <header className="flex justify-between h-(--header-height) shrink-0 items-center gap-2 p-4 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mx-2 data-[orientation=vertical]:h-4"
      />
      <h1 className="text-base font-medium">Documents</h1>
      <div className="ml-auto" />
      <NotificationPopup />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun /> : <Moon />}
      </Button>
    </header>
  );
}
