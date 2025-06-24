"use client";

import { useStores, useCreateStore, useUpdateStore, useCompleteStorePayment } from "@/hooks/use-stores";
import { noop } from "@/lib/utils";
import { IPaymentIntentResponse } from "@/types/billing";
import { IStore, ICreateStoreInput, IUpdateStoreInput } from "@/types/store";
import { useEffect } from "react";
import { create } from "zustand";

interface IStoreStore {
  stores: IStore[];
  isStoresLoading: boolean;
  isStoresFetching: boolean;
  isStoresSuccess: boolean;
  isStoresError: boolean;
  refetchStores: () => void;

  createStore: (store: ICreateStoreInput) => Promise<IPaymentIntentResponse | null>;
  isCreateStoreLoading: boolean;
  createStoreResult: IPaymentIntentResponse | null;
  resetCreateStoreResult: () => void;

  completeStorePayment: (paymentIntentId: string, storeData: ICreateStoreInput) => Promise<void>;
  isCompleteStorePaymentLoading: boolean;

  updateStore: (store: IUpdateStoreInput) => void;
  isUpdateStoreLoading: boolean;
}

export const useStoreStore = create<IStoreStore>((set) => ({
  stores: [],
  isStoresLoading: false,
  isStoresFetching: false,
  isStoresSuccess: false,
  isStoresError: false,
  refetchStores: noop,

  createStore: noop,
  isCreateStoreLoading: false,
  createStoreResult: null,
  resetCreateStoreResult: noop,

  completeStorePayment: noop,
  isCompleteStorePaymentLoading: false,

  updateStore: noop,
  isUpdateStoreLoading: false,
}));

export function useInitializeStoreStore() {
  const storesQuery = useStores();
  const createStoreMutation = useCreateStore();
  const updateStoreMutation = useUpdateStore();
  const completeStorePaymentMutation = useCompleteStorePayment();

  console.log("=======================================", storesQuery.error, "=======================================");
  useEffect(() => {
    useStoreStore.setState({
      stores: storesQuery.data,
      isStoresLoading: storesQuery.isLoading,
      isStoresFetching: storesQuery.isFetching,
      isStoresSuccess: storesQuery.isSuccess,
      isStoresError: storesQuery.isError,
      refetchStores: storesQuery.refetch,
    });
  }, [storesQuery.data, storesQuery.isLoading, storesQuery.isFetching, storesQuery.isSuccess, storesQuery.isError, storesQuery.refetch]);

  useEffect(() => {
    useStoreStore.setState({
      createStore: async (store: ICreateStoreInput) => {
        return createStoreMutation.mutateAsync(store);
      },
      isCreateStoreLoading: createStoreMutation.isPending,
      createStoreResult: createStoreMutation.data,
      resetCreateStoreResult: createStoreMutation.reset,
    });
  }, [createStoreMutation.mutateAsync, createStoreMutation.isPending, createStoreMutation.reset, createStoreMutation.data]);

  useEffect(() => {
    useStoreStore.setState({
      completeStorePayment: async (paymentIntentId: string, storeData: ICreateStoreInput) => {
        await completeStorePaymentMutation.mutateAsync({ paymentIntentId, storeData });
      },
      isCompleteStorePaymentLoading: completeStorePaymentMutation.isPending,
    });
  }, [completeStorePaymentMutation.mutate, completeStorePaymentMutation.isPending]);

  useEffect(() => {
    useStoreStore.setState({
      updateStore: (store: IUpdateStoreInput) => {
        updateStoreMutation.mutate(store);
      },
      isUpdateStoreLoading: updateStoreMutation.isPending,
    });
  }, [updateStoreMutation.mutate, updateStoreMutation.isPending]);
}
