"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useStockAlerts } from "@/hooks/use-stock-alerts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { SearchInput } from "@/components/ui/search-input";
import { Selector } from "@/components/ui/selector";
import { format } from "date-fns";
import {
  MoreHorizontalIcon,
  CheckIcon,
  TrashIcon,
  EyeIcon,
  BellOffIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { IStockAlert } from "@/types/stock";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";

// TablePagination component
interface TablePaginationProps {
  table: any; // Using any for simplicity, in a real app we would use the proper TanStack Table type
}

const TablePagination = ({ table }: TablePaginationProps) => {
  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
      </span>
    </div>
  );
};

// AlertDetails component for showing detailed information about an alert
const AlertDetails = ({ alert }: { alert: IStockAlert }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">Product</h4>
          <p>{alert.productName}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">SKU</h4>
          <p>{alert.sku}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">
            Location
          </h4>
          <p>{alert.location}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">
            Current Quantity
          </h4>
          <p>{alert.currentQuantity}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">
            Reorder Point
          </h4>
          <p>{alert.reorderPoint}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">
            Created At
          </h4>
          <p>{format(new Date(alert.createdAt), "PPP")}</p>
        </div>
        <div className="col-span-2">
          <h4 className="text-sm font-medium text-muted-foreground">Notes</h4>
          <p>{alert.notes || "No notes available"}</p>
        </div>
      </div>
    </div>
  );
};

// DialogModal component for reuse across different dialog types
interface DialogModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

const DialogModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
}: DialogModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

// AlertDialogModal component for confirmation dialogs
interface AlertDialogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isConfirming?: boolean;
}

const AlertDialogModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isConfirming = false,
}: AlertDialogModalProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isConfirming}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? <Spinner className="mr-2" size="sm" /> : null}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const AlertsTable = () => {
  const router = useRouter();
  const {
    stockAlerts,
    isLoading,
    updateStockAlert,
    deleteStockAlert,
    bulkDeleteStockAlerts,
    isUpdatingStockAlert,
    isDeletingStockAlert,
    isBulkDeletingStockAlerts,
  } = useStockAlerts();

  const [selectedAlert, setSelectedAlert] = React.useState<IStockAlert | null>(
    null
  );
  const [openDetailsDialog, setOpenDetailsDialog] = React.useState(false);
  const [openResolveDialog, setOpenResolveDialog] = React.useState(false);
  const [openDismissDialog, setOpenDismissDialog] = React.useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openBulkDeleteDialog, setOpenBulkDeleteDialog] = React.useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = React.useState<string>("all");

  const columns: ColumnDef<IStockAlert>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          onClick={(e) => e.stopPropagation()}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "productName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center space-x-3">
          <div>
            <div
              className="font-medium cursor-pointer hover:underline"
              onClick={() => router.push(`/h/stock/${row.original.stockId}`)}
            >
              {row.original.productName}
            </div>
            <div className="text-sm text-muted-foreground">
              {row.original.sku}
            </div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "alertType",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Alert Type
        </Button>
      ),
      cell: ({ row }) => {
        const alertType = row.original.alertType as string;
        return (
          <Badge variant={alertType === "low-stock" ? "warning" : "error"}>
            {alertType
              .split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "severity",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Severity
        </Button>
      ),
      cell: ({ row }) => {
        const severity = row.original.severity as string;
        return (
          <Badge
            variant={
              severity === "high"
                ? "error"
                : severity === "medium"
                ? "warning"
                : "outline"
            }
          >
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        switch (status) {
          case "active":
            return <Badge variant="secondary">Active</Badge>;
          case "resolved":
            return <Badge variant="success">Resolved</Badge>;
          case "dismissed":
            return <Badge variant="outline">Dismissed</Badge>;
          default:
            return <Badge>{status}</Badge>;
        }
      },
    },
    {
      accessorKey: "location",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Location
        </Button>
      ),
      cell: ({ row }) => <div>{row.original.location}</div>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
        </Button>
      ),
      cell: ({ row }) => (
        <div>{format(new Date(row.original.createdAt), "MMM d, yyyy")}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const alert = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleViewDetails(alert)}>
                <EyeIcon className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {alert.status === "active" && (
                <>
                  <DropdownMenuItem onClick={() => handleResolve(alert)}>
                    <CheckIcon className="mr-2 h-4 w-4" />
                    Mark as Resolved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDismiss(alert)}>
                    <BellOffIcon className="mr-2 h-4 w-4" />
                    Dismiss Alert
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                onClick={() => handleDelete(alert)}
                className="text-red-600"
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const filteredAlerts = React.useMemo(() => {
    return stockAlerts.filter((alert) => {
      // Apply status filter
      if (selectedStatus !== "all" && alert.status !== selectedStatus) {
        return false;
      }

      // Apply severity filter
      if (selectedSeverity !== "all" && alert.severity !== selectedSeverity) {
        return false;
      }

      // Apply search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        return (
          alert.productName.toLowerCase().includes(searchLower) ||
          alert.sku.toLowerCase().includes(searchLower) ||
          alert.location.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [stockAlerts, selectedStatus, selectedSeverity, searchQuery]);

  const table = useReactTable({
    data: filteredAlerts,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // Open details dialog
  const handleViewDetails = (alert: IStockAlert) => {
    setSelectedAlert(alert);
    setOpenDetailsDialog(true);
  };

  // Open resolve dialog
  const handleResolve = (alert: IStockAlert) => {
    setSelectedAlert(alert);
    setOpenResolveDialog(true);
  };

  // Open dismiss dialog
  const handleDismiss = (alert: IStockAlert) => {
    setSelectedAlert(alert);
    setOpenDismissDialog(true);
  };

  // Open delete dialog
  const handleDelete = (alert: IStockAlert) => {
    setSelectedAlert(alert);
    setOpenDeleteDialog(true);
  };

  // Confirm resolution of an alert
  const confirmResolve = async () => {
    if (!selectedAlert) return;

    try {
      await updateStockAlert({
        id: selectedAlert.id,
        status: "resolved",
        notes: `Resolved on ${new Date().toLocaleDateString()}`,
      });
      setOpenResolveDialog(false);
      setSelectedAlert(null);
    } catch (error) {
      console.error("Error resolving alert:", error);
      toast.error("Failed to resolve alert");
    }
  };

  // Confirm dismissal of an alert
  const confirmDismiss = async () => {
    if (!selectedAlert) return;

    try {
      await updateStockAlert({
        id: selectedAlert.id,
        status: "dismissed",
        notes: `Dismissed on ${new Date().toLocaleDateString()}`,
      });
      setOpenDismissDialog(false);
      setSelectedAlert(null);
    } catch (error) {
      console.error("Error dismissing alert:", error);
      toast.error("Failed to dismiss alert");
    }
  };

  // Confirm deletion of an alert
  const confirmDelete = async () => {
    if (!selectedAlert) return;

    try {
      await deleteStockAlert({
        id: selectedAlert.id,
      });
      setOpenDeleteDialog(false);
      setSelectedAlert(null);
    } catch (error) {
      console.error("Error deleting alert:", error);
      toast.error("Failed to delete alert");
    }
  };

  // Bulk delete selected alerts
  const handleBulkDelete = async () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => filteredAlerts[parseInt(index)].id
    );

    if (selectedIds.length === 0) {
      toast.error("No alerts selected");
      return;
    }

    try {
      await bulkDeleteStockAlerts({
        ids: selectedIds,
      });
      setOpenBulkDeleteDialog(false);
      setRowSelection({});
    } catch (error) {
      console.error("Error bulk deleting alerts:", error);
      toast.error("Failed to delete selected alerts");
    }
  };

  // Bulk resolve selected alerts
  const handleBulkResolve = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => filteredAlerts[parseInt(index)].id
    );

    if (selectedIds.length === 0) {
      toast.error("No alerts selected");
      return;
    }

    Promise.all(
      selectedIds.map((id) =>
        updateStockAlert({
          id,
          status: "resolved",
          notes: `Bulk resolved on ${new Date().toLocaleDateString()}`,
        })
      )
    )
      .then(() => {
        toast.success(`${selectedIds.length} alerts resolved`);
        setRowSelection({});
      })
      .catch((error) => {
        console.error("Error bulk resolving alerts:", error);
        toast.error("Failed to resolve selected alerts");
      });
  };

  // Bulk dismiss selected alerts
  const handleBulkDismiss = () => {
    const selectedIds = Object.keys(rowSelection).map(
      (index) => filteredAlerts[parseInt(index)].id
    );

    if (selectedIds.length === 0) {
      toast.error("No alerts selected");
      return;
    }

    Promise.all(
      selectedIds.map((id) =>
        updateStockAlert({
          id,
          status: "dismissed",
          notes: `Bulk dismissed on ${new Date().toLocaleDateString()}`,
        })
      )
    )
      .then(() => {
        toast.success(`${selectedIds.length} alerts dismissed`);
        setRowSelection({});
      })
      .catch((error) => {
        console.error("Error bulk dismissing alerts:", error);
        toast.error("Failed to dismiss selected alerts");
      });
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-60">
          <Spinner size="lg" />
        </div>
      );
    }

    if (stockAlerts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="text-muted-foreground">No alerts found</div>
        </div>
      );
    }

    return (
      <>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => handleViewDetails(row.original)}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            {Object.keys(rowSelection).length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkResolve}
                  disabled={isUpdatingStockAlert}
                >
                  <CheckIcon className="mr-2 h-4 w-4" />
                  Resolve Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDismiss}
                  disabled={isUpdatingStockAlert}
                >
                  <BellOffIcon className="mr-2 h-4 w-4" />
                  Dismiss Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenBulkDeleteDialog(true)}
                  disabled={isDeletingStockAlert || isBulkDeletingStockAlerts}
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Delete Selected
                </Button>
              </>
            )}
          </div>
          <TablePagination table={table} />
        </div>
      </>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <SearchInput
          placeholder="Search alerts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-auto"
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <Selector
            placeholder="Filter by status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "active", label: "Active" },
              { value: "resolved", label: "Resolved" },
              { value: "dismissed", label: "Dismissed" },
            ]}
            className="w-full sm:w-[180px]"
          />
          <Selector
            placeholder="Filter by severity"
            value={selectedSeverity}
            onChange={setSelectedSeverity}
            options={[
              { value: "all", label: "All Severities" },
              { value: "high", label: "High" },
              { value: "medium", label: "Medium" },
              { value: "low", label: "Low" },
            ]}
            className="w-full sm:w-[180px]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto w-full sm:w-auto">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {renderContent()}

      {/* Details Dialog */}
      <DialogModal
        isOpen={openDetailsDialog}
        onClose={() => setOpenDetailsDialog(false)}
        title="Alert Details"
      >
        {selectedAlert ? <AlertDetails alert={selectedAlert} /> : null}
        <DialogFooter>
          <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
        </DialogFooter>
      </DialogModal>

      {/* Resolve Dialog */}
      <AlertDialogModal
        isOpen={openResolveDialog}
        onClose={() => setOpenResolveDialog(false)}
        onConfirm={confirmResolve}
        title="Resolve Alert"
        description="Are you sure you want to mark this alert as resolved? This will remove it from active alerts."
        confirmText="Resolve Alert"
        isConfirming={isUpdatingStockAlert}
      />

      {/* Dismiss Dialog */}
      <AlertDialogModal
        isOpen={openDismissDialog}
        onClose={() => setOpenDismissDialog(false)}
        onConfirm={confirmDismiss}
        title="Dismiss Alert"
        description="Are you sure you want to dismiss this alert? This will hide it from view but not mark it as resolved."
        confirmText="Dismiss Alert"
        isConfirming={isUpdatingStockAlert}
      />

      {/* Delete Dialog */}
      <AlertDialogModal
        isOpen={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Alert"
        description="Are you sure you want to delete this alert? This action cannot be undone."
        confirmText="Delete Alert"
        isConfirming={isDeletingStockAlert}
      />

      {/* Bulk Delete Dialog */}
      <AlertDialogModal
        isOpen={openBulkDeleteDialog}
        onClose={() => setOpenBulkDeleteDialog(false)}
        onConfirm={handleBulkDelete}
        title="Delete Selected Alerts"
        description={`Are you sure you want to delete ${
          Object.keys(rowSelection).length
        } selected alerts? This action cannot be undone.`}
        confirmText="Delete Alerts"
        isConfirming={isBulkDeletingStockAlerts}
      />
    </div>
  );
};

export default AlertsTable;
