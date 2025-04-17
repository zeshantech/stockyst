import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  IStockAlert,
  CreateStockAlertParams,
  UpdateStockAlertParams,
  DeleteStockAlertParams,
  BulkDeleteStockAlertsParams,
} from "@/types/stock";

// Query key constants
const STOCK_ALERTS_KEYS = {
  all: ["stock-alerts"],
  detail: (id: string) => [...STOCK_ALERTS_KEYS.all, id],
};

// Mock data for development purposes
const mockStockAlerts: IStockAlert[] = [
  {
    id: "alert-1",
    stockId: "stock-1",
    productName: "Laptop Pro X1",
    sku: "LP-X1-2023",
    location: "Warehouse A",
    currentQuantity: 5,
    reorderPoint: 10,
    alertType: "low-stock",
    severity: "medium",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    notes: "Stock running low, consider reordering soon.",
  },
  {
    id: "alert-2",
    stockId: "stock-2",
    productName: "Wireless Mouse M500",
    sku: "WM-M500",
    location: "Warehouse B",
    currentQuantity: 0,
    reorderPoint: 5,
    alertType: "out-of-stock",
    severity: "high",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
    notes: "Item out of stock. Urgent order needed.",
  },
  {
    id: "alert-3",
    stockId: "stock-3",
    productName: "Monitor 27-inch 4K",
    sku: "MON-27-4K",
    location: "Warehouse A",
    currentQuantity: 8,
    reorderPoint: 5,
    alertType: "reorder-point",
    severity: "low",
    status: "resolved",
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    notes: "Stock replenished.",
  },
  {
    id: "alert-4",
    stockId: "stock-4",
    productName: "USB-C Cable 2m",
    sku: "USB-C-2M",
    location: "Warehouse C",
    currentQuantity: 3,
    reorderPoint: 10,
    alertType: "low-stock",
    severity: "medium",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36),
    notes: "Stock running low.",
  },
  {
    id: "alert-5",
    stockId: "stock-5",
    productName: "Wireless Keyboard K750",
    sku: "WK-K750",
    location: "Warehouse B",
    currentQuantity: 2,
    reorderPoint: 5,
    alertType: "low-stock",
    severity: "medium",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    notes: "Reorder soon.",
  },
  {
    id: "alert-6",
    stockId: "stock-6",
    productName: "Printer Ink Black",
    sku: "INK-BLK",
    location: "Warehouse A",
    currentQuantity: 0,
    reorderPoint: 3,
    alertType: "out-of-stock",
    severity: "high",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
    notes: "Completely out of stock.",
  },
  {
    id: "alert-7",
    stockId: "stock-7",
    productName: "External Hard Drive 2TB",
    sku: "EHD-2TB",
    location: "Warehouse C",
    currentQuantity: 12,
    reorderPoint: 5,
    alertType: "reorder-point",
    severity: "low",
    status: "dismissed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
    notes: "False alarm, no action needed.",
  },
  {
    id: "alert-8",
    stockId: "stock-8",
    productName: "Wireless Headphones",
    sku: "WH-PREMIUM",
    location: "Warehouse B",
    currentQuantity: 1,
    reorderPoint: 5,
    alertType: "low-stock",
    severity: "high",
    status: "active",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    notes: "High demand product, reorder immediately.",
  },
];

