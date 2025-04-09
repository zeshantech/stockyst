import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { IStock, CreateStockAlertParams } from "@/types/stock";

interface DeleteStockParams {
  id: string;
}

interface BulkDeleteStockParams {
  ids: string[];
}

interface UpdateStockQuantityParams {
  id: string;
  quantity: number;
  notes?: string;
}

interface UpdateStockLocationParams {
  id: string;
  location: string;
}

interface BulkUploadStockParams {
  formData: FormData;
}

export function useStockActions() {
  const queryClient = useQueryClient();

  const createStockAlert = useMutation({
    mutationFn: async (params: CreateStockAlertParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id: "new-id", ...params };
    },
  });

  const deleteStock = useMutation({
    mutationFn: async ({ id }: DeleteStockParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      toast.success("Stock item deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting stock item:", error);
      toast.error("Failed to delete stock item");
    },
  });

  const bulkDeleteStock = useMutation({
    mutationFn: async ({ ids }: BulkDeleteStockParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ids };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      toast.success("Stock items deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting stock items:", error);
      toast.error("Failed to delete stock items");
    },
  });

  const updateStockQuantity = useMutation({
    mutationFn: async ({ id, quantity, notes }: UpdateStockQuantityParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id, quantity, notes };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      toast.success("Stock quantity updated successfully");

      // Get the current stock item
      const stockItems = queryClient.getQueryData<IStock[]>(["stock"]) || [];
      const stockItem = stockItems.find((item) => item.id === data.id);

      if (stockItem) {
        // Create alerts based on stock level
        if (data.quantity === 0) {
          createStockAlert.mutate({
            stockId: data.id,
            alertType: "out-of-stock",
          });
        } else if (data.quantity <= stockItem.reorderPoint) {
          createStockAlert.mutate({
            stockId: data.id,
            alertType: "low-stock",
          });
        }
      }
    },
    onError: (error) => {
      console.error("Error updating stock quantity:", error);
      toast.error("Failed to update stock quantity");
    },
  });

  const updateStockLocation = useMutation({
    mutationFn: async ({ id, location }: UpdateStockLocationParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id, location };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      toast.success("Stock location updated successfully");
    },
    onError: (error) => {
      console.error("Error updating stock location:", error);
      toast.error("Failed to update stock location");
    },
  });

  const bulkUploadStock = useMutation({
    mutationFn: async ({ formData }: BulkUploadStockParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      toast.success("Stock items uploaded successfully");
    },
    onError: (error) => {
      console.error("Error uploading stock items:", error);
      toast.error("Failed to upload stock items");
    },
  });

  return {
    deleteStock,
    bulkDeleteStock,
    updateStockQuantity,
    updateStockLocation,
    bulkUploadStock,
  };
}
