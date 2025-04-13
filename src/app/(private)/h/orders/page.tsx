"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IconPlus, IconTruck, IconPackage } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrdersTable } from "@/components/(private)/dashboard/orders/orders-table";
import { useOrders } from "@/hooks/use-orders";
import StatsCard from "@/components/ui/stats-card";

export default function OrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const { data: orders = [] } = useOrders();

  // Filter orders based on status and search query
  const filteredOrders = React.useMemo(() => {
    let filtered = orders;

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerEmail.toLowerCase().includes(query) ||
          order.customerPhone.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [orders, selectedStatus, searchQuery]);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const processingOrders = orders.filter(
      (o) => o.status === "processing"
    ).length;
    const shippedOrders = orders.filter((o) => o.status === "shipped").length;
    const deliveredOrders = orders.filter(
      (o) => o.status === "delivered"
    ).length;
    const cancelledOrders = orders.filter(
      (o) => o.status === "cancelled"
    ).length;

    return {
      totalOrders,
      totalRevenue,
      avgOrderValue,
      pendingOrders,
      processingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
    };
  }, [orders]);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
  };

  // Handle add order
  const handleAddOrder = () => {
    router.push("/h/orders/add");
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage your customer orders</p>
        </div>
        <Button onClick={handleAddOrder}>
          <IconPlus />
          Add Order
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          trend={{
            value: 12.5,
            isPositive: true,
          }}
          description="Growing orders"
          subtitle="Compared to last month"
        />

        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          trend={{
            value: 8.3,
            isPositive: true,
          }}
          description="Average order value"
          subtitle={`$${stats.avgOrderValue.toFixed(2)} per order`}
          badge={
            <Badge variant="success">
              <IconPackage className="mr-1 size-4" />
              Revenue
            </Badge>
          }
        />

        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          trend={{
            value: 5.2,
            isPositive: true,
          }}
          description="Processing orders"
          subtitle={`${stats.processingOrders} in processing`}
          badge={
            <Badge variant="warning">
              <IconTruck className="mr-1 size-4" />
              Pending
            </Badge>
          }
        />

        <StatsCard
          title="Delivered Orders"
          value={stats.deliveredOrders}
          trend={{
            value: 15.8,
            isPositive: true,
          }}
          description="Shipped orders"
          subtitle={`${stats.shippedOrders} in transit`}
          badge={
            <Badge variant="success">
              <IconTruck className="mr-1 size-4" />
              Delivered
            </Badge>
          }
        />
      </div>

      <OrdersTable data={filteredOrders} />
    </div>
  );
}
