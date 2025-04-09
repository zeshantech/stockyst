import { useState, useEffect } from "react";

interface InventoryData {
  totalProducts: number;
  totalStock: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
  monthlyGrowth: number;
  monthlyData: {
    month: string;
    value: number;
    stock: number;
  }[];
}

export function useInventoryOverview() {
  const [data, setData] = useState<InventoryData>({
    totalProducts: 0,
    totalStock: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalValue: 0,
    monthlyGrowth: 0,
    monthlyData: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API call
        // This is mock data for demonstration
        const mockData: InventoryData = {
          totalProducts: 1250,
          totalStock: 15000,
          lowStockItems: 45,
          outOfStockItems: 12,
          totalValue: 250000,
          monthlyGrowth: 5.2,
          monthlyData: [
            { month: "Jan", value: 220000, stock: 12000 },
            { month: "Feb", value: 230000, stock: 12500 },
            { month: "Mar", value: 240000, stock: 13000 },
            { month: "Apr", value: 245000, stock: 14000 },
            { month: "May", value: 250000, stock: 15000 },
          ],
        };

        setData(mockData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch inventory data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  return { data, isLoading, error };
}
