import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DeleteOrderParams,
  BulkDeleteOrdersParams,
  UpdateOrderStatusParams,
  UpdatePaymentStatusParams,
  BulkUploadOrdersParams,
} from "@/types/order";

export function useOrderActions() {
  const queryClient = useQueryClient();

  const deleteOrder = useMutation({
    mutationFn: async ({ id }: DeleteOrderParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    },
  });

  const bulkDeleteOrders = useMutation({
    mutationFn: async ({ ids }: BulkDeleteOrdersParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ids };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Orders deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting orders:", error);
      toast.error("Failed to delete orders");
    },
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }: UpdateOrderStatusParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order status updated successfully");
    },
    onError: (error) => {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    },
  });

  const updatePaymentStatus = useMutation({
    mutationFn: async ({ id, paymentStatus }: UpdatePaymentStatusParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id, paymentStatus };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Payment status updated successfully");
    },
    onError: (error) => {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status");
    },
  });

  const bulkUploadOrders = useMutation({
    mutationFn: async ({ formData }: BulkUploadOrdersParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Orders uploaded successfully");
    },
    onError: (error) => {
      console.error("Error uploading orders:", error);
      toast.error("Failed to upload orders");
    },
  });

  return {
    deleteOrder,
    bulkDeleteOrders,
    updateOrderStatus,
    updatePaymentStatus,
    bulkUploadOrders,
  };
}
