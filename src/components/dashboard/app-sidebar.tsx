"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
  IconBox,
  IconTruck,
  IconCategory,
  IconShoppingCart,
  IconBuildingStore,
  IconPackage,
  IconAlertCircle,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/dashboard/nav-documents";
import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Admin",
    email: "admin@example.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/h",
      icon: IconDashboard,
    },
    {
      title: "Products",
      url: "/h/products",
      icon: IconBox,
    },
    {
      title: "Stock Management",
      url: "/h/stock",
      icon: IconPackage,
      items: [
        {
          title: "Stock Alerts",
          url: "/h/stock/alerts",
        },
        {
          title: "Alert Settings",
          url: "/h/stock/alerts/settings",
        },
      ],
    },
    {
      title: "Orders",
      url: "/h/orders",
      icon: IconShoppingCart,
    },
    {
      title: "Suppliers",
      url: "/h/suppliers",
      icon: IconTruck,
    },
    {
      title: "Categories",
      url: "/h/categories",
      icon: IconCategory,
    },
    {
      title: "Analytics",
      url: "/h/analytics",
      icon: IconChartBar,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Reports",
      url: "/h/reports",
      icon: IconReport,
    },
    {
      title: "Settings",
      url: "/h/settings",
      icon: IconSettings,
    },
    {
      title: "Help & Support",
      url: "/h/help",
      icon: IconHelp,
    },
  ],
  documents: [
    {
      name: "Inventory Overview",
      url: "/h/inventory",
      icon: IconDatabase,
    },
    {
      name: "Store Locations",
      url: "/h/locations",
      icon: IconBuildingStore,
    },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">InventoryPro</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
