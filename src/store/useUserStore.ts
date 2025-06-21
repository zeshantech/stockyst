"use client";

import { useCurrentUser, useUpdateUser } from "@/hooks/use-user";
import { noop } from "@/lib/utils";
import { IUpdateUserInput, IUser } from "@/types/user";
import { useEffect } from "react";
import { create } from "zustand";

interface IUserStore {
  currentUser: IUser | null;
  isCurrentUserLoading: boolean;

  updateUser: (user: IUpdateUserInput) => void;
  isUpdateUserLoading: boolean;
}

export const useUserStore = create<IUserStore>((set) => ({
  currentUser: null,
  isCurrentUserLoading: false,

  updateUser: noop,
  isUpdateUserLoading: false,
}));

export function useInitializeUserStore() {
  const currentUserQuery = useCurrentUser();
  const updateUserMutation = useUpdateUser();

  useEffect(() => {
    useUserStore.setState({
      currentUser: currentUserQuery.data,
      isCurrentUserLoading: currentUserQuery.isLoading,
    });
  }, [currentUserQuery.data, currentUserQuery.isLoading]);

  useEffect(() => {
    useUserStore.setState({
      updateUser: (user: IUpdateUserInput) => {
        useUserStore.setState({
          currentUser: {
            ...useUserStore.getState().currentUser,
            ...user,
          },
        });
        updateUserMutation.mutate(user);
      },
      isUpdateUserLoading: updateUserMutation.isPending,
    });
  }, [updateUserMutation.mutate, updateUserMutation.isPending]);
}
