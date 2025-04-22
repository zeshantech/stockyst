import { IStore } from "@/types/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateStoreInput {
  name: string;
  address?: string;
  city?: string;
  country?: string;
  phone?: string;
  email?: string;
  logo?: string;
  type?: string;
}

// Mock function to create a store
const createStore = async (storeData: CreateStoreInput): Promise<IStore> => {
  // This would normally be an API call
  // For now, simulate a server request
  return new Promise((resolve) => {
    setTimeout(() => {
      const newStore: IStore = {
        id: `store-${Date.now()}`, // Generate a unique ID
        ...storeData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      resolve(newStore);
    }, 500);
  });
};

export function useStoreActions() {
  const queryClient = useQueryClient();

  const createStoreMutation = useMutation({
    mutationFn: createStore,
    onSuccess: (newStore) => {
      // Update the stores query data
      queryClient.setQueryData<IStore[]>(["stores"], (old = []) => [
        ...old,
        newStore,
      ]);

      // Invalidate the stores query to refetch if needed
      queryClient.invalidateQueries({ queryKey: ["stores"] });

      // Show success toast
      toast.success(`Store "${newStore.name}" created successfully`);

      // Set as active store
      if (typeof window !== "undefined") {
        localStorage.setItem("activeStoreId", newStore.id);
      }
    },
    onError: (error) => {
      // Show error toast
      toast.error(
        `Failed to create store: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    },
  });

  return {
    createStore: createStoreMutation.mutate,
    isCreating: createStoreMutation.isPending,
  };
}
