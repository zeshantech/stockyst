import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  IStock,
  IStockCount,
  IStockAlert,
  CreateStockParams,
  UpdateStockParams,
  DeleteStockParams,
  BulkDeleteStockParams,
  BulkUploadStockParams,
  CreateStockCountParams,
  UpdateStockCountParams,
  CreateStockTransferParams,
  UpdateStockTransferParams,
  CreateStockAdjustmentParams,
  UpdateStockAdjustmentParams,
} from "@/types/stock";

// Query keys for stock data
export const STOCK_QUERY_KEYS = {
  ALL: ["stock"],
  DETAIL: (id: string) => ["stock", id],
  COUNTS: ["stock", "counts"],
  COUNT_DETAIL: (id: string) => ["stock", "counts", id],
  TRANSFERS: ["stock", "transfers"],
  TRANSFER_DETAIL: (id: string) => ["stock", "transfers", id],
  ADJUSTMENTS: ["stock", "adjustments"],
  ADJUSTMENT_DETAIL: (id: string) => ["stock", "adjustments", id],
  ALERTS: ["stock", "alerts"],
  ALERT_DETAIL: (id: string) => ["stock", "alerts", id],
  EXPIRY: ["stock", "expiry"],
  BATCHES: ["stock", "batches"],
  SERIALS: ["stock", "serials"],
  LEVELS: ["stock", "levels"],
  STATISTICS: ["stock", "statistics"],
  LOCATIONS: ["stock", "locations"],
};

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
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-03-15"),
    notes: "High-demand item",
    batchNumber: "BATCH-001",
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
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-15"),
    notes: "Need to reorder soon",
    batchNumber: "BATCH-002",
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
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-03-01"),
    notes: "Urgent restock needed",
    batchNumber: "BATCH-002",
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
    createdAt: new Date("2024-01-04"),
    updatedAt: new Date("2024-03-10"),
    batchNumber: "BATCH-002",
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
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-02-28"),
    notes: "Low stock alert",
    batchNumber: "BATCH-001",
  },
];

// Sample stock counts
const sampleStockCounts: IStockCount[] = [
  {
    id: "1",
    countNumber: "SC-001",
    status: "completed",
    scheduledDate: "2024-03-01",
    completedDate: "2024-03-02",
    locationId: "1",
    locationName: "Warehouse A",
    countedBy: "John Doe",
    notes: "Regular monthly count",
    items: [
      {
        id: "1",
        countId: "1",
        stockId: "1",
        productName: "Laptop Pro X1",
        sku: "LP-X1-2024",
        expectedQuantity: 45,
        actualQuantity: 44,
        discrepancy: -1,
        notes: "One unit may be misplaced",
      },
      {
        id: "2",
        countId: "1",
        stockId: "3",
        productName: "Wireless Mouse",
        sku: "WM-2024",
        expectedQuantity: 0,
        actualQuantity: 2,
        discrepancy: 2,
        notes: "Found in different location",
      },
    ],
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-02"),
  },
  {
    id: "2",
    countNumber: "SC-002",
    status: "in-progress",
    scheduledDate: "2024-04-01",
    locationId: "2",
    locationName: "Warehouse B",
    countedBy: "Jane Smith",
    notes: "Quarterly audit",
    items: [],
    createdAt: new Date("2024-03-25"),
    updatedAt: new Date("2024-03-25"),
  },
];

// Sample stock alerts
const sampleStockAlerts: IStockAlert[] = [
  {
    id: "1",
    stockId: "2",
    productName: "Office Chair Ergo",
    sku: "OC-E-2024",
    location: "Warehouse B",
    currentQuantity: 8,
    reorderPoint: 15,
    alertType: "low-stock",
    severity: "medium",
    status: "active",
    createdAt: new Date("2024-02-16"),
    updatedAt: new Date("2024-02-16"),
    notes: "Need to reorder soon",
  },
  {
    id: "2",
    stockId: "3",
    productName: "Wireless Mouse",
    sku: "WM-2024",
    location: "Warehouse A",
    currentQuantity: 0,
    reorderPoint: 20,
    alertType: "out-of-stock",
    severity: "high",
    status: "active",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-01"),
    notes: "Urgent restock needed",
  },
];

