"use client";

import { useStores, useCreateStore, useUpdateStore } from "@/hooks/use-stores";
import { noop } from "@/lib/utils";
import { IStore, ICreateStoreInput, IUpdateStoreInput } from "@/types/store";
import { useEffect } from "react";
import { create } from "zustand";

interface IStoreStore {
  stores: IStore[];
  isStoresLoading: boolean;
  isStoresSuccess: boolean;
  isStoresError: boolean;
  refetchStores: () => void;

  createStore: (store: ICreateStoreInput) => void;
  isCreateStoreLoading: boolean;

  updateStore: (store: IUpdateStoreInput) => void;
  isUpdateStoreLoading: boolean;
}

export const useStoreStore = create<IStoreStore>((set) => ({
  stores: [],
  isStoresLoading: false,
  isStoresSuccess: false,
  isStoresError: false,
  refetchStores: noop,

  createStore: noop,
  isCreateStoreLoading: false,

  updateStore: noop,
  isUpdateStoreLoading: false,
}));

export function useInitializeStoreStore() {
  const storesQuery = useStores();
  const createStoreMutation = useCreateStore();
  const updateStoreMutation = useUpdateStore();

  useEffect(() => {
    useStoreStore.setState({
      stores: storesQuery.data,
      isStoresLoading: storesQuery.isLoading,
      isStoresSuccess: storesQuery.isSuccess,
      isStoresError: storesQuery.isError,
      refetchStores: storesQuery.refetch,
    });
  }, [storesQuery.data, storesQuery.isLoading, storesQuery.isSuccess, storesQuery.isError, storesQuery.refetch]);

  useEffect(() => {
    useStoreStore.setState({
      createStore: (store: ICreateStoreInput) => {
        createStoreMutation.mutate(store);
      },
      isCreateStoreLoading: createStoreMutation.isPending,
    });
  }, [createStoreMutation.mutate, createStoreMutation.isPending]);

  useEffect(() => {
    useStoreStore.setState({
      updateStore: (store: IUpdateStoreInput) => {
        updateStoreMutation.mutate(store);
      },
      isUpdateStoreLoading: updateStoreMutation.isPending,
    });
  }, [updateStoreMutation.mutate, updateStoreMutation.isPending]);
}
