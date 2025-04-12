"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  IconBuilding,
  IconFilter,
  IconPlus,
  IconSearch,
  IconUsers,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SuppliersTable } from "@/components/(private)/dashboard/suppliers/suppliers-table";
import { useSuppliers } from "@/hooks/use-suppliers";
import StatsCard from "@/components/(private)/dashboard/suppliers/stats-card";

export default function SuppliersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const { data: suppliers = [], isLoading } = useSuppliers();

  const filteredSuppliers = React.useMemo(() => {
    return suppliers.filter((supplier) => {
      const matchesSearch =
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.phone.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || supplier.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [suppliers, searchQuery, selectedStatus]);

  const stats = React.useMemo(() => {
    const totalSuppliers = suppliers.length;
    const activeSuppliers = suppliers.filter(
      (supplier) => supplier.status === "active"
    ).length;
    const inactiveSuppliers = totalSuppliers - activeSuppliers;
    const averageProducts =
      totalSuppliers > 0
        ? suppliers.reduce((acc, supplier) => acc + supplier.products, 0) /
          totalSuppliers
        : 0;

    return {
      totalSuppliers,
      activeSuppliers,
      inactiveSuppliers,
      averageProducts: Math.round(averageProducts),
    };
  }, [suppliers]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your suppliers and their information
          </p>
        </div>
        <Button onClick={() => router.push("/h/suppliers/new")}>
          <IconPlus />
          Add Supplier
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Suppliers"
          value={stats.totalSuppliers}
          description="All registered suppliers"
          icon={IconBuilding}
        />
        <StatsCard
          title="Active Suppliers"
          value={stats.activeSuppliers}
          description="Currently active suppliers"
          icon={IconUsers}
        />
        <StatsCard
          title="Inactive Suppliers"
          value={stats.inactiveSuppliers}
          description="Currently inactive suppliers"
          icon={IconUsers}
        />
        <StatsCard
          title="Average Products"
          value={stats.averageProducts}
          description="Products per supplier"
          icon={IconBuilding}
        />
      </div>

      <SuppliersTable data={filteredSuppliers} />
    </div>
  );
}
