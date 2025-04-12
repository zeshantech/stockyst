"use client";

import * as React from "react";
import {
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconHelp,
  IconReport,
  IconSettings,
  IconBox,
  IconTruck,
  IconCategory,
  IconShoppingCart,
  IconBuildingStore,
  IconPackage,
  IconReceipt,
  IconBarcode,
  IconCalendarStats,
  IconBuildingWarehouse,
  IconFileInvoice,
  IconTag,
  IconUsersGroup,
  IconCurrencyDollar,
  IconApi,
  IconBooks,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/(private)/dashboard/nav-documents";
import { NavMain } from "@/components/(private)/dashboard/nav-main";
import { NavSecondary } from "@/components/(private)/dashboard/nav-secondary";
import { NavUser } from "@/components/(private)/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { StoreSwitcher } from "./team-switcher";

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
      items: [
        {
          title: "Overview",
          url: "/h",
        },
        {
          title: "KPI Metrics",
          url: "/h/metrics",
        },
        {
          title: "Activity Feed",
          url: "/h/activity",
        },
      ],
    },
    {
      title: "Products",
      url: "/h/products",
      icon: IconBox,
      items: [
        {
          title: "All Products",
          url: "/h/products",
        },
        {
          title: "Add New Product",
          url: "/h/products/new",
        },
        {
          title: "Bulk Import",
          url: "/h/products/import",
        },
        {
          title: "Product Variants",
          url: "/h/products/variants",
        },
        {
          title: "Product Bundles",
          url: "/h/products/bundles",
        },
        {
          title: "Digital Products",
          url: "/h/products/digital",
        },
        {
          title: "Product Catalog",
          url: "/h/products/catalog",
        },
      ],
    },
    {
      title: "Stock Management",
      url: "/h/stock",
      icon: IconPackage,
      items: [
        {
          title: "Inventory Levels",
          url: "/h/stock/levels",
        },
        {
          title: "Stock Transfers",
          url: "/h/stock/transfers",
        },
        {
          title: "Stock Adjustments",
          url: "/h/stock/adjustments",
        },
        {
          title: "Stock Alerts",
          url: "/h/stock/alerts",
        },
        {
          title: "Alert Settings",
          url: "/h/stock/alerts/settings",
        },
        {
          title: "Batch Tracking",
          url: "/h/stock/batch-tracking",
        },
        {
          title: "Serial Numbers",
          url: "/h/stock/serial-numbers",
        },
        {
          title: "Expiry Tracking",
          url: "/h/stock/expiry-tracking",
        },
        {
          title: "Inventory Counts",
          url: "/h/stock/counts",
        },
      ],
    },
    {
      title: "Orders",
      url: "/h/orders",
      icon: IconShoppingCart,
      items: [
        {
          title: "All Orders",
          url: "/h/orders",
        },
        {
          title: "New Order",
          url: "/h/orders/new",
        },
        {
          title: "Order Fulfillment",
          url: "/h/orders/fulfillment",
        },
        {
          title: "Returns",
          url: "/h/orders/returns",
        },
        {
          title: "Backorders",
          url: "/h/orders/backorders",
        },
        {
          title: "Dropshipping",
          url: "/h/orders/dropshipping",
        },
        {
          title: "Subscriptions",
          url: "/h/orders/subscriptions",
        },
      ],
    },
    {
      title: "Purchasing",
      url: "/h/purchasing",
      icon: IconReceipt,
      items: [
        {
          title: "Purchase Orders",
          url: "/h/purchasing/orders",
        },
        {
          title: "Create PO",
          url: "/h/purchasing/new",
        },
        {
          title: "Receive Inventory",
          url: "/h/purchasing/receive",
        },
        {
          title: "Purchase Planning",
          url: "/h/purchasing/planning",
        },
        {
          title: "Vendor Quotes",
          url: "/h/purchasing/quotes",
        },
        {
          title: "Purchase History",
          url: "/h/purchasing/history",
        },
      ],
    },
    {
      title: "Suppliers",
      url: "/h/suppliers",
      icon: IconTruck,
      items: [
        {
          title: "All Suppliers",
          url: "/h/suppliers",
        },
        {
          title: "Add Supplier",
          url: "/h/suppliers/new",
        },
        {
          title: "Supplier Performance",
          url: "/h/suppliers/performance",
        },
        {
          title: "Supplier Catalogs",
          url: "/h/suppliers/catalogs",
        },
        {
          title: "Supplier Contracts",
          url: "/h/suppliers/contracts",
        },
        {
          title: "Payment Terms",
          url: "/h/suppliers/payment-terms",
        },
      ],
    },
    {
      title: "Categories",
      url: "/h/categories",
      icon: IconCategory,
      items: [
        {
          title: "All Categories",
          url: "/h/categories",
        },
        {
          title: "Add Category",
          url: "/h/categories/new",
        },
        {
          title: "Category Hierarchy",
          url: "/h/categories/hierarchy",
        },
        {
          title: "Attributes",
          url: "/h/categories/attributes",
        },
      ],
    },
    {
      title: "Warehousing",
      url: "/h/warehousing",
      icon: IconBuildingWarehouse,
      items: [
        {
          title: "Locations",
          url: "/h/warehousing/locations",
        },
        {
          title: "Bin Management",
          url: "/h/warehousing/bins",
        },
        {
          title: "Pick & Pack",
          url: "/h/warehousing/pick-pack",
        },
        {
          title: "Warehouse Transfers",
          url: "/h/warehousing/transfers",
        },
        {
          title: "Receiving",
          url: "/h/warehousing/receiving",
        },
        {
          title: "Putaway Rules",
          url: "/h/warehousing/putaway",
        },
        {
          title: "Warehouse Map",
          url: "/h/warehousing/map",
        },
      ],
    },
    {
      title: "Customers",
      url: "/h/customers",
      icon: IconUsersGroup,
      items: [
        {
          title: "All Customers",
          url: "/h/customers",
        },
        {
          title: "Add Customer",
          url: "/h/customers/new",
        },
        {
          title: "Customer Groups",
          url: "/h/customers/groups",
        },
        {
          title: "Customer Orders",
          url: "/h/customers/orders",
        },
        {
          title: "Customer Support",
          url: "/h/customers/support",
        },
      ],
    },
    {
      title: "Analytics",
      url: "/h/analytics",
      icon: IconChartBar,
      items: [
        {
          title: "Sales Analytics",
          url: "/h/analytics/sales",
        },
        {
          title: "Inventory Analytics",
          url: "/h/analytics/inventory",
        },
        {
          title: "Forecasting",
          url: "/h/analytics/forecasting",
        },
        {
          title: "Custom Reports",
          url: "/h/analytics/custom",
        },
        {
          title: "Demand Planning",
          url: "/h/analytics/demand-planning",
        },
        {
          title: "Supplier Analytics",
          url: "/h/analytics/supplier",
        },
        {
          title: "Product Performance",
          url: "/h/analytics/product-performance",
        },
        {
          title: "Warehouse Efficiency",
          url: "/h/analytics/warehouse-efficiency",
        },
      ],
    },
    {
      title: "Barcode Management",
      url: "/h/barcodes",
      icon: IconBarcode,
      items: [
        {
          title: "Generate Barcodes",
          url: "/h/barcodes/generate",
        },
        {
          title: "Scan & Verify",
          url: "/h/barcodes/scan",
        },
        {
          title: "Label Printing",
          url: "/h/barcodes/print",
        },
        {
          title: "Mobile Scanning",
          url: "/h/barcodes/mobile",
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
    {
      name: "Pricing Sheets",
      url: "/h/pricing",
      icon: IconTag,
    },
    {
      name: "Invoices",
      url: "/h/invoices",
      icon: IconFileInvoice,
    },
    {
      name: "Scheduled Tasks",
      url: "/h/tasks",
      icon: IconCalendarStats,
    },
    {
      name: "Integration Status",
      url: "/h/integrations/status",
      icon: IconApi,
    },
    {
      name: "Financial Summary",
      url: "/h/finance/summary",
      icon: IconCurrencyDollar,
    },
    {
      name: "Training Materials",
      url: "/h/training",
      icon: IconBooks,
    },
  ],
};

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader>
        <StoreSwitcher />
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
