"use client";

import React from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogComponent } from "@/components/ui/dialog";
import AdjustmentForm from "./adjustment-form";

const AdjustmentsHeader = () => {
  const [openCreateDialog, setOpenCreateDialog] = React.useState(false);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Stock Adjustments</h1>
        <p className="text-muted-foreground">
          Manage inventory adjustments and reconciliation
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          className="gap-1"
          onClick={() => setOpenCreateDialog(true)}
        >
          <PlusIcon className="h-4 w-4" />
          New Adjustment
        </Button>

        <DialogComponent
          open={openCreateDialog}
          onOpenChange={setOpenCreateDialog}
          title="Create New Adjustment"
          description="Adjust stock quantities with proper documentation"
          contentClassName="sm:max-w-[550px]"
        >
          <AdjustmentForm onSuccess={() => setOpenCreateDialog(false)} />
        </DialogComponent>
      </div>
    </div>
  );
};

export default AdjustmentsHeader;
