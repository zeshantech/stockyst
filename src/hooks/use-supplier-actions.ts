import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export interface SupplierActionParams {
  id: string;
  action: "delete" | "toggle-status";
}

export interface BulkDeleteSuppliersParams {
  ids: string[];
}

export interface BulkUploadSuppliersParams {
  formData: FormData;
}

export function useSupplierActions() {
  const queryClient = useQueryClient();

  const deleteSupplier = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting supplier:", error);
      toast.error("Failed to delete supplier");
    },
  });

  const bulkDeleteSuppliers = useMutation({
    mutationFn: async ({ ids }: BulkDeleteSuppliersParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { ids };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Suppliers deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting suppliers:", error);
      toast.error("Failed to delete suppliers");
    },
  });

  const bulkUploadSuppliers = useMutation({
    mutationFn: async ({ formData }: BulkUploadSuppliersParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { formData };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Suppliers uploaded successfully");
    },
    onError: (error) => {
      console.error("Error uploading suppliers:", error);
      toast.error("Failed to upload suppliers");
    },
  });

  const toggleSupplierStatus = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier status updated successfully");
    },
    onError: (error) => {
      console.error("Error updating supplier status:", error);
      toast.error("Failed to update supplier status");
    },
  });

  return {
    deleteSupplier,
    toggleSupplierStatus,
    bulkDeleteSuppliers,
    bulkUploadSuppliers,
  };
}
