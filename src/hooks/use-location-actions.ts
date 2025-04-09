import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ILocation } from "@/types/location";

// Mock API functions - Replace with actual API calls
const mockDeleteLocation = async ({ id }: { id: string }) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true };
};

const mockBulkDeleteLocations = async ({ ids }: { ids: string[] }) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true };
};

const mockBulkUploadLocations = async ({
  formData,
}: {
  formData: FormData;
}) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true };
};

export function useLocationActions() {
  const queryClient = useQueryClient();

  const deleteLocation = useMutation({
    mutationFn: mockDeleteLocation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  const bulkDeleteLocations = useMutation({
    mutationFn: mockBulkDeleteLocations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  const bulkUploadLocations = useMutation({
    mutationFn: mockBulkUploadLocations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  return {
    deleteLocation,
    bulkDeleteLocations,
    bulkUploadLocations,
  };
}
