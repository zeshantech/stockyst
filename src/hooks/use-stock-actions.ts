// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner";
// import {
//   IStock,
//   CreateStockParams,
//   UpdateStockParams,
//   DeleteStockParams,
//   BulkDeleteStockParams,
//   BulkUploadStockParams,
//   CreateStockCountParams,
//   UpdateStockCountParams,
//   CreateStockTransferParams,
//   UpdateStockTransferParams,
//   CreateStockAdjustmentParams,
//   UpdateStockAdjustmentParams,
// } from "@/types/stock";
// import { STOCK_QUERY_KEYS } from "./use-stocsssk";

// export function useStock() {
//   const queryClient = useQueryClient();

//   // Create stock item
//   const createStock = useMutation({
//     mutationFn: async (params: CreateStockParams) => {
//       // TODO: Replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // Create a new stock item
//       const newStock: IStock = {
//         id: `stock-${Date.now()}`,
//         productId: params.productId,
//         productName: "New Product", // This would be fetched from product data
//         sku: "SKU-123", // This would be fetched from product data
//         location: params.location,
//         quantity: params.quantity,
//         reorderPoint: params.reorderPoint,
//         unitCost: params.unitCost,
//         totalValue: params.quantity * params.unitCost,
//         status:
//           params.quantity === 0
//             ? "out-of-stock"
//             : params.quantity <= params.reorderPoint
//             ? "low-stock"
//             : "in-stock",
//         lastRestocked: new Date().toISOString(),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         expiryDate: params.expiryDate,
//         batchNumber: params.batchNumber,
//         serialNumbers: params.serialNumbers,
//         notes: params.notes,
//       };

//       return newStock;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.STATISTICS });
//       toast.success("Stock item created successfully");
//     },
//     onError: (error) => {
//       console.error("Error creating stock item:", error);
//       toast.error("Failed to create stock item");
//     },
//   });

//   // Update stock item
//   const updateStock = useMutation({
//     mutationFn: async (params: UpdateStockParams) => {
//       // TODO: Replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // In a real application, we would get the current stock item and update it
//       return { ...params };
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
//       queryClient.invalidateQueries({
//         queryKey: STOCK_QUERY_KEYS.DETAIL(data.id),
//       });
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.STATISTICS });
//       toast.success("Stock item updated successfully");

//       // Check if we need to create stock alerts
//       if (data.quantity !== undefined) {
//         const stockItems =
//           queryClient.getQueryData<IStock[]>(STOCK_QUERY_KEYS.ALL) || [];
//         const stockItem = stockItems.find((item) => item.id === data.id);

//         if (stockItem) {
//           // Create alerts based on stock level
//           if (data.quantity === 0) {
//             // Out of stock logic
//           } else if (data.quantity <= stockItem.reorderPoint) {
//             // Low stock logic
//           }
//         }
//       }
//     },
//     onError: (error) => {
//       console.error("Error updating stock item:", error);
//       toast.error("Failed to update stock item");
//     },
//   });

//   // Delete stock item
//   const deleteStock = useMutation({
//     mutationFn: async ({ id }: DeleteStockParams) => {
//       // TODO: Replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return { id };
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.STATISTICS });
//       toast.success("Stock item deleted successfully");
//     },
//     onError: (error) => {
//       console.error("Error deleting stock item:", error);
//       toast.error("Failed to delete stock item");
//     },
//   });

//   // Bulk delete stock items
//   const bulkDeleteStock = useMutation({
//     mutationFn: async ({ ids }: BulkDeleteStockParams) => {
//       // TODO: Replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return { ids };
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.STATISTICS });
//       toast.success("Stock items deleted successfully");
//     },
//     onError: (error) => {
//       console.error("Error deleting stock items:", error);
//       toast.error("Failed to delete stock items");
//     },
//   });

//   // Update stock quantity
//   const updateStockQuantity = useMutation({
//     mutationFn: async ({ id, quantity, notes }: UpdateStockParams) => {
//       // TODO: Replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return { id, quantity, notes };
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
//       queryClient.invalidateQueries({
//         queryKey: STOCK_QUERY_KEYS.DETAIL(data.id),
//       });
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.STATISTICS });
//       toast.success("Stock quantity updated successfully");

//       // Check if we need to create stock alerts based on the new quantity
//       if (data.quantity !== undefined) {
//         const stockItems =
//           queryClient.getQueryData<IStock[]>(STOCK_QUERY_KEYS.ALL) || [];
//         const stockItem = stockItems.find((item) => item.id === data.id);

