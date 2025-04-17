import React from "react";
import { IStockAdjustment } from "@/types/stock";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface AdjustmentDetailsProps {
  adjustment: IStockAdjustment;
}

const AdjustmentDetails = ({ adjustment }: AdjustmentDetailsProps) => {
  // Helper function for type styling
  const getTypeColor = (type: string) => {
    switch (type) {
      case "addition":
        return "text-green-600";
      case "subtraction":
        return "text-red-600";
      case "correction":
        return "text-blue-600";
      case "write-off":
        return "text-amber-600";
      default:
        return "text-gray-600";
    }
  };

  // Helper function for status styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "text-green-600";
      case "rejected":
        return "text-red-600";
      case "pending-approval":
        return "text-amber-600";
      case "draft":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div>
      <div className="space-y-6">
        {/* General Information */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Adjustment Number
              </h3>
              <p className="mt-1 text-base">{adjustment.adjustmentNumber}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Type
              </h3>
              <p
                className={`mt-1 text-base font-medium ${getTypeColor(
                  adjustment.type
                )}`}
              >
                {adjustment.type.charAt(0).toUpperCase() +
                  adjustment.type.slice(1)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Location
              </h3>
              <p className="mt-1 text-base">{adjustment.locationName}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Status
              </h3>
              <p
                className={`mt-1 text-base font-medium ${getStatusColor(
                  adjustment.status
                )}`}
              >
                {adjustment.status === "pending-approval"
                  ? "Pending Approval"
                  : adjustment.status.charAt(0).toUpperCase() +
                    adjustment.status.slice(1)}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Adjustment Reason
            </h3>
            <p className="mt-1 text-base">{adjustment.reason}</p>
          </div>

          {adjustment.notes && (
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Notes
              </h3>
              <p className="mt-1 text-base whitespace-pre-line">
                {adjustment.notes}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Adjusted By
              </h3>
              <p className="mt-1 text-base">{adjustment.adjustedBy}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Adjustment Date
              </h3>
              <p className="mt-1 text-base">
                {format(new Date(adjustment.adjustmentDate), "MMM d, yyyy")}
              </p>
            </div>
          </div>

          {adjustment.status === "approved" ||
          adjustment.status === "rejected" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {adjustment.status === "approved"
                    ? "Approved By"
                    : "Rejected By"}
                </h3>
                <p className="mt-1 text-base">{adjustment.approvedBy}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  {adjustment.status === "approved"
                    ? "Approval Date"
                    : "Rejection Date"}
                </h3>
                <p className="mt-1 text-base">
                  {adjustment.approvalDate
                    ? format(new Date(adjustment.approvalDate), "MMM d, yyyy")
                    : "N/A"}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Adjustment Items */}
        <div>
          <h3 className="text-sm font-medium mb-2">Adjusted Items</h3>
          <div className="rounded-md border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-2 text-left text-xs font-medium">
                    Product
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium">
                    SKU
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium">
                    Previous Qty
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium">
                    Adjustment
                  </th>
                  <th className="px-4 py-2 text-right text-xs font-medium">
                    New Qty
                  </th>
                </tr>
              </thead>
              <tbody>
                {adjustment.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-2 text-sm">{item.productName}</td>
                    <td className="px-4 py-2 text-sm">{item.sku}</td>
                    <td className="px-4 py-2 text-right text-sm">
                      {item.previousQuantity}
                    </td>
                    <td className="px-4 py-2 text-right text-sm">
                      <span
                        className={
                          item.adjustmentQuantity > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }
                      >
                        {item.adjustmentQuantity > 0 ? "+" : ""}
                        {item.adjustmentQuantity}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right text-sm">
                      {item.newQuantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {adjustment.items.length > 0 && adjustment.items[0].reason && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground">
                Item Reason
              </h3>
              <p className="mt-1 text-sm">{adjustment.items[0].reason}</p>
            </div>
          )}

          {adjustment.items.length > 0 && adjustment.items[0].notes && (
            <div className="mt-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Item Notes
              </h3>
              <p className="mt-1 text-sm whitespace-pre-line">
                {adjustment.items[0].notes}
              </p>
            </div>
          )}
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

export default AdjustmentDetails;