// Sample locations
const sampleLocations = [
  { id: "1", name: "Warehouse A" },
  { id: "2", name: "Warehouse B" },
  { id: "3", name: "Store Front" },
  { id: "4", name: "Distribution Center" },
];

/**
 * Comprehensive hook for stock management
 * Combines data querying and mutation functionality
 */
export function useStocks() {
  const queryClient = useQueryClient();
  const isAuthenticated = true; // TODO: make this dynamic

  // ===== DATA QUERIES =====

  // Query for all stock items
  const allStockQuery = useQuery({
    queryKey: STOCK_QUERY_KEYS.ALL,
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return sampleStock;
    },
    enabled: isAuthenticated,
  });

  // Query for stock counts
  const stockCountsQuery = useQuery({
    queryKey: STOCK_QUERY_KEYS.COUNTS,
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      return sampleStockCounts;
    },
    enabled: isAuthenticated,
  });

  // Query for stock alerts
  const stockAlertsQuery = useQuery({
    queryKey: STOCK_QUERY_KEYS.ALERTS,
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      return sampleStockAlerts;
    },
    enabled: isAuthenticated,
  });

  // Query for locations
  const locationsQuery = useQuery({
    queryKey: STOCK_QUERY_KEYS.LOCATIONS,
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return sampleLocations;
    },
    enabled: isAuthenticated,
  });

  // Query for stock statistics
  const statisticsQuery = useQuery({
    queryKey: STOCK_QUERY_KEYS.STATISTICS,
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Calculate statistics from stock data
      const totalItems = sampleStock.length;
      const totalValue = sampleStock.reduce(
        (sum, item) => sum + item.totalValue,
        0
      );
      const lowStockItems = sampleStock.filter(
        (item) => item.quantity <= item.reorderPoint
      ).length;
      const outOfStockItems = sampleStock.filter(
        (item) => item.quantity === 0
      ).length;

      // Previous month data (for comparison)
      const prevMonthTotalItems = 950;
      const prevMonthTotalValue = 44000;
      const prevMonthLowStockItems = 15;
      const prevMonthOutOfStockItems = 5;

      // Calculate trends compared to last month
      const totalItemsTrend = totalItems - prevMonthTotalItems;
      const totalValueTrend = totalValue - prevMonthTotalValue;
      const lowStockItemsTrend = lowStockItems - prevMonthLowStockItems;
      const outOfStockItemsTrend = outOfStockItems - prevMonthOutOfStockItems;

      return {
        totalItems: {
          count: totalItems,
          isPositive: totalItemsTrend >= 0,
        },
        totalValue: {
          count: totalValue,
          isPositive: totalValueTrend >= 0,
        },
        lowStockItems: {
          count: lowStockItems,
          isPositive: lowStockItemsTrend <= 0, // Fewer low stock items is positive
        },
        outOfStockItems: {
          count: outOfStockItems,
          isPositive: outOfStockItemsTrend <= 0, // Fewer out of stock items is positive
        },
        monthlyData: [
          { month: "Jan", value: 38000, stock: 950 },
          { month: "Feb", value: 39500, stock: 1000 },
          { month: "Mar", value: 41000, stock: 1050 },
          { month: "Apr", value: 42500, stock: 1100 },
          { month: "May", value: 44000, stock: 1150 },
          { month: "Jun", value: totalValue, stock: totalItems },
        ],
      };
    },
    enabled: isAuthenticated,
  });

  // Function to get a specific stock item by ID
  const getStockById = (id: string): IStock | undefined => {
    return allStockQuery.data?.find((item) => item.id === id);
  };

  // Function to query a specific stock item
  const useStockById = (id: string) => {
    return useQuery({
      queryKey: STOCK_QUERY_KEYS.DETAIL(id),
      queryFn: async () => {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        const stock = sampleStock.find((item) => item.id === id);
        if (stock) {
          return stock;
        }
        throw new Error(`Stock item with ID ${id} not found`);
      },
      enabled: isAuthenticated && !!id,
    });
  };

  // Function to get a specific stock count by ID
  const useStockCountById = (id: string) => {
    return useQuery({
      queryKey: STOCK_QUERY_KEYS.COUNT_DETAIL(id),
      queryFn: async () => {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 800));
        const count = sampleStockCounts.find((count) => count.id === id);
        if (count) {
          return count;
        }
        throw new Error(`Stock count with ID ${id} not found`);
      },
      enabled: isAuthenticated && !!id,
    });
  };

  // ===== MUTATIONS =====

  // Create stock item
  const createStock = useMutation({
    mutationFn: async (params: CreateStockParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a new stock item
      const newStock: IStock = {
        id: `stock-${Date.now()}`,
        productId: params.productId,
        productName: "New Product", // This would be fetched from product data
        sku: "SKU-123", // This would be fetched from product data
        location: params.location,
        quantity: params.quantity,
        reorderPoint: params.reorderPoint,
        unitCost: params.unitCost,
        totalValue: params.quantity * params.unitCost,
        status:
          params.quantity === 0
            ? "out-of-stock"
            : params.quantity <= params.reorderPoint
            ? "low-stock"
            : "in-stock",
        lastRestocked: new Date().toISOString(),
        createdAt: new Date(),
        updatedAt: new Date(),
        expiryDate: params.expiryDate,
        batchNumber: params.batchNumber,
        serialNumbers: params.serialNumbers,
        notes: params.notes,
      };

      return newStock;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.STATISTICS });
      toast.success("Stock item created successfully");
    },
    onError: (error) => {
      console.error("Error creating stock item:", error);
      toast.error("Failed to create stock item");
    },
  });

  // Update stock item
  const updateStock = useMutation({
    mutationFn: async (params: UpdateStockParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real application, we would get the current stock item and update it
      return { ...params };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({
        queryKey: STOCK_QUERY_KEYS.DETAIL(data.id),
      });
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.STATISTICS });
      toast.success("Stock item updated successfully");

      // Check if we need to create stock alerts
      if (data.quantity !== undefined) {
        const stockItems =
          queryClient.getQueryData<IStock[]>(STOCK_QUERY_KEYS.ALL) || [];
        const stockItem = stockItems.find((item) => item.id === data.id);

        if (stockItem) {
          // Create alerts based on stock level
          if (data.quantity === 0) {
            // Out of stock logic
          } else if (data.quantity <= stockItem.reorderPoint) {
            // Low stock logic
          }
        }
      }
    },
    onError: (error) => {
      console.error("Error updating stock item:", error);
      toast.error("Failed to update stock item");
    },
  });

  // Delete stock item
  const deleteStock = useMutation({
    mutationFn: async ({ id }: DeleteStockParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.STATISTICS });
      toast.success("Stock item deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting stock item:", error);
      toast.error("Failed to delete stock item");
    },
  });

  // Bulk delete stock items
  const bulkDeleteStock = useMutation({
    mutationFn: async ({ ids }: BulkDeleteStockParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ids };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.STATISTICS });
      toast.success("Stock items deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting stock items:", error);
      toast.error("Failed to delete stock items");
    },
  });

  // Update stock quantity
  const updateStockQuantity = useMutation({
    mutationFn: async ({ id, quantity, notes }: UpdateStockParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id, quantity, notes };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({
        queryKey: STOCK_QUERY_KEYS.DETAIL(data.id),
      });
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.STATISTICS });
      toast.success("Stock quantity updated successfully");

      // Check if we need to create stock alerts based on the new quantity
      if (data.quantity !== undefined) {
        const stockItems =
          queryClient.getQueryData<IStock[]>(STOCK_QUERY_KEYS.ALL) || [];
        const stockItem = stockItems.find((item) => item.id === data.id);

        if (stockItem) {
          // Create alerts based on stock level
          if (data.quantity === 0) {
            // Out of stock logic
          } else if (data.quantity <= stockItem.reorderPoint) {
            // Low stock logic
          }
        }
      }
    },
    onError: (error) => {
      console.error("Error updating stock quantity:", error);
      toast.error("Failed to update stock quantity");
    },
  });

  // Update stock location
  const updateStockLocation = useMutation({
    mutationFn: async ({ id, location }: UpdateStockParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id, location };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({
        queryKey: STOCK_QUERY_KEYS.DETAIL(data.id),
      });
      toast.success("Stock location updated successfully");
    },
    onError: (error) => {
      console.error("Error updating stock location:", error);
      toast.error("Failed to update stock location");
    },
  });

  // Bulk upload stock items
  const bulkUploadStock = useMutation({
    mutationFn: async ({ formData }: BulkUploadStockParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.STATISTICS });
      toast.success("Stock items uploaded successfully");
    },
    onError: (error) => {
      console.error("Error uploading stock items:", error);
      toast.error("Failed to upload stock items");
    },
  });

  // Create stock count
  const createStockCount = useMutation({
    mutationFn: async (params: CreateStockCountParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        id: `count-${Date.now()}`,
        countNumber: `SC-${Date.now().toString().substring(7)}`,
        status: "draft",
        scheduledDate: params.scheduledDate,
        locationId: params.locationId,
        locationName: "Sample Location", // This would be fetched from locations
        countedBy: "Current User", // This would be the current user
        notes: params.notes,
        items: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.COUNTS });
      toast.success("Stock count created successfully");
    },
    onError: (error) => {
      console.error("Error creating stock count:", error);
      toast.error("Failed to create stock count");
    },
  });

  // Update stock count
  const updateStockCount = useMutation({
    mutationFn: async (params: UpdateStockCountParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ...params };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.COUNTS });
      queryClient.invalidateQueries({
        queryKey: STOCK_QUERY_KEYS.COUNT_DETAIL(data.id),
      });
      toast.success("Stock count updated successfully");

      // If count is completed, update stock quantities based on count results
      if (data.status === "completed" && data.items && data.items.length > 0) {
        // This would include logic to update stock quantities based on the count results
        queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
        queryClient.invalidateQueries({
          queryKey: STOCK_QUERY_KEYS.STATISTICS,
        });
      }
    },
    onError: (error) => {
      console.error("Error updating stock count:", error);
      toast.error("Failed to update stock count");
    },
  });

  // Create stock transfer
  const createStockTransfer = useMutation({
    mutationFn: async (params: CreateStockTransferParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        id: `transfer-${Date.now()}`,
        transferNumber: `ST-${Date.now().toString().substring(7)}`,
        status: "draft",
        sourceLocationId: params.sourceLocationId,
        sourceLocationName: "Source Location", // This would be fetched from locations
        destinationLocationId: params.destinationLocationId,
        destinationLocationName: "Destination Location", // This would be fetched from locations
        requestedBy: "Current User", // This would be the current user
        requestedDate: new Date(),
        notes: params.notes,
        items: params.items.map((item) => ({
          id: `item-${Date.now()}-${item.stockId}`,
          transferId: `transfer-${Date.now()}`,
          stockId: item.stockId,
          productName: "Product Name", // This would be fetched from stock
          sku: "SKU", // This would be fetched from stock
          quantity: item.quantity,
          notes: item.notes,
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.TRANSFERS });
      toast.success("Stock transfer created successfully");
    },
    onError: (error) => {
      console.error("Error creating stock transfer:", error);
      toast.error("Failed to create stock transfer");
    },
  });

  // Update stock transfer
  const updateStockTransfer = useMutation({
    mutationFn: async (params: UpdateStockTransferParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ...params };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.TRANSFERS });
      queryClient.invalidateQueries({
        queryKey: STOCK_QUERY_KEYS.TRANSFER_DETAIL(data.id),
      });
      toast.success("Stock transfer updated successfully");

      // If transfer is completed, update stock quantities in source and destination locations
      if (data.status === "completed") {
        // This would include logic to update stock quantities based on the transfer
        queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
        queryClient.invalidateQueries({
          queryKey: STOCK_QUERY_KEYS.STATISTICS,
        });
      }
    },
    onError: (error) => {
      console.error("Error updating stock transfer:", error);
      toast.error("Failed to update stock transfer");
    },
  });

  // Create stock adjustment
  const createStockAdjustment = useMutation({
    mutationFn: async (params: CreateStockAdjustmentParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return {
        id: `adjustment-${Date.now()}`,
        adjustmentNumber: `SA-${Date.now().toString().substring(7)}`,
        type: params.type,
        status: "draft",
        locationId: params.locationId,
        locationName: "Location Name", // This would be fetched from locations
        adjustedBy: "Current User", // This would be the current user
        adjustmentDate: new Date(),
        reason: params.reason,
        notes: params.notes,
        items: params.items.map((item) => ({
          id: `item-${Date.now()}-${item.stockId}`,
          adjustmentId: `adjustment-${Date.now()}`,
          stockId: item.stockId,
          productName: "Product Name", // This would be fetched from stock
          sku: "SKU", // This would be fetched from stock
          previousQuantity: 0, // This would be fetched from stock
          adjustmentQuantity: item.adjustmentQuantity,
          newQuantity: 0, // This would be calculated
          reason: item.reason,
          notes: item.notes,
        })),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ADJUSTMENTS });
      toast.success("Stock adjustment created successfully");
    },
    onError: (error) => {
      console.error("Error creating stock adjustment:", error);
      toast.error("Failed to create stock adjustment");
    },
  });

  // Update stock adjustment
  const updateStockAdjustment = useMutation({
    mutationFn: async (params: UpdateStockAdjustmentParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ...params };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ADJUSTMENTS });
      queryClient.invalidateQueries({
        queryKey: STOCK_QUERY_KEYS.ADJUSTMENT_DETAIL(data.id),
      });
      toast.success("Stock adjustment updated successfully");

      // If adjustment is approved, apply the adjustments to the stock quantities
      if (data.status === "approved") {
        // This would include logic to update stock quantities based on the adjustment
        queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
        queryClient.invalidateQueries({
          queryKey: STOCK_QUERY_KEYS.STATISTICS,
        });
      }
    },
    onError: (error) => {
      console.error("Error updating stock adjustment:", error);
      toast.error("Failed to update stock adjustment");
    },
  });

  return {
    // Data
    stocks: allStockQuery.data || [],
    stockCounts: stockCountsQuery.data || [],
    stockAlerts: stockAlertsQuery.data || [],
    locations: locationsQuery.data || [],
    statistics: statisticsQuery.data || null,

    // Loading states
    isLoadingStock: allStockQuery.isLoading,
    isLoadingStockCounts: stockCountsQuery.isLoading,
    isLoadingStockAlerts: stockAlertsQuery.isLoading,
    isLoadingLocations: locationsQuery.isLoading,
    isLoadingStatistics: statisticsQuery.isLoading,

    // Error states
    stockError: allStockQuery.error,
    stockCountsError: stockCountsQuery.error,
    stockAlertsError: stockAlertsQuery.error,
    locationsError: locationsQuery.error,
    statisticsError: statisticsQuery.error,

    // Utility functions
    getStockById,
    useStockById,
    useStockCountById,

    // Stock Management
    createStock: createStock.mutate,
    updateStock: updateStock.mutate,
    deleteStock: deleteStock.mutate,
    bulkDeleteStock: bulkDeleteStock.mutate,
    updateStockQuantity: updateStockQuantity.mutate,
    updateStockLocation: updateStockLocation.mutate,
    bulkUploadStock: bulkUploadStock.mutate,

    // Stock Counts
    createStockCount: createStockCount.mutate,
    updateStockCount: updateStockCount.mutate,

    // Stock Transfers
    createStockTransfer: createStockTransfer.mutate,
    updateStockTransfer: updateStockTransfer.mutate,

    // Stock Adjustments
    createStockAdjustment: createStockAdjustment.mutate,
    updateStockAdjustment: updateStockAdjustment.mutate,

    // Mutation states
    isCreatingStock: createStock.isPending,
    isUpdatingStock: updateStock.isPending,
    isDeletingStock: deleteStock.isPending,
    isBulkDeletingStock: bulkDeleteStock.isPending,
    isUpdatingStockQuantity: updateStockQuantity.isPending,
    isUpdatingStockLocation: updateStockLocation.isPending,
    isBulkUploadingStock: bulkUploadStock.isPending,
    isCreatingStockCount: createStockCount.isPending,
    isUpdatingStockCount: updateStockCount.isPending,
    isCreatingStockTransfer: createStockTransfer.isPending,
    isUpdatingStockTransfer: updateStockTransfer.isPending,
    isCreatingStockAdjustment: createStockAdjustment.isPending,
    isUpdatingStockAdjustment: updateStockAdjustment.isPending,

    isAuthenticated,
  };
}

