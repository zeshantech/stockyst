import { useQuery } from "@tanstack/react-query";
import { IStock } from "@/types/stock"; // Assuming IStock has necessary fields

// Mock data - Replace with actual API call logic
const mockStockData: IStock[] = [
  {
    id: "1",
    productId: "prod-a",
    productName: "Product A",
    sku: "SKU001",
    location: "wh1",
    quantity: 100,
    reorderPoint: 10,
    unitCost: 5.5,
    totalValue: 550,
    status: "in-stock",
    lastRestocked: new Date().toISOString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    productId: "prod-b",
    productName: "Product B",
    sku: "SKU002",
    location: "wh1",
    quantity: 50,
    reorderPoint: 5,
    unitCost: 12.0,
    totalValue: 600,
    status: "in-stock",
    lastRestocked: new Date().toISOString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    productId: "prod-a",
    productName: "Product A",
    sku: "SKU001",
    location: "st1",
    quantity: 25,
    reorderPoint: 10,
    unitCost: 5.5,
    totalValue: 137.5,
    status: "in-stock",
    lastRestocked: new Date().toISOString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    productId: "prod-c",
    productName: "Product C",
    sku: "SKU003",
    location: "wh2",
    quantity: 200,
    reorderPoint: 20,
    unitCost: 2.1,
    totalValue: 420,
    status: "in-stock",
    lastRestocked: new Date().toISOString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

interface InventoryValuationParams {
  locationId?: string;
  // Add other filters like date later
}

export interface InventoryValuationItem {
  productId: string;
  productName: string;
  sku: string;
  locationId: string; // Use location ID
  locationName: string; // Map from mockLocations or API
  quantity: number;
  unitCost: number;
  totalValue: number;
}

export interface InventoryValuationResult {
  items: InventoryValuationItem[];
  totalValue: number;
  generatedAt: string;
  filters: InventoryValuationParams;
}

// Helper to get location name (replace with better logic/API join)
const getLocationName = (id: string) => {
  const names: { [key: string]: string } = {
    wh1: "Warehouse 1",
    wh2: "Warehouse 2",
    st1: "Store 1",
    dc1: "Distribution Center 1",
  };
  return names[id] || id;
};

export function useInventoryValuation(params: InventoryValuationParams) {
  return useQuery<
    InventoryValuationResult,
    Error // Specify Error type
  >({
    queryKey: ["reports", "inventory-valuation", params],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 700));

      // Filter mock data based on location
      const filteredStock =
        params.locationId && params.locationId !== "all"
          ? mockStockData.filter((item) => item.location === params.locationId)
          : mockStockData;

      // Transform data
      const items: InventoryValuationItem[] = filteredStock.map((stock) => ({
        productId: stock.productId,
        productName: stock.productName,
        sku: stock.sku,
        locationId: stock.location,
        locationName: getLocationName(stock.location),
        quantity: stock.quantity,
        unitCost: stock.unitCost,
        totalValue: stock.totalValue,
      }));

      // Calculate total value
      const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);

      return {
        items,
        totalValue,
        generatedAt: new Date().toISOString(),
        filters: params,
      };
    },
    enabled: false, // Only run when refetch is called
    staleTime: Infinity, // Data is static for this example
  });
}