export function useStockAlerts() {
  const queryClient = useQueryClient();

  // Fetch all stock alerts
  const {
    data: stockAlerts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: STOCK_ALERTS_KEYS.all,
    queryFn: async () => {
      // TODO: Replace with actual API call when ready
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockStockAlerts;
    },
  });

  // Create a new stock alert
  const createStockAlert = useMutation({
    mutationFn: async (params: CreateStockAlertParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Mock creating a new alert
      const newAlert: IStockAlert = {
        id: `alert-${Date.now()}`,
        stockId: params.stockId,
        productName: "New Product", // In real implementation this would come from the stock item
        sku: "NEW-SKU", // In real implementation this would come from the stock item
        location: "Warehouse A", // In real implementation this would come from the stock item
        currentQuantity: 0, // In real implementation this would come from the stock item
        reorderPoint: 0, // In real implementation this would come from the stock item
        alertType: params.alertType,
        severity: "medium", // Default, may be determined by business logic
        status: "active",
        createdAt: new Date(),
        notes: params.notes || "",
      };

      return newAlert;
    },
    onSuccess: (data) => {
      // Invalidate the stock alerts query to refetch the data
      queryClient.invalidateQueries({ queryKey: STOCK_ALERTS_KEYS.all });
      toast.success("Alert created successfully");
    },
    onError: (error) => {
      console.error("Error creating stock alert:", error);
      toast.error("Failed to create alert");
    },
  });

  // Update an existing stock alert
  const updateStockAlert = useMutation({
    mutationFn: async (params: UpdateStockAlertParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      // In real implementation, update would be handled by the backend
      return params;
    },
    onSuccess: (data) => {
      // Invalidate the stock alerts query to refetch the data
      queryClient.invalidateQueries({ queryKey: STOCK_ALERTS_KEYS.all });

      // Update the specific alert in the cache for immediate UI updates
      queryClient.setQueriesData(
        { queryKey: STOCK_ALERTS_KEYS.all },
        (oldData: IStockAlert[] | undefined) => {
          if (!oldData) return [];

          return oldData.map((alert) =>
            alert.id === data.id
              ? { ...alert, ...data, updatedAt: new Date() }
              : alert
          );
        }
      );

      // Show success message
      if (data.status === "resolved") {
        toast.success("Alert marked as resolved");
      } else if (data.status === "dismissed") {
        toast.success("Alert dismissed");
      } else {
        toast.success("Alert updated successfully");
      }
    },
    onError: (error) => {
      console.error("Error updating stock alert:", error);
      toast.error("Failed to update alert");
    },
  });

  // Delete a stock alert
  const deleteStockAlert = useMutation({
    mutationFn: async (params: DeleteStockAlertParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      // In real implementation, deletion would be handled by the backend
      return params;
    },
    onSuccess: (data) => {
      // Invalidate the stock alerts query to refetch the data
      queryClient.invalidateQueries({ queryKey: STOCK_ALERTS_KEYS.all });

      // Update the cache for immediate UI updates
      queryClient.setQueriesData(
        { queryKey: STOCK_ALERTS_KEYS.all },
        (oldData: IStockAlert[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((alert) => alert.id !== data.id);
        }
      );

      toast.success("Alert deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting stock alert:", error);
      toast.error("Failed to delete alert");
    },
  });

  // Bulk delete stock alerts
  const bulkDeleteStockAlerts = useMutation({
    mutationFn: async (params: BulkDeleteStockAlertsParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In real implementation, bulk deletion would be handled by the backend
      return params;
    },
    onSuccess: (data) => {
      // Invalidate the stock alerts query to refetch the data
      queryClient.invalidateQueries({ queryKey: STOCK_ALERTS_KEYS.all });

      // Update the cache for immediate UI updates
      queryClient.setQueriesData(
        { queryKey: STOCK_ALERTS_KEYS.all },
        (oldData: IStockAlert[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((alert) => !data.ids.includes(alert.id));
        }
      );

      toast.success(`${data.ids.length} alerts deleted successfully`);
    },
    onError: (error) => {
      console.error("Error bulk deleting stock alerts:", error);
      toast.error("Failed to delete alerts");
    },
  });

  return {
    stockAlerts,
    isLoading,
    error,

    // CRUD operations
    createStockAlert: createStockAlert.mutate,
    updateStockAlert: updateStockAlert.mutate,
    deleteStockAlert: deleteStockAlert.mutate,
    bulkDeleteStockAlerts: bulkDeleteStockAlerts.mutate,

    // Loading states
    isCreatingStockAlert: createStockAlert.isPending,
    isUpdatingStockAlert: updateStockAlert.isPending,
    isDeletingStockAlert: deleteStockAlert.isPending,
    isBulkDeletingStockAlerts: bulkDeleteStockAlerts.isPending,
  };
}
