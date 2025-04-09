import { useQuery } from "@tanstack/react-query";
import { IStock } from "@/types/stock";

// Sample data - replace with actual API call
const sampleStock: IStock[] = [
  {
    id: "1",
    productId: "1",
    productName: "Laptop Pro X1",
    sku: "LP-X1-2024",
    location: "Warehouse A",
    quantity: 45,
    reorderPoint: 10,
    unitCost: 899.99,
    totalValue: 40499.55,
    status: "in-stock",
    lastRestocked: "2024-03-15",
    createdAt: "2024-01-01",
    updatedAt: "2024-03-15",
    notes: "High-demand item",
  },
  {
    id: "2",
    productId: "2",
    productName: "Office Chair Ergo",
    sku: "OC-E-2024",
    location: "Warehouse B",
    quantity: 8,
    reorderPoint: 15,
    unitCost: 199.99,
    totalValue: 1599.92,
    status: "low-stock",
    lastRestocked: "2024-02-15",
    createdAt: "2024-01-15",
    updatedAt: "2024-02-15",
    notes: "Need to reorder soon",
  },
  {
    id: "3",
    productId: "3",
    productName: "Wireless Mouse",
    sku: "WM-2024",
    location: "Warehouse A",
    quantity: 0,
    reorderPoint: 20,
    unitCost: 29.99,
    totalValue: 0,
    status: "out-of-stock",
    lastRestocked: "2024-01-01",
    createdAt: "2024-01-01",
    updatedAt: "2024-03-01",
    notes: "Urgent restock needed",
  },
  {
    id: "4",
    productId: "4",
    productName: "Desk Lamp",
    sku: "DL-2024",
    location: "Warehouse A",
    quantity: 30,
    reorderPoint: 10,
    unitCost: 25.99,
    totalValue: 779.7,
    status: "in-stock",
    lastRestocked: "2024-03-10",
    createdAt: "2024-01-04",
    updatedAt: "2024-03-10",
  },
  {
    id: "5",
    productId: "5",
    productName: "Coffee Maker",
    sku: "CM-2024",
    location: "Warehouse B",
    quantity: 5,
    reorderPoint: 15,
    unitCost: 45.99,
    totalValue: 229.95,
    status: "low-stock",
    lastRestocked: "2024-02-28",
    createdAt: "2024-01-06",
    updatedAt: "2024-02-28",
    notes: "Low stock alert",
  },
];

export function useStock() {
  return useQuery({
    queryKey: ["stock"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return sampleStock;
    },
  });
}