export function useStockCounts() {
  const {
    stockCounts,
    isLoadingStockCounts: isLoading,
    stockCountsError: error,
  } = useStocks();
  return { data: stockCounts, isLoading, error };
}

export function useStockAlerts() {
  const {
    stockAlerts,
    isLoadingStockAlerts: isLoading,
    stockAlertsError: error,
  } = useStocks();
  return { data: stockAlerts, isLoading, error };
}

export function useStockLocations() {
  const {
    locations,
    isLoadingLocations: isLoading,
    locationsError: error,
  } = useStocks();
  return { data: locations, isLoading, error };
}

export function useStockStatistics() {
  const {
    statistics,
    isLoadingStatistics: isLoading,
    statisticsError: error,
  } = useStocks();
  return { data: statistics, isLoading, error };
}

export function useCreateStock() {
  const { createStock, isCreatingStock: isPending } = useStocks();
  return { mutate: createStock, isPending };
}

export function useUpdateStock() {
  const { updateStock, isUpdatingStock: isPending } = useStocks();
  return { mutate: updateStock, isPending };
}

export function useDeleteStock() {
  const { deleteStock, isDeletingStock: isPending } = useStocks();
  return { mutate: deleteStock, isPending };
}

export function useBulkDeleteStock() {
  const { bulkDeleteStock, isBulkDeletingStock: isPending } = useStocks();
  return { mutate: bulkDeleteStock, isPending };
}

export function useUpdateStockQuantity() {
  const { updateStockQuantity, isUpdatingStockQuantity: isPending } =
    useStocks();
  return { mutate: updateStockQuantity, isPending };
}

export function useUpdateStockLocation() {
  const { updateStockLocation, isUpdatingStockLocation: isPending } =
    useStocks();
  return { mutate: updateStockLocation, isPending };
}

export function useBulkUploadStock() {
  const { bulkUploadStock, isBulkUploadingStock: isPending } = useStocks();
  return { mutate: bulkUploadStock, isPending };
}

// Hook for getting a specific stock item
export function useStock(id: string) {
  const { useStockById } = useStocks();
  return useStockById(id);
}

// Hook for getting a specific stock count
export function useStockCount(id: string) {
  const { useStockCountById } = useStocks();
  return useStockCountById(id);
}
