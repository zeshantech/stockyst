import React from "react";
import { IStockBatch } from "@/types/stock";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface BatchTrackingDetailsProps {
  batch: IStockBatch;
}

const BatchTrackingDetails = ({ batch }: BatchTrackingDetailsProps) => {
  // Helper function for status styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "depleted":
        return "text-amber-600";
      case "expired":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div>
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Batch Number
              </h3>
              <p className="mt-1 text-base">{batch.batchNumber}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Status
              </h3>
              <p
                className={`mt-1 text-base font-medium ${getStatusColor(
                  batch.status
                )}`}
              >
                {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Product
            </h3>
            <p className="mt-1 text-base">{batch.productName}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">SKU</h3>
              <p className="mt-1 text-base">{batch.sku}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Location
              </h3>
              <p className="mt-1 text-base">{batch.location}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Quantity
              </h3>
              <p className="mt-1 text-base">{batch.quantity}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Manufacturing Date
              </h3>
              <p className="mt-1 text-base">
                {batch.manufacturingDate
                  ? format(new Date(batch.manufacturingDate), "MMM d, yyyy")
                  : "Not specified"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Expiry Date
            </h3>
            <p className="mt-1 text-base">
              {batch.expiryDate
                ? format(new Date(batch.expiryDate), "MMM d, yyyy")
                : "Not specified"}
            </p>
          </div>

          {batch.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Notes
              </h3>
              <p className="mt-1 text-base whitespace-pre-line">
                {batch.notes}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-md bg-muted p-4">
          <h3 className="mb-2 text-sm font-medium">Batch Timeline</h3>

          <div className="space-y-3">
            <div className="flex items-start">
              <div className="relative mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Created</p>
                <p className="text-xs text-muted-foreground">
                  {batch.manufacturingDate
                    ? format(
                        new Date(batch.manufacturingDate),
                        "MMM d, yyyy 'at' h:mm a"
                      )
                    : "Unknown date"}
                </p>
              </div>
            </div>

            {batch.status === "depleted" && (
              <div className="flex items-start">
                <div className="relative mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-amber-500">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Depleted</p>
                  <p className="text-xs text-muted-foreground">
                    Stock quantity reached zero
                  </p>
                </div>
              </div>
            )}

            {batch.status === "expired" && (
              <div className="flex items-start">
                <div className="relative mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">Expired</p>
                  <p className="text-xs text-muted-foreground">
                    {batch.expiryDate
                      ? format(new Date(batch.expiryDate), "MMM d, yyyy")
                      : "Unknown date"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button variant="outline" type="button">
          Print
        </Button>
      </DialogFooter>
    </div>
  );
};

export default BatchTrackingDetails;
