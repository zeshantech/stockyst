"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  IconChartBar,
  IconFolder,
  IconFolderCheck,
  IconFolderOff,
  IconPlus,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CategoriesTable } from "@/components/(private)/dashboard/categories/categories-table";
import { useCategories } from "@/hooks/use-categories";
import StatsCard from "@/components/(private)/dashboard/categories/stats-card";

export default function CategoriesPage() {
  const router = useRouter();
  const { data: categories, isLoading } = useCategories();

  // Calculate statistics
  const totalCategories = categories?.length || 0;
  const activeCategories =
    categories?.filter((c) => c.status === "active").length || 0;
  const inactiveCategories =
    categories?.filter((c) => c.status === "inactive").length || 0;
  const totalProducts =
    categories?.reduce((sum, c) => sum + c.productCount, 0) || 0;
  const averageProductsPerCategory =
    totalCategories > 0 ? totalProducts / totalCategories : 0;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-muted-foreground">
            Manage your product categories
          </p>
        </div>
        <Button onClick={() => router.push("/h/categories/add")}>
          <IconPlus />
          Add Category
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Categories"
          value={totalCategories}
          description="All categories in the system"
          icon={IconFolder}
        />
        <StatsCard
          title="Active Categories"
          value={activeCategories}
          description="Categories currently in use"
          icon={IconFolderCheck}
        />
        <StatsCard
          title="Inactive Categories"
          value={inactiveCategories}
          description="Categories not in use"
          icon={IconFolderOff}
        />
        <StatsCard
          title="Avg. Products/Category"
          value={averageProductsPerCategory.toFixed(1)}
          description="Average products per category"
          icon={IconChartBar}
        />
      </div>

      <CategoriesTable data={categories || []} />
    </div>
  );
}
