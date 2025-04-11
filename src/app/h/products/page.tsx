"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/dashboard/products-table";
import { IProduct } from "@/types/product";
import StatsCard from "@/components/ui/stats-card";

// Sample data - replace with actual data fetching
const sampleProducts: IProduct[] = [
  {
    id: "1",
    name: "Laptop Pro X1",
    sku: "LP-X1-2024",
    description: "High-performance laptop for professionals",
    category: "Electronics",
    price: 1299.99,
    cost: 899.99,
    quantity: 45,
    reorderPoint: 10,
    supplier: "TechSuppliers Inc",
    location: "Warehouse A",
    status: "active",
    lastRestocked: "2024-03-15",
    createdAt: "2024-01-01",
    updatedAt: "2024-03-15",
    tags: ["laptop", "professional", "high-performance"],
    specifications: {
      processor: "Intel i7",
      ram: "16GB",
      storage: "512GB SSD",
    },
  },
  {
    id: "2",
    name: "Office Chair Ergo",
    sku: "OC-E-2024",
    description: "Ergonomic office chair with lumbar support",
    category: "Furniture",
    price: 299.99,
    cost: 199.99,
    quantity: 8,
    reorderPoint: 15,
    supplier: "FurniCorp",
    location: "Warehouse B",
    status: "active",
    lastRestocked: "2024-02-15",
    createdAt: "2024-01-15",
    updatedAt: "2024-02-15",
    tags: ["chair", "ergonomic", "office"],
    specifications: {
      material: "Mesh",
      color: "Black",
      weight: "15kg",
    },
  },
  {
    id: "3",
    name: "Wireless Mouse",
    sku: "WM-2024",
    description: "Ergonomic wireless mouse",
    category: "Electronics",
    price: 49.99,
    cost: 29.99,
    quantity: 0,
    reorderPoint: 20,
    supplier: "TechSuppliers Inc",
    location: "Warehouse A",
    status: "inactive",
    lastRestocked: "2024-01-01",
    createdAt: "2024-01-01",
    updatedAt: "2024-03-01",
    tags: ["mouse", "wireless", "ergonomic"],
    specifications: {
      connectivity: "Bluetooth",
      battery: "AA",
      dpi: "1600",
    },
  },
];

export default function ProductsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">
            Manage your inventory products
          </p>
        </div>
        <Button onClick={() => router.push("/h/products/add")}>
          <IconPlus />
          Add Product
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Products"
          value="1,234"
          trend={{
            value: 12.5,
            isPositive: true,
          }}
          description="Growing inventory"
          subtitle="Compared to last month"
        />

        <StatsCard
          title="Low Stock Items"
          value="23"
          trend={{
            value: 20,
            isPositive: false,
          }}
          description="Below reorder point"
          subtitle="Requires immediate action"
          badge={<Badge variant="warning">Needs Attention</Badge>}
        />

        <StatsCard
          title="Out of Stock"
          value="5"
          trend={{
            value: 0,
            isPositive: false,
          }}
          description="Zero inventory"
          subtitle="Urgent restock needed"
          badge={<Badge variant="error">Critical</Badge>}
        />

        <StatsCard
          title="Total Value"
          value="$45,678"
          trend={{
            value: 8.3,
            isPositive: true,
          }}
          description="Inventory value"
          subtitle="Current stock value"
        />
      </div>

      {/* Products Table */}
      <ProductsTable data={sampleProducts} />
    </div>
  );
}