//         if (stockItem) {
//           // Create alerts based on stock level
//           if (data.quantity === 0) {
//             // Out of stock logic
//           } else if (data.quantity <= stockItem.reorderPoint) {
//             // Low stock logic
//           }
//         }
//       }
//     },
//     onError: (error) => {
//       console.error("Error updating stock quantity:", error);
//       toast.error("Failed to update stock quantity");
//     },
//   });

//   // Update stock location
//   const updateStockLocation = useMutation({
//     mutationFn: async ({ id, location }: UpdateStockParams) => {
//       // TODO: Replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return { id, location };
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
//       queryClient.invalidateQueries({
//         queryKey: STOCK_QUERY_KEYS.DETAIL(data.id),
//       });
//       toast.success("Stock location updated successfully");
//     },
//     onError: (error) => {
//       console.error("Error updating stock location:", error);
//       toast.error("Failed to update stock location");
//     },
//   });

//   // Bulk upload stock items
//   const bulkUploadStock = useMutation({
//     mutationFn: async ({ formData }: BulkUploadStockParams) => {
//       // TODO: Replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 2000));
//       return { success: true };
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.STATISTICS });
//       toast.success("Stock items uploaded successfully");
//     },
//     onError: (error) => {
//       console.error("Error uploading stock items:", error);
//       toast.error("Failed to upload stock items");
//     },
//   });

//   // Create stock count
//   const createStockCount = useMutation({
//     mutationFn: async (params: CreateStockCountParams) => {
//       // TODO: Replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       return {
//         id: `count-${Date.now()}`,
//         countNumber: `SC-${Date.now().toString().substring(7)}`,
//         status: "draft",
//         scheduledDate: params.scheduledDate,
//         locationId: params.locationId,
//         locationName: "Sample Location", // This would be fetched from locations
//         countedBy: "Current User", // This would be the current user
//         notes: params.notes,
//         items: [],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.COUNTS });
//       toast.success("Stock count created successfully");
//     },
//     onError: (error) => {
//       console.error("Error creating stock count:", error);
//       toast.error("Failed to create stock count");
//     },
//   });

//   // Update stock count
//   const updateStockCount = useMutation({
//     mutationFn: async (params: UpdateStockCountParams) => {
//       // TODO: Replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return { ...params };
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.COUNTS });
//       queryClient.invalidateQueries({
//         queryKey: STOCK_QUERY_KEYS.COUNT_DETAIL(data.id),
//       });
//       toast.success("Stock count updated successfully");

//       // If count is completed, update stock quantities based on count results
//       if (data.status === "completed" && data.items && data.items.length > 0) {
//         // This would include logic to update stock quantities based on the count results
//         queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
//         queryClient.invalidateQueries({
//           queryKey: STOCK_QUERY_KEYS.STATISTICS,
//         });
//       }
//     },
//     onError: (error) => {
//       console.error("Error updating stock count:", error);
//       toast.error("Failed to update stock count");
//     },
//   });

//   // Create stock transfer
//   const createStockTransfer = useMutation({
//     mutationFn: async (params: CreateStockTransferParams) => {
//       // TODO: Replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       return {
//         id: `transfer-${Date.now()}`,
//         transferNumber: `ST-${Date.now().toString().substring(7)}`,
//         status: "draft",
//         sourceLocationId: params.sourceLocationId,
//         sourceLocationName: "Source Location", // This would be fetched from locations
//         destinationLocationId: params.destinationLocationId,
//         destinationLocationName: "Destination Location", // This would be fetched from locations
//         requestedBy: "Current User", // This would be the current user
//         requestedDate: new Date(),
//         notes: params.notes,
//         items: params.items.map((item) => ({
//           id: `item-${Date.now()}-${item.stockId}`,
//           transferId: `transfer-${Date.now()}`,
//           stockId: item.stockId,
//           productName: "Product Name", // This would be fetched from stock
//           sku: "SKU", // This would be fetched from stock
//           quantity: item.quantity,
//           notes: item.notes,
//         })),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.TRANSFERS });
//       toast.success("Stock transfer created successfully");
//     },
//     onError: (error) => {
//       console.error("Error creating stock transfer:", error);
//       toast.error("Failed to create stock transfer");
//     },
//   });

//   // Update stock transfer
//   const updateStockTransfer = useMutation({
//     mutationFn: async (params: UpdateStockTransferParams) => {
//       // TODO: Replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return { ...params };
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.TRANSFERS });
//       queryClient.invalidateQueries({
//         queryKey: STOCK_QUERY_KEYS.TRANSFER_DETAIL(data.id),
//       });
//       toast.success("Stock transfer updated successfully");

