import { useQuery } from "@tanstack/react-query";

export interface IProduct {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  cost: number;
  quantity: number;
  category: string;
  supplier: string;
  status: "active" | "inactive" | "discontinued";
  createdAt: string;
  updatedAt: string;
}

// Sample data - replace with actual API call
const sampleProducts: IProduct[] = [
  {
    id: "1",
    name: "Laptop Pro",
    sku: "LAP-001",
    description: "High-performance laptop with 16GB RAM and 512GB SSD",
    price: 1299.99,
    cost: 899.99,
    quantity: 25,
    category: "Electronics",
    supplier: "Tech Supplies Inc",
    status: "active",
    createdAt: "2024-01-01",
    updatedAt: "2024-03-15",
  },
  {
    id: "2",
    name: "Wireless Mouse",
    sku: "ACC-002",
    description: "Ergonomic wireless mouse with long battery life",
    price: 29.99,
    cost: 15.99,
    quantity: 50,
    category: "Electronics",
    supplier: "Tech Supplies Inc",
    status: "active",
    createdAt: "2024-01-02",
    updatedAt: "2024-03-14",
  },
  {
    id: "3",
    name: "Office Chair",
    sku: "FUR-003",
    description: "Ergonomic office chair with lumbar support",
    price: 199.99,
    cost: 120.99,
    quantity: 15,
    category: "Furniture",
    supplier: "Office Solutions",
    status: "active",
    createdAt: "2024-01-03",
    updatedAt: "2024-03-13",
  },
  {
    id: "4",
    name: "Desk Lamp",
    sku: "ACC-004",
    description: "LED desk lamp with adjustable brightness",
    price: 49.99,
    cost: 25.99,
    quantity: 30,
    category: "Electronics",
    supplier: "Tech Supplies Inc",
    status: "active",
    createdAt: "2024-01-04",
    updatedAt: "2024-03-12",
  },
  {
    id: "5",
    name: "Old Model Phone",
    sku: "PHN-005",
    description: "Previous generation smartphone",
    price: 399.99,
    cost: 250.99,
    quantity: 10,
    category: "Electronics",
    supplier: "Tech Supplies Inc",
    status: "discontinued",
    createdAt: "2024-01-05",
    updatedAt: "2024-03-11",
  },
  {
    id: "6",
    name: "Coffee Maker",
    sku: "KIT-006",
    description: "Programmable coffee maker with thermal carafe",
    price: 79.99,
    cost: 45.99,
    quantity: 20,
    category: "Home & Kitchen",
    supplier: "Home Essentials",
    status: "active",
    createdAt: "2024-01-06",
    updatedAt: "2024-03-10",
  },
  {
    id: "7",
    name: "Notebook",
    sku: "OFF-007",
    description: "A5 size notebook with 100 pages",
    price: 9.99,
    cost: 4.99,
    quantity: 100,
    category: "Office Supplies",
    supplier: "Office Solutions",
    status: "inactive",
    createdAt: "2024-01-07",
    updatedAt: "2024-03-09",
  },
];

// Mock product data
const mockProducts = [
  { id: "all", name: "All Products" },
  { id: "prod-a", name: "Product A (SKU001)" },
  { id: "prod-b", name: "Product B (SKU002)" },
  { id: "prod-c", name: "Product C (SKU003)" },
  { id: "prod-d", name: "Product D (SKU004)" },
];

export function useProducts() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 400));
      return mockProducts;
    },
  });

  return {
    products,
    isLoading,
  };
}
