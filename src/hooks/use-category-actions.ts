import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteCategoryParams {
  id: string;
}

interface BulkDeleteCategoriesParams {
  ids: string[];
}

interface BulkUploadCategoriesParams {
  formData: FormData;
}

export function useCategoryActions() {
  const queryClient = useQueryClient();

  const deleteCategory = useMutation({
    mutationFn: async ({ id }: DeleteCategoryParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error deleting category:", error);
      toast.error("Failed to delete category");
    },
  });

  const bulkDeleteCategories = useMutation({
    mutationFn: async ({ ids }: BulkDeleteCategoriesParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error deleting categories:", error);
      toast.error("Failed to delete categories");
    },
  });

  const bulkUploadCategories = useMutation({
    mutationFn: async ({ formData }: BulkUploadCategoriesParams) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error) => {
      console.error("Error uploading categories:", error);
      toast.error("Failed to upload categories");
    },
  });

  return {
    deleteCategory,
    bulkDeleteCategories,
    bulkUploadCategories,
  };
}
