"use client";

import React from "react";
import { useStocks } from "@/hooks/use-stock";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { DialogComponent } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import {
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  CheckIcon,
  XIcon,
} from "lucide-react";
import { format } from "date-fns";
import { DropdownMenuComponent } from "@/components/ui/dropdown-menu";
import { IStockAdjustment } from "@/types/stock";
import AdjustmentForm from "./adjustment-form";
import AdjustmentDetails from "./adjustment-details";

const AdjustmentsTable = () => {
  const router = useRouter();
  const {
    stock,
    updateStockAdjustment,
    deleteStockAdjustment,
    isLoadingStock,
  } = useStocks();

  // Simulated adjustments data (would normally come from the API)
  const adjustments: IStockAdjustment[] = React.useMemo(() => {
    return [
      {
        id: "1",
        adjustmentNumber: "ADJ-001",
        type: "addition",
        status: "approved",
        locationId: "1",
        locationName: "Warehouse A",
        adjustedBy: "John Doe",
        adjustmentDate: "2024-03-20",
        approvedBy: "Jane Smith",
        approvalDate: "2024-03-21",
        reason: "Received additional stock from supplier",
        notes: "Found 5 additional units during stock count",
        items: [
          {
            id: "1",
            adjustmentId: "1",
            stockId: "1",
            productName: "Laptop Pro X1",
            sku: "LP-X1-2024",
            previousQuantity: 40,
            adjustmentQuantity: 5,
            newQuantity: 45,
            reason: "Additional units received",
            notes: "",
          },
        ],
        createdAt: new Date("2024-03-20").toISOString(),
        updatedAt: new Date("2024-03-21").toISOString(),
      },
      {
        id: "2",
        adjustmentNumber: "ADJ-002",
        type: "subtraction",
        status: "approved",
        locationId: "1",
        locationName: "Warehouse A",
        adjustedBy: "Alex Johnson",
        adjustmentDate: "2024-03-18",
        approvedBy: "Jane Smith",
        approvalDate: "2024-03-19",
        reason: "Damaged goods",
        notes: "Items damaged during storage",
        items: [
          {
            id: "2",
            adjustmentId: "2",
            stockId: "3",
            productName: "Wireless Mouse",
            sku: "WM-2024",
            previousQuantity: 2,
            adjustmentQuantity: -2,
            newQuantity: 0,
            reason: "Damaged products",
            notes: "Water damage",
          },
        ],
        createdAt: new Date("2024-03-18").toISOString(),
        updatedAt: new Date("2024-03-19").toISOString(),
      },
      {
        id: "3",
        adjustmentNumber: "ADJ-003",
        type: "correction",
        status: "pending-approval",
        locationId: "2",
        locationName: "Warehouse B",
        adjustedBy: "Mike Brown",
        adjustmentDate: "2024-03-22",
        reason: "Stock count adjustment",
        notes: "Correcting inventory based on physical count",
        items: [
          {
            id: "3",
            adjustmentId: "3",
            stockId: "2",
            productName: "Office Chair Ergo",
            sku: "OC-E-2024",
            previousQuantity: 8,
            adjustmentQuantity: 2,
            newQuantity: 10,
            reason: "Count correction",
            notes: "",
          },
        ],
        createdAt: new Date("2024-03-22").toISOString(),
        updatedAt: new Date("2024-03-22").toISOString(),
      },
    ];
  }, []);

  // State to manage dialogs
  const [selectedAdjustment, setSelectedAdjustment] =
    React.useState<IStockAdjustment | null>(null);
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openApproveDialog, setOpenApproveDialog] = React.useState(false);
  const [openRejectDialog, setOpenRejectDialog] = React.useState(false);
  const [isActionLoading, setIsActionLoading] = React.useState(false);

  // Action handlers
  const handleViewDetails = (adjustment: IStockAdjustment) => {
    setSelectedAdjustment(adjustment);
    setOpenDetailsDialog(true);
  };

  const handleEdit = (adjustment: IStockAdjustment) => {
    setSelectedAdjustment(adjustment);
    setOpenEditDialog(true);
  };

  const handleDelete = (adjustment: IStockAdjustment) => {
    setSelectedAdjustment(adjustment);
    setOpenDeleteDialog(true);
  };

  const handleApprove = (adjustment: IStockAdjustment) => {
    setSelectedAdjustment(adjustment);
    setOpenApproveDialog(true);
  };

  const handleReject = (adjustment: IStockAdjustment) => {
    setSelectedAdjustment(adjustment);
    setOpenRejectDialog(true);
  };

  const confirmApprove = () => {
    if (!selectedAdjustment) return;

    setIsActionLoading(true);

    // Update the adjustment status
    updateStockAdjustment({
      id: selectedAdjustment.id,
      status: "approved",
      approvedBy: "Current User",
      approvalDate: new Date().toISOString(),
    });

    // Simulate API call
    setTimeout(() => {
      setIsActionLoading(false);
      setOpenApproveDialog(false);
    }, 1000);
  };

  const confirmReject = () => {
    if (!selectedAdjustment) return;

    setIsActionLoading(true);

    // Update the adjustment status
    updateStockAdjustment({
      id: selectedAdjustment.id,
      status: "rejected",
      approvedBy: "Current User",
      approvalDate: new Date().toISOString(),
    });

    // Simulate API call
    setTimeout(() => {
      setIsActionLoading(false);
      setOpenRejectDialog(false);
    }, 1000);
  };

  const confirmDelete = () => {
    if (!selectedAdjustment) return;

    setIsActionLoading(true);

    // Delete the adjustment
    deleteStockAdjustment({
      id: selectedAdjustment.id,
    });

    // Simulate API call
    setTimeout(() => {
      setIsActionLoading(false);
      setOpenDeleteDialog(false);
    }, 1000);
  };

  // Helper functions for rendering badges
  const renderTypeBadge = (type: IStockAdjustment["type"]) => {
    switch (type) {
      case "addition":
        return <Badge variant="success">Addition</Badge>;
      case "subtraction":
        return <Badge variant="destructive">Subtraction</Badge>;
      case "correction":
        return <Badge variant="outline">Correction</Badge>;
      case "write-off":
        return <Badge variant="warning">Write-off</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const renderStatusBadge = (status: IStockAdjustment["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "pending-approval":
        return <Badge variant="warning">Pending Approval</Badge>;
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoadingStock) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (adjustments.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No adjustments found</p>
        <p className="text-sm text-muted-foreground">
          Create a new adjustment to start managing your inventory changes
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium">
                Adjustment #
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Location
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Reason
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium">
                Status
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {adjustments.map((adjustment) => (
              <tr key={adjustment.id} className="border-b">
                <td className="px-4 py-3 text-sm font-medium">
                  <span
                    className="cursor-pointer hover:underline"
                    onClick={() => handleViewDetails(adjustment)}
                  >
                    {adjustment.adjustmentNumber}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {renderTypeBadge(adjustment.type)}
                </td>
                <td className="px-4 py-3 text-sm">{adjustment.locationName}</td>
                <td className="px-4 py-3 text-sm">
                  {format(new Date(adjustment.adjustmentDate), "MMM d, yyyy")}
                </td>
                <td
                  className="max-w-[200px] truncate px-4 py-3 text-sm"
                  title={adjustment.reason}
                >
                  {adjustment.reason}
                </td>
                <td className="px-4 py-3 text-sm">
                  {renderStatusBadge(adjustment.status)}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <DropdownMenuComponent
                    trigger={
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontalIcon className="h-4 w-4" />
                      </Button>
                    }
                    items={[
                      {
                        content: (
                          <div className="flex items-center">
                            <EyeIcon className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </div>
                        ),
                        onClick: () => handleViewDetails(adjustment),
                      },
                      ...(adjustment.status === "draft"
                        ? [
                            {
                              content: (
                                <div className="flex items-center">
                                  <EditIcon className="mr-2 h-4 w-4" />
                                  <span>Edit</span>
                                </div>
                              ),
                              onClick: () => handleEdit(adjustment),
                            },
                          ]
                        : []),
                      ...(adjustment.status === "pending-approval"
                        ? [
                            {
                              content: (
                                <div className="flex items-center">
                                  <CheckIcon className="mr-2 h-4 w-4" />
                                  <span>Approve</span>
                                </div>
                              ),
                              onClick: () => handleApprove(adjustment),
                            },
                            {
                              content: (
                                <div className="flex items-center">
                                  <XIcon className="mr-2 h-4 w-4" />
                                  <span>Reject</span>
                                </div>
                              ),
                              onClick: () => handleReject(adjustment),
                            },
                          ]
                        : []),
                      {
                        content: (
                          <div className="flex items-center">
                            <TrashIcon className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </div>
                        ),
                        onClick: () => handleDelete(adjustment),
                        className: "text-destructive focus:text-destructive",
                        separator: true,
                      },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      {selectedAdjustment && (
        <DialogComponent
          open={openEditDialog}
          onOpenChange={setOpenEditDialog}
          title="Edit Adjustment"
          description={`Edit details for ${selectedAdjustment.adjustmentNumber}`}
          contentClassName="sm:max-w-[550px]"
        >
          <AdjustmentForm
            adjustmentId={selectedAdjustment.id}
            onSuccess={() => setOpenEditDialog(false)}
          />
        </DialogComponent>
      )}

      {/* Details Dialog */}
      {selectedAdjustment && (
        <DialogComponent
          open={openDetailsDialog}
          onOpenChange={setOpenDetailsDialog}
          title="Adjustment Details"
          description={`Details for ${selectedAdjustment.adjustmentNumber}`}
          contentClassName="sm:max-w-[600px]"
        >
          <AdjustmentDetails adjustment={selectedAdjustment} />
        </DialogComponent>
      )}

      {/* Approve Dialog */}
      {selectedAdjustment && (
        <AlertDialogComponent
          open={openApproveDialog}
          onOpenChange={setOpenApproveDialog}
          title="Approve Adjustment"
          description="Are you sure you want to approve this adjustment? This will update stock quantities accordingly."
          confirmButton={isActionLoading ? "Approving..." : "Approve"}
          onConfirm={confirmApprove}
          cancelButton="Cancel"
        />
      )}

      {/* Reject Dialog */}
      {selectedAdjustment && (
        <AlertDialogComponent
          open={openRejectDialog}
          onOpenChange={setOpenRejectDialog}
          title="Reject Adjustment"
          description="Are you sure you want to reject this adjustment? No stock quantities will be changed."
          confirmButton={isActionLoading ? "Rejecting..." : "Reject"}
          onConfirm={confirmReject}
          cancelButton="Cancel"
        />
      )}

      {/* Delete Dialog */}
      {selectedAdjustment && (
        <AlertDialogComponent
          open={openDeleteDialog}
          onOpenChange={setOpenDeleteDialog}
          title="Delete Adjustment"
          description="Are you sure you want to delete this adjustment? This action cannot be undone."
          confirmButton={isActionLoading ? "Deleting..." : "Delete"}
          onConfirm={confirmDelete}
          cancelButton="Cancel"
        />
      )}
    </div>
  );
};

export default AdjustmentsTable;
