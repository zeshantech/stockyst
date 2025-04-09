"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  IconBox,
  IconTruck,
  IconUsers,
  IconChartBar,
  IconAlertCircle,
  IconSearch,
  IconBell,
  IconSettings,
  IconMenu2,
  IconPlus,
  IconFilter,
  IconArrowUpRight,
  IconArrowDownRight,
  IconPackage,
  IconClipboardList,
  IconRefresh,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Add CSS for hiding scrollbar

export function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6 }}
      className="mt-20 w-full max-w-7xl mx-auto relative z-10 px-4 sm:px-6 lg:px-8"
    >
      {/* Background glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl blur-2xl -z-10 animate-pulse"></div>

      {/* Browser window frame */}
      <div className="relative rounded-2xl shadow-2xl bg-background border border-border">
        <div className="bg-muted/30 rounded-t-2xl p-4 flex items-center gap-2 border-b border-border">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="flex-grow flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1 bg-background rounded-md text-xs text-muted-foreground border border-border">
              <IconBox className="h-3.5 w-3.5" />
              app.inventree.com/dashboard
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="grid grid-cols-12 h-[600px]">
          {/* Sidebar */}
          <div className="col-span-2 border-r border-border p-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 px-3 py-2">
              <IconBox className="h-6 w-6 text-primary" />
              <span className="font-semibold">InvenTree</span>
            </div>

            <div className="space-y-1">
              {[
                { icon: IconChartBar, label: "Dashboard", active: true },
                { icon: IconBox, label: "Inventory" },
                { icon: IconTruck, label: "Orders" },
                { icon: IconUsers, label: "Suppliers" },
                { icon: IconClipboardList, label: "Reports" },
                { icon: IconSettings, label: "Settings" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors",
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="col-span-10 p-6 space-y-6 overflow-y-auto hide-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, Admin
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <IconBell className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                  A
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-4 gap-6">
              {[
                {
                  icon: IconBox,
                  label: "Total Items",
                  value: "2,547",
                  trend: "+12.5%",
                  trendUp: true,
                },
                {
                  icon: IconTruck,
                  label: "Pending Orders",
                  value: "24",
                  trend: "-3.2%",
                  trendUp: false,
                },
                {
                  icon: IconPackage,
                  label: "Low Stock Items",
                  value: "15",
                  trend: "+2.4%",
                  trendUp: true,
                },
                {
                  icon: IconChartBar,
                  label: "Monthly Revenue",
                  value: "$45.2K",
                  trend: "+28.4%",
                  trendUp: true,
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="rounded-xl border border-border bg-card p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div
                      className={cn(
                        "text-sm flex items-center gap-1",
                        stat.trendUp ? "text-green-500" : "text-red-500"
                      )}
                    >
                      {stat.trendUp ? (
                        <IconArrowUpRight className="h-4 w-4" />
                      ) : (
                        <IconArrowDownRight className="h-4 w-4" />
                      )}
                      {stat.trend}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activity & Stock Levels */}
            <div className="grid grid-cols-5 gap-6">
              {/* Recent Activity */}
              <div className="col-span-3 rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Recent Activity</h3>
                  <Button variant="outline" size="sm" className="h-8">
                    <IconRefresh className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      title: "Stock Adjustment",
                      description: "Arduino Nano - Quantity: +50",
                      time: "5 mins ago",
                      icon: IconBox,
                      color: "text-blue-500",
                    },
                    {
                      title: "Low Stock Alert",
                      description: "Raspberry Pi 4 - 5 units remaining",
                      time: "15 mins ago",
                      icon: IconAlertCircle,
                      color: "text-yellow-500",
                    },
                    {
                      title: "Order Received",
                      description: "Order #1234 from Supplier XYZ",
                      time: "1 hour ago",
                      icon: IconTruck,
                      color: "text-green-500",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.4 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-background"
                    >
                      <div className={cn("p-2 rounded-lg bg-card", item.color)}>
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{item.title}</p>
                          <span className="text-xs text-muted-foreground">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Stock Levels */}
              <div className="col-span-2 rounded-xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Stock Levels</h3>
                  <Button variant="outline" size="sm" className="h-8">
                    <IconFilter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      name: "Resistors",
                      current: 2500,
                      total: 3000,
                      percentage: 83,
                    },
                    {
                      name: "Capacitors",
                      current: 1200,
                      total: 2000,
                      percentage: 60,
                    },
                    {
                      name: "LEDs",
                      current: 800,
                      total: 1000,
                      percentage: 80,
                    },
                    {
                      name: "Arduino Boards",
                      current: 50,
                      total: 100,
                      percentage: 50,
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.6 + index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-muted-foreground">
                          {item.current}/{item.total}
                        </span>
                      </div>
                      <Progress value={item.percentage} className="h-2" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
