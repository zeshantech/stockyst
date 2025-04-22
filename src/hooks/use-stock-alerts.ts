import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  IStockAlert,
  CreateStockAlertParams,
  UpdateStockAlertParams,
  DeleteStockAlertParams,
  BulkDeleteStockAlertsParams,
} from "@/types/stock";
import { AlertRule, AlertRuleFormData } from "@/types/stock-alerts";

// Query key constants
const STOCK_ALERTS_KEYS = {
  all: ["stock-alerts"],
  detail: (id: string) => [...STOCK_ALERTS_KEYS.all, id],
  rules: ["stock-alert-rules"],
  ruleDetail: (id: string) => [...STOCK_ALERTS_KEYS.rules, id],
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
    resolvedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toString(),
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

// Mock data for alert rules
const mockAlertRules: AlertRule[] = [
  {
    id: "rule-1",
    name: "Low Stock Alert",
    description: "Alert when stock falls below reorder point",
    condition: {
      type: "stock_level",
      operator: "less_than",
      value: 10,
    },
    products: {
      type: "all",
    },
    notificationChannels: ["email", "browser"],
    isActive: true,
    createdAt: new Date("2023-05-15T10:30:00Z"),
  },
  {
    id: "rule-2",
    name: "Out of Stock Alert",
    description: "Alert when stock reaches zero",
    condition: {
      type: "stock_level",
      operator: "equals",
      value: 0,
    },
    products: {
      type: "category",
      categoryIds: ["electronics", "office-supplies"],
    },
    notificationChannels: ["email", "slack", "browser"],
    isActive: true,
    createdAt: new Date("2023-06-20T14:45:00Z"),
  },
  {
    id: "rule-3",
    name: "Aging Inventory Alert",
    description: "Alert when products are in stock for too long",
    condition: {
      type: "stock_age",
      operator: "greater_than",
      value: 90,
    },
    products: {
      type: "specific",
      ids: ["prod-123", "prod-456", "prod-789"],
    },
    notificationChannels: ["email"],
    isActive: true,
    createdAt: new Date("2023-07-05T09:15:00Z"),
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

  // Fetch all alert rules
  const {
    data: alertRules = [],
    isLoading: isLoadingRules,
    error: rulesError,
  } = useQuery({
    queryKey: STOCK_ALERTS_KEYS.rules,
    queryFn: async () => {
      // TODO: Replace with actual API call when ready
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return mockAlertRules;
    },
  });

  // Create a new alert rule
  const createAlertRule = useMutation({
    mutationFn: async (params: Omit<AlertRule, "id" | "createdAt">) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Mock creating a new alert rule
      const newRule: AlertRule = {
        id: `rule-${Date.now()}`,
        createdAt: new Date(),
        ...params,
      };

      return newRule;
    },
    onSuccess: (data) => {
      // Invalidate the alert rules query to refetch the data
      queryClient.invalidateQueries({ queryKey: STOCK_ALERTS_KEYS.rules });
      toast.success("Alert rule created successfully");
    },
    onError: (error) => {
      console.error("Error creating alert rule:", error);
      toast.error("Failed to create alert rule");
    },
  });

  // Update an existing alert rule
  const updateAlertRule = useMutation({
    mutationFn: async (params: AlertRule) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      // In real implementation, update would be handled by the backend
      return params;
    },
    onSuccess: (data) => {
      // Invalidate the alert rules query to refetch the data
      queryClient.invalidateQueries({ queryKey: STOCK_ALERTS_KEYS.rules });

      // Update the specific rule in the cache for immediate UI updates
      queryClient.setQueriesData(
        { queryKey: STOCK_ALERTS_KEYS.rules },
        (oldData: AlertRule[] | undefined) => {
          if (!oldData) return [];

          return oldData.map((rule) =>
            rule.id === data.id
              ? { ...rule, ...data, updatedAt: new Date() }
              : rule
          );
        }
      );

      toast.success("Alert rule updated successfully");
    },
    onError: (error) => {
      console.error("Error updating alert rule:", error);
      toast.error("Failed to update alert rule");
    },
  });

  // Delete an alert rule
  const deleteAlertRule = useMutation({
    mutationFn: async (id: string) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 600));

      // In real implementation, deletion would be handled by the backend
      return { id };
    },
    onSuccess: (data) => {
      // Invalidate the alert rules query to refetch the data
      queryClient.invalidateQueries({ queryKey: STOCK_ALERTS_KEYS.rules });

      // Update the cache for immediate UI updates
      queryClient.setQueriesData(
        { queryKey: STOCK_ALERTS_KEYS.rules },
        (oldData: AlertRule[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((rule) => rule.id !== data.id);
        }
      );

      toast.success("Alert rule deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting alert rule:", error);
      toast.error("Failed to delete alert rule");
    },
  });

  // Toggle alert rule active status
  const toggleAlertRuleStatus = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 400));

      // In real implementation, toggle would be handled by the backend
      return { id, isActive };
    },
    onSuccess: (data) => {
      // Invalidate the alert rules query to refetch the data
      queryClient.invalidateQueries({ queryKey: STOCK_ALERTS_KEYS.rules });

      // Update the cache for immediate UI updates
      queryClient.setQueriesData(
        { queryKey: STOCK_ALERTS_KEYS.rules },
        (oldData: AlertRule[] | undefined) => {
          if (!oldData) return [];
          return oldData.map((rule) =>
            rule.id === data.id ? { ...rule, isActive: data.isActive } : rule
          );
        }
      );

      toast.success(
        `Alert rule ${data.isActive ? "activated" : "deactivated"} successfully`
      );
    },
    onError: (error) => {
      console.error("Error toggling alert rule status:", error);
      toast.error("Failed to update alert rule status");
    },
  });

  // Test an alert rule
  const testAlertRule = useMutation({
    mutationFn: async (ruleId: string) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock test result
      return {
        ruleId,
        success: true,
        triggeredItems: [
          {
            productId: "prod-123",
            productName: "Test Product 1",
            currentValue: 5,
            thresholdValue: 10,
          },
          {
            productId: "prod-456",
            productName: "Test Product 2",
            currentValue: 0,
            thresholdValue: 5,
          },
        ],
      };
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(
          `Test successful. Rule would trigger for ${data.triggeredItems.length} items.`
        );
      } else {
        toast.info("Test completed. No items would trigger this rule.");
      }
    },
    onError: (error) => {
      console.error("Error testing alert rule:", error);
      toast.error("Failed to test alert rule");
    },
  });

  // Bulk delete alert rules
  const bulkDeleteAlertRules = useMutation({
    mutationFn: async (ids: string[]) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // In real implementation, bulk deletion would be handled by the backend
      return { ids };
    },
    onSuccess: (data) => {
      // Invalidate the alert rules query to refetch the data
      queryClient.invalidateQueries({ queryKey: STOCK_ALERTS_KEYS.rules });

      // Update the cache for immediate UI updates
      queryClient.setQueriesData(
        { queryKey: STOCK_ALERTS_KEYS.rules },
        (oldData: AlertRule[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((rule) => !data.ids.includes(rule.id));
        }
      );

      toast.success(`${data.ids.length} alert rules deleted successfully`);
    },
    onError: (error) => {
      console.error("Error bulk deleting alert rules:", error);
      toast.error("Failed to delete alert rules");
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

    // Alert rules
    alertRules,
    isLoadingRules,
    rulesError,
    createAlertRule: createAlertRule.mutate,
    updateAlertRule: updateAlertRule.mutate,
    deleteAlertRule: deleteAlertRule.mutate,
    toggleAlertRuleStatus: toggleAlertRuleStatus.mutate,
    testAlertRule: testAlertRule.mutate,
    bulkDeleteAlertRules: bulkDeleteAlertRules.mutate,
    isCreatingAlertRule: createAlertRule.isPending,
    isUpdatingAlertRule: updateAlertRule.isPending,
    isDeletingAlertRule: deleteAlertRule.isPending,
    isTogglingAlertRuleStatus: toggleAlertRuleStatus.isPending,
    isTestingAlertRule: testAlertRule.isPending,
    isBulkDeletingAlertRules: bulkDeleteAlertRules.isPending,
  };
}
