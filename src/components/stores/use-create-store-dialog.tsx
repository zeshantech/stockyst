"use client";

import { createContext, useContext, useState } from "react";

interface CreateStoreDialogContextType {
  isOpen: boolean;
  openDialog: () => void;
  closeDialog: () => void;
}

const CreateStoreDialogContext = createContext<CreateStoreDialogContextType>({
  isOpen: false,
  openDialog: () => {},
  closeDialog: () => {},
});

export function CreateStoreDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <CreateStoreDialogContext.Provider
      value={{ isOpen, openDialog, closeDialog }}
    >
      {children}
    </CreateStoreDialogContext.Provider>
  );
}

export function useCreateStoreDialog() {
  const context = useContext(CreateStoreDialogContext);

  if (!context) {
    throw new Error(
      "useCreateStoreDialog must be used within a CreateStoreDialogProvider"
    );
  }

  return {
    isCreateStoreDialogOpen: context.isOpen,
    openCreateStoreDialog: context.openDialog,
    closeCreateStoreDialog: context.closeDialog,
  };
}
