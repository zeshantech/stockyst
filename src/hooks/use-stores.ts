import * as storeRepository from "@/lib/repositories/store";
import { ICreateStoreInput, IUpdateStoreInput } from "@/types/store";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useStores = () => {
  const { isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["stores"],
    queryFn: storeRepository.getStores,
    enabled: isSignedIn,
  });
};

export const useCreateStore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeRepository.createStore,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
    onError: () => toast.error("Failed to create store"),
  });
};

export const useCompleteStorePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ paymentIntentId, storeData }: { paymentIntentId: string; storeData: ICreateStoreInput }) => storeRepository.completeStorePayment(paymentIntentId, storeData),
    onSuccess: () => {
      toast.success("Store created successfully");
      queryClient.invalidateQueries({ queryKey: ["stores"] });
    },
    onError: () => toast.error("Failed to complete payment"),
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
