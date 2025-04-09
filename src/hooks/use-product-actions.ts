import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteProductParams {
  id: string;
}

interface BulkDeleteProductsParams {
  ids: string[];
}

interface BulkUploadProductsParams {
  formData: FormData;
}

interface UpdateProductStatusParams {
  id: string;
  status: "active" | "inactive" | "discontinued";
}

export function useProductActions() {
  const queryClient = useQueryClient();

  const deleteProduct = useMutation({
    mutationFn: async ({ id }: DeleteProductParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    },
  });

  const bulkDeleteProducts = useMutation({
    mutationFn: async ({ ids }: BulkDeleteProductsParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Error deleting products:", error);
      toast.error("Failed to delete products");
    },
  });

  const bulkUploadProducts = useMutation({
    mutationFn: async ({ formData }: BulkUploadProductsParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Error uploading products:", error);
      toast.error("Failed to upload products");
    },
  });

  const updateProductStatus = useMutation({
    mutationFn: async ({ id, status }: UpdateProductStatusParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Error updating product status:", error);
      toast.error("Failed to update product status");
    },
  });

  return {
    deleteProduct,
    bulkDeleteProducts,
    bulkUploadProducts,
    updateProductStatus,
  };
}