//       // If transfer is completed, update stock quantities in source and destination locations
//       if (data.status === "completed") {
//         // This would include logic to update stock quantities based on the transfer
//         queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
//         queryClient.invalidateQueries({
//           queryKey: STOCK_QUERY_KEYS.STATISTICS,
//         });
//       }
//     },
//     onError: (error) => {
//       console.error("Error updating stock transfer:", error);
//       toast.error("Failed to update stock transfer");
//     },
//   });

//   // Create stock adjustment
//   const createStockAdjustment = useMutation({
//     mutationFn: async (params: CreateStockAdjustmentParams) => {
//       // TODO: Replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       return {
//         id: `adjustment-${Date.now()}`,
//         adjustmentNumber: `SA-${Date.now().toString().substring(7)}`,
//         type: params.type,
//         status: "draft",
//         locationId: params.locationId,
//         locationName: "Location Name", // This would be fetched from locations
//         adjustedBy: "Current User", // This would be the current user
//         adjustmentDate: new Date(),
//         reason: params.reason,
//         notes: params.notes,
//         items: params.items.map((item) => ({
//           id: `item-${Date.now()}-${item.stockId}`,
//           adjustmentId: `adjustment-${Date.now()}`,
//           stockId: item.stockId,
//           productName: "Product Name", // This would be fetched from stock
//           sku: "SKU", // This would be fetched from stock
//           previousQuantity: 0, // This would be fetched from stock
//           adjustmentQuantity: item.adjustmentQuantity,
//           newQuantity: 0, // This would be calculated
//           reason: item.reason,
//           notes: item.notes,
//         })),
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ADJUSTMENTS });
//       toast.success("Stock adjustment created successfully");
//     },
//     onError: (error) => {
//       console.error("Error creating stock adjustment:", error);
//       toast.error("Failed to create stock adjustment");
//     },
//   });

//   // Update stock adjustment
//   const updateStockAdjustment = useMutation({
//     mutationFn: async (params: UpdateStockAdjustmentParams) => {
//       // TODO: Replace with actual API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));
//       return { ...params };
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ADJUSTMENTS });
//       queryClient.invalidateQueries({
//         queryKey: STOCK_QUERY_KEYS.ADJUSTMENT_DETAIL(data.id),
//       });
//       toast.success("Stock adjustment updated successfully");

//       // If adjustment is approved, apply the adjustments to the stock quantities
//       if (data.status === "approved") {
//         // This would include logic to update stock quantities based on the adjustment
//         queryClient.invalidateQueries({ queryKey: STOCK_QUERY_KEYS.ALL });
//         queryClient.invalidateQueries({
//           queryKey: STOCK_QUERY_KEYS.STATISTICS,
//         });
//       }
//     },
//     onError: (error) => {
//       console.error("Error updating stock adjustment:", error);
//       toast.error("Failed to update stock adjustment");
//     },
//   });

//   return {
//     // Stock Management
//     createStock: createStock.mutate,
//     updateStock: updateStock.mutate,
//     deleteStock: deleteStock.mutate,
//     bulkDeleteStock: bulkDeleteStock.mutate,
//     updateStockQuantity: updateStockQuantity.mutate,
//     updateStockLocation: updateStockLocation.mutate,
//     bulkUploadStock: bulkUploadStock.mutate,

//     // Stock Counts
//     createStockCount: createStockCount.mutate,
//     updateStockCount: updateStockCount.mutate,

//     // Stock Transfers
//     createStockTransfer: createStockTransfer.mutate,
//     updateStockTransfer: updateStockTransfer.mutate,

//     // Stock Adjustments
//     createStockAdjustment: createStockAdjustment.mutate,
//     updateStockAdjustment: updateStockAdjustment.mutate,

//     // Mutation states
//     isCreatingStock: createStock.isPending,
//     isUpdatingStock: updateStock.isPending,
//     isDeletingStock: deleteStock.isPending,
//     isBulkDeletingStock: bulkDeleteStock.isPending,
//     isUpdatingStockQuantity: updateStockQuantity.isPending,
//     isUpdatingStockLocation: updateStockLocation.isPending,
//     isBulkUploadingStock: bulkUploadStock.isPending,
//     isCreatingStockCount: createStockCount.isPending,
//     isUpdatingStockCount: updateStockCount.isPending,
//     isCreatingStockTransfer: createStockTransfer.isPending,
//     isUpdatingStockTransfer: updateStockTransfer.isPending,
//     isCreatingStockAdjustment: createStockAdjustment.isPending,
//     isUpdatingStockAdjustment: updateStockAdjustment.isPending,
//   };
// }
