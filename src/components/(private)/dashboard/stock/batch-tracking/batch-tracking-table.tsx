"use client";

import * as React from "react";
import { useStocks } from "@/hooks/use-stock";
import { IStockBatch } from "@/types/stock";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import BatchTrackingForm from "./batch-tracking-form";
import BatchTrackingDetails from "./batch-tracking-details";

const BatchTrackingTable = () => {
  const { stocks, isLoadingStock } = useStocks();

  // Generated some mock batch data based on stock
  const batchData: IStockBatch[] = React.useMemo(() => {
    return stocks
      .filter((item) => item.batchNumber)
      .map((item) => ({
        id: item.id,
        stockId: item.id,
        productName: item.productName,
        sku: item.sku,
        batchNumber: item.batchNumber || "",
        manufacturingDate: item.createdAt.toISOString(),
        expiryDate: item.expiryDate,
        quantity: item.quantity,
        location: item.location,
        status:
          item.quantity === 0
            ? "depleted"
            : item.expiryDate && new Date(item.expiryDate) < new Date()
            ? "expired"
            : "active",
        notes: item.notes,
      }));
  }, [stocks]);

  // State to manage dialogs
  const [selectedBatch, setSelectedBatch] = React.useState<IStockBatch | null>(
    null
  );
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Action handlers
  const handleViewDetails = (batch: IStockBatch) => {
    setSelectedBatch(batch);
    setOpenDetailsDialog(true);
  };

  const handleEdit = (batch: IStockBatch) => {
    setSelectedBatch(batch);
    setOpenEditDialog(true);
  };

  const handleDelete = (batch: IStockBatch) => {
    setSelectedBatch(batch);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!selectedBatch) return;

    setIsDeleting(true);

    // Simulate delete API call
    setTimeout(() => {
      setIsDeleting(false);
      setOpenDeleteDialog(false);
    }, 1000);
  };

  // Helper function for status styling
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "depleted":
        return "warning";
      case "expired":
        return "error";
      default:
        return "muted";
    }
  };

  if (isLoadingStock) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (batchData.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No batch data found</p>
        <p className="text-sm text-muted-foreground">
          Add batch information to stock items to track them here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full overflow-x-auto">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Number</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batchData.length ? (
              batchData.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">
                    {batch.batchNumber}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {batch.productName}
                  </TableCell>
                  <TableCell>{batch.sku}</TableCell>
                  <TableCell className="text-right">{batch.quantity}</TableCell>
                  <TableCell>{batch.location}</TableCell>
                  <TableCell>
                    {batch.expiryDate
                      ? format(new Date(batch.expiryDate), "MMM d, yyyy")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(batch.status)}>
                      {batch.status.charAt(0).toUpperCase() +
                        batch.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(batch)}
                        >
                          <EyeIcon className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(batch)}>
                          <PencilIcon className="mr-2 h-4 w-4" />
                          Edit Batch
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(batch)}
                          className="text-destructive focus:text-destructive"
                        >
                          <TrashIcon className="mr-2 h-4 w-4" />
                          Delete Batch
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  No batch data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      {selectedBatch && (
        <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Batch</DialogTitle>
              <DialogDescription>
                Edit details for batch {selectedBatch.batchNumber}
              </DialogDescription>
            </DialogHeader>
            <BatchTrackingForm
              batchId={selectedBatch.id}
              onSuccess={() => setOpenEditDialog(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Details Dialog */}
      {selectedBatch && (
        <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Batch Details</DialogTitle>
              <DialogDescription>
                Details for batch {selectedBatch.batchNumber}
              </DialogDescription>
            </DialogHeader>
            <BatchTrackingDetails batch={selectedBatch} />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      {selectedBatch && (
        <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Batch</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this batch? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default BatchTrackingTable;
