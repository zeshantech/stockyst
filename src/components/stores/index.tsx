"use client";

import { StoreSelector } from "./store-selector";
import { CreateStoreDialog } from "./create-store-dialog";
import { CreateStoreDialogProvider } from "./use-create-store-dialog";

// Export components individually
export { StoreSelector, CreateStoreDialog, CreateStoreDialogProvider };

// Export a component that includes both the selector and dialog
export function StoreManagerWithDialog() {
  return (
    <CreateStoreDialogProvider>
      <StoreSelector />
      <CreateStoreDialog />
    </CreateStoreDialogProvider>
  );
}
