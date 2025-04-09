import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  IStockAlert,
  CreateStockAlertParams,
  UpdateStockAlertParams,
  DeleteStockAlertParams,
  BulkDeleteStockAlertsParams,
} from "@/types/stock";

// Mock data for development
const mockStockAlerts: IStockAlert[] = [
  {
    id: "1",
    stockId: "1",
    productName: "Product A",
    sku: "SKU001",
    location: "Warehouse 1",
    currentQuantity: 5,
    reorderPoint: 10,
    alertType: "low-stock",
    severity: "medium",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    stockId: "2",
    productName: "Product B",
    sku: "SKU002",
    location: "Warehouse 2",
    currentQuantity: 0,
    reorderPoint: 5,
    alertType: "out-of-stock",
    severity: "high",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

export function useStockAlerts() {
  const queryClient = useQueryClient();

  const { data: stockAlerts = [], isLoading } = useQuery({
    queryKey: ["stock-alerts"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return mockStockAlerts;
    },
  });

  const createStockAlert = useMutation({
    mutationFn: async (params: CreateStockAlertParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id: "new-id", ...params };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-alerts"] });
      toast.success("Stock alert created successfully");
    },
    onError: (error) => {
      console.error("Error creating stock alert:", error);
      toast.error("Failed to create stock alert");
    },
  });

  const updateStockAlert = useMutation({
    mutationFn: async (params: UpdateStockAlertParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return params;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-alerts"] });
      toast.success("Stock alert updated successfully");
    },
    onError: (error) => {
      console.error("Error updating stock alert:", error);
      toast.error("Failed to update stock alert");
    },
  });

  const deleteStockAlert = useMutation({
    mutationFn: async (params: DeleteStockAlertParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return params;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-alerts"] });
      toast.success("Stock alert deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting stock alert:", error);
      toast.error("Failed to delete stock alert");
    },
  });

  const bulkDeleteStockAlerts = useMutation({
    mutationFn: async (params: BulkDeleteStockAlertsParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return params;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-alerts"] });
      toast.success("Stock alerts deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting stock alerts:", error);
      toast.error("Failed to delete stock alerts");
    },
  });

  return {
    stockAlerts,
    isLoading,
    createStockAlert,
    updateStockAlert,
    deleteStockAlert,
    bulkDeleteStockAlerts,
  };
}
