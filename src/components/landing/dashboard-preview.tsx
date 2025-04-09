"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.6 }}
      className="mt-20 w-full max-w-7xl mx-auto relative z-10"
    >
      <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl blur-xl -z-10 animate-pulse"></div>
      <div className="relative rounded-xl shadow-2xl">
        {/* Browser Window Frame */}
        <div className="bg-gray-800 dark:bg-gray-900 rounded-t-xl p-3 flex items-center gap-2 border border-b-0 border-gray-700 dark:border-gray-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
          </div>
          <div className="flex-grow text-center">
            <div className="inline-block px-4 py-1 bg-gray-700 dark:bg-gray-800 rounded-md text-xs text-gray-300 dark:text-gray-400">
              app.inventree.com
            </div>
          </div>
        </div>
        {/* Dashboard Image */}
        <div className="rounded-b-xl border border-border overflow-hidden">
          <div className="bg-gradient-to-r from-background to-card">
            {/* Improved dashboard mockup with scrollable content */}
            <div className="h-[450px] sm:h-[500px] md:h-[600px] w-full bg-background relative overflow-hidden">
              {/* Dashboard header */}
              <DashboardHeader />

              <div className="overflow-y-auto h-[calc(100%-3.5rem)] overflow-x-hidden">
                {/* Dashboard content */}
                <div className="grid grid-cols-12 gap-2 sm:gap-4 p-3 sm:p-6">
                  {/* Sidebar */}
                  <DashboardSidebar />

                  {/* Main content area */}
                  <div className="col-span-12 sm:col-span-10">
                    <div className="space-y-4">
                      <WelcomeBanner />
                      <HeaderStats />
                      <StockCards />
                      <MainChart />
                      <RecentActivity />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardHeader() {
  return (
    <div className="h-14 border-b border-border flex items-center px-6 sticky top-0 bg-card dark:bg-card/80 z-20">
      <motion.div
        className="w-40 h-5 bg-primary/20 dark:bg-primary/30 rounded"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      ></motion.div>
      <div className="ml-auto flex items-center gap-3">
        <motion.div
          className="w-8 h-8 bg-primary/20 dark:bg-primary/30 rounded-full overflow-hidden flex items-center justify-center text-xs text-primary font-bold"
          whileHover={{ scale: 1.1 }}
        >
          US
        </motion.div>
        <div className="w-24 h-5 bg-muted dark:bg-muted/60 rounded"></div>
      </div>
    </div>
  );
}

function DashboardSidebar() {
  return (
    <div className="col-span-2 sticky top-0 h-[calc(100vh-3.5rem)] max-h-[500px] hidden sm:block">
      <div className="flex flex-col gap-2">
        <div className="w-full h-8 bg-primary/10 dark:bg-primary/20 rounded flex items-center px-3">
          <div className="w-4 h-4 bg-primary/60 dark:bg-primary/80 rounded mr-3"></div>
          <div className="w-16 h-4 bg-primary/20 dark:bg-primary/30 rounded"></div>
        </div>
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.1 }}
            whileHover={{
              x: 3,
              backgroundColor: "var(--color-accent)",
            }}
            className="w-full h-8 bg-muted dark:bg-muted/40 rounded flex items-center px-3 cursor-pointer"
          >
            <div className="w-4 h-4 bg-muted-foreground/30 dark:bg-muted-foreground/40 rounded mr-3"></div>
            <div className="w-14 h-4 bg-muted-foreground/20 dark:bg-muted-foreground/30 rounded"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WelcomeBanner() {
  return (
    <motion.div
      className="w-full bg-gradient-to-r from-primary to-primary/70 dark:from-primary/80 dark:to-primary/50 rounded-xl p-4 sm:p-6 text-primary-foreground"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="h-5 w-48 bg-primary-foreground/30 rounded mb-1"></div>
          <div className="h-3 w-64 bg-primary-foreground/20 rounded"></div>
          <div className="h-3 w-32 bg-primary-foreground/20 rounded mt-1"></div>
        </div>
        <motion.div
          className="bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground px-3 py-1 rounded-lg text-xs font-medium cursor-pointer hover:bg-primary-foreground/30"
          whileHover={{
            scale: 1.05,
          }}
        >
          View Reports
        </motion.div>
      </div>
    </motion.div>
  );
}

function HeaderStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
      {[
        { title: "Total Items", value: "1,234", trend: "+12%", delay: 1.1 },
        { title: "Active Orders", value: "56", trend: "+5%", delay: 1.2 },
        {
          title: "Low Stock",
          value: "23",
          trend: "-8%",
          delay: 1.3,
          isNegative: true,
        },
        { title: "This Month", value: "$12.5k", trend: "+18%", delay: 1.4 },
      ].map((item, index) => (
        <StatCard
          key={index}
          title={item.title}
          value={item.value}
          trend={item.trend}
          isNegative={item.isNegative}
          delay={item.delay}
        />
      ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  trend,
  isNegative,
  delay,
}: {
  title: string;
  value: string;
  trend: string;
  isNegative?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      className="col-span-1 rounded-lg border border-border p-4 bg-card dark:bg-card/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="text-xs text-muted-foreground mb-1">{title}</div>
      <div className="text-xl font-semibold mb-1">{value}</div>
      <div
        className={`text-xs flex items-center ${
          isNegative
            ? "text-red-500 dark:text-red-400"
            : "text-green-600 dark:text-green-400"
        }`}
      >
        <span className="mr-1">{trend}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`${isNegative ? "rotate-180" : ""}`}
        >
          <path
            d="M8 4L12 8L10.6 9.4L9 7.8V12H7V7.8L5.4 9.4L4 8L8 4Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </motion.div>
  );
}

