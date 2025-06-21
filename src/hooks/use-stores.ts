import * as storeRepository from "@/lib/repositories/store";
import { IUpdateStoreInput } from "@/types/store";
import { useUser } from "@auth0/nextjs-auth0";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useStores = () => {
  const { user } = useUser();

  return useQuery({
    queryKey: ["stores"],
    queryFn: storeRepository.getStores,
    enabled: !!user,
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeRepository.createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast.success("Store created successfully");
    },
    onError: () => toast.error("Failed to create store"),
  });
};

export const useUpdateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: IUpdateStoreInput) => storeRepository.updateStore(input.ID, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
      toast.success("Store updated successfully");
    },
  });
};