function StockCards() {
  const stockItems = [
    {
      name: "Resistor 10k",
      category: "Electronic Components",
      qty: 258,
      status: "In Stock",
      colorScheme: "success",
    },
    {
      name: "Capacitor 100uF",
      category: "Electronic Components",
      qty: 15,
      status: "Low Stock",
      colorScheme: "warning",
    },
    {
      name: "Transistor BC547",
      category: "Electronic Components",
      qty: 0,
      status: "Out of Stock",
      colorScheme: "error",
    },
    {
      name: "LED 5mm Red",
      category: "Electronic Components",
      qty: 125,
      status: "In Stock",
      colorScheme: "success",
    },
    {
      name: "Arduino Nano",
      category: "Microcontrollers",
      qty: 32,
      status: "In Stock",
      colorScheme: "success",
    },
    {
      name: "Servo Motor SG90",
      category: "Motors",
      qty: 9,
      status: "Low Stock",
      colorScheme: "warning",
    },
  ];

  const statusStyles = {
    success:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    warning:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    error: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-medium">Stock Items</div>
        <motion.div
          className="text-xs text-primary bg-primary/10 px-2 py-1 rounded cursor-pointer dark:bg-primary/20"
          whileHover={{ backgroundColor: "var(--color-accent)" }}
        >
          View all
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {stockItems.map((item, idx) => (
          <motion.div
            className="col-span-1 rounded-lg border border-border p-4 bg-card dark:bg-card/40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            whileHover={{
              y: -6,
              x: -6,
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              borderColor: "var(--color-primary)",
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-sm">{item.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {item.category}
                </div>
              </div>
              <div
                className={`text-xs px-2 py-1 rounded-full ${
                  statusStyles[item.colorScheme as keyof typeof statusStyles]
                }`}
              >
                {item.status}
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm">
                <span className="font-semibold">{item.qty}</span>
                <span className="text-muted-foreground ml-1">units</span>
              </div>
              <motion.button
                className="text-xs bg-muted hover:bg-muted/80 dark:bg-muted/40 dark:hover:bg-muted/60 px-2 py-1 rounded"
                whileHover={{
                  backgroundColor: "var(--color-accent)",
                }}
              >
                Details
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function MainChart() {
  return (
    <motion.div
      className="w-full bg-card dark:bg-card/60 border border-border rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.0 }}
      whileHover={{
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-48 h-5 bg-muted dark:bg-muted/60 rounded"></div>
        <div className="flex gap-2">
          <motion.div
            className="w-24 h-8 bg-primary/10 dark:bg-primary/20 rounded cursor-pointer flex items-center justify-center text-primary text-xs font-medium"
            whileHover={{ backgroundColor: "var(--color-accent)" }}
          >
            Last 7 days
          </motion.div>
          <motion.div
            className="w-24 h-8 bg-muted dark:bg-muted/40 rounded cursor-pointer flex items-center justify-center text-muted-foreground text-xs font-medium"
            whileHover={{ backgroundColor: "var(--color-accent)" }}
          >
            Last month
          </motion.div>
        </div>
      </div>
      <div className="h-[180px] w-full bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-lg flex items-end px-2">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="h-[10%] sm:h-[15%] md:h-[20%] lg:h-[25%] bg-primary dark:bg-primary/80 w-full mx-0.5 rounded-t-sm relative group"
            initial={{ height: "0%" }}
            animate={{
              height: `${15 + Math.random() * 60}%`,
            }}
            transition={{
              delay: 2.1 + i * 0.05,
              duration: 0.7,
              ease: "easeOut",
            }}
            whileHover={{ opacity: 0.8 }}
          >
            <motion.div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground dark:bg-primary/80 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 whitespace-nowrap"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              {Math.floor(15 + Math.random() * 60)} items
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function RecentActivity() {
  const activities = [
    {
      action: "Stock adjustment",
      item: "Arduino Nano",
      user: "David K.",
      time: "10 min ago",
    },
    {
      action: "New order",
      item: "Order #45621",
      user: "System",
      time: "25 min ago",
    },
    {
      action: "Item added",
      item: "Raspberry Pi 4",
      user: "Sarah T.",
      time: "1 hour ago",
    },
    {
      action: "Stock count",
      item: "Electronic parts",
      user: "James P.",
      time: "3 hours ago",
    },
  ];

  return (
    <motion.div
      className="w-full bg-card dark:bg-card/60 border border-border rounded-lg p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2 }}
      whileHover={{
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-medium">Recent Activity</div>
        <motion.div
          className="text-xs text-primary bg-primary/10 dark:bg-primary/20 px-2 py-1 rounded cursor-pointer"
          whileHover={{ backgroundColor: "var(--color-accent)" }}
        >
          View all
        </motion.div>
      </div>
      <div className="space-y-3">
        {activities.map((item, idx) => (
          <motion.div
            key={idx}
            className="flex items-center gap-3 p-2 bg-card dark:bg-card/40 rounded-md cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ backgroundColor: "var(--color-accent)" }}
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-xs text-primary">
              {item.user.split(" ")[0][0]}
              {item.user.split(" ").length > 1
                ? item.user.split(" ")[1][0]
                : ""}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{item.action}</div>
                <div className="text-xs text-muted-foreground">{item.time}</div>
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {item.item}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
