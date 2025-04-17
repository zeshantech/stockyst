"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  noop,
  useReactTable,
} from "@tanstack/react-table";
import {
  IconDotsVertical,
  IconEye,
  IconTrash,
  IconCheck,
  IconX,
  IconBell,
  IconBox,
  IconCalendarDue,
  IconExclamationCircle,
  IconRefresh,
  IconCheckbox,
} from "@tabler/icons-react";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxComponent,
  DropdownMenuComponent,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TablePagination,
} from "@/components/ui/table";
import { toast } from "sonner";
import { IStockAlert } from "@/types/stock";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { useStockAlerts } from "@/hooks/use-stock-alerts";
import { Selector } from "@/components/ui/selector";
import { EyeIcon } from "lucide-react";

interface StockAlertsProps {
  alerts: IStockAlert[];
  isLoading?: boolean;
}

export function StockAlerts({ alerts, isLoading = false }: StockAlertsProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("all");

  // Combined dialog state
  const [dialog, setDialog] = useState<{
    type: "delete" | "bulkDelete" | "resolve" | "dismiss" | null;
    open: boolean;
    alert: IStockAlert | null;
  }>({
    type: null,
    open: false,
    alert: null,
  });

  const { updateStockAlert, deleteStockAlert, bulkDeleteStockAlerts } =
    useStockAlerts();

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
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "productName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Name
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div
            className="font-medium cursor-pointer hover:underline"
            onClick={() => router.push(`/h/stock/${row.original.stockId}`)}
          >
            {row.getValue("productName")}
          </div>
        );
      },
    },
    {
      accessorKey: "sku",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            SKU
          </Button>
        );
      },
    },
    {
      accessorKey: "location",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Location
          </Button>
        );
      },
    },
    {
      accessorKey: "alertType",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Alert Type
          </Button>
        );
      },
      cell: ({ row }) => {
        const alertType = row.getValue("alertType") as string;
        return (
          <Badge variant={alertType === "low-stock" ? "success" : "error"}>
            {alertType.charAt(0).toUpperCase() + alertType.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "severity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Severity
          </Button>
        );
      },
      cell: ({ row }) => {
        const severity = row.getValue("severity") as string;
        return (
          <Badge
            variant={
              severity === "low"
                ? "success"
                : severity === "medium"
                ? "warning"
                : "error"
            }
          >
            {severity.charAt(0).toUpperCase() + severity.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={
              status === "active"
                ? "info"
                : status === "resolved"
                ? "success"
                : "muted"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div>{new Date(row.getValue("createdAt")).toLocaleDateString()}</div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const alert = row.original;

        return (
          <DropdownMenuComponent
            trigger={
              <Button variant={"outline"} size={"icon"}>
                <IconDotsVertical />
              </Button>
            }
            items={[
              {
                content: (
                  <>
                    View Stock <IconEye />
                  </>
                ),
                onClick: () => router.push(`/h/stock/${alert.stockId}`),
              },
              ...(alert.status === "active"
                ? [
                    {
                      content: (
                        <>
                          Resolve
                          <IconCheck />
                        </>
                      ),
                      onClick: () => {
                        setDialog({
                          type: "resolve",
                          open: true,
                          alert,
                        });
                      },
                    },
                    {
                      content: (
                        <>
                          Dismiss
                          <IconX />
                        </>
                      ),
                      onClick: () => {
                        setDialog({
                          type: "dismiss",
                          open: true,
                          alert,
                        });
                      },
                    },
                  ]
                : []),
              {
                content: (
                  <>
                    Delete
                    <IconTrash />
                  </>
                ),
                onClick: () => {
                  setDialog({
                    type: "delete",
                    open: true,
                    alert,
                  });
                },
                className: "text-error",
              },
            ]}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: alerts,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      if (value == null) return false;
      return String(value)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase());
    },
    onGlobalFilterChange: setGlobalFilter,
  });

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        alert.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || alert.status === selectedStatus;

      const matchesSeverity =
        selectedSeverity === "all" || alert.severity === selectedSeverity;

      return matchesSearch && matchesStatus && matchesSeverity;
    });
  }, [alerts, searchQuery, selectedStatus, selectedSeverity]);

  // Get selected alerts from table selection
  const selectedAlerts = useMemo(() => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    return selectedRows.map((row) => row.original.id);
  }, [table]);

  const handleDeleteAlert = async () => {
    if (!dialog.alert) return;

    try {
      await deleteStockAlert({ id: dialog.alert.id });
      setDialog({ type: null, open: false, alert: null });
    } catch (error) {
      console.error("Error deleting alert:", error);
    }
  };

  const handleBulkDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    try {
      const ids = selectedRows.map((row) => row.original.id);
      await bulkDeleteStockAlerts({ ids });
      setDialog({ type: null, open: false, alert: null });
      table.resetRowSelection();
    } catch (error) {
      console.error("Error deleting alerts:", error);
    }
  };

  // Filter alerts based on search, status, and severity

  // Handle resolving an alert
  const handleResolveAlert = () => {
    if (dialog.alert) {
      updateStockAlert({
        id: dialog.alert.id,
        status: "resolved",
        notes: "Resolved manually by user",
      });
      setDialog({ type: null, open: false, alert: null });
    }
  };

  // Handle dismissing an alert
  const handleDismissAlert = () => {
    if (dialog.alert) {
      updateStockAlert({
        id: dialog.alert.id,
        status: "dismissed",
        notes: "Dismissed by user",
      });
      setDialog({ type: null, open: false, alert: null });
    }
  };

  // Handle bulk actions
  const handleBulkResolve = () => {
    if (selectedAlerts.length > 0) {
      selectedAlerts.forEach((alertId) => {
        updateStockAlert({
          id: alertId,
          status: "resolved",
          notes: "Bulk resolved",
        });
      });
      table.resetRowSelection();
      toast.success(`${selectedAlerts.length} alerts resolved successfully`);
    }
  };

  const handleBulkDismiss = () => {
    if (selectedAlerts.length > 0) {
      selectedAlerts.forEach((alertId) => {
        updateStockAlert({
          id: alertId,
          status: "dismissed",
          notes: "Bulk dismissed",
        });
      });
      table.resetRowSelection();
      toast.success(`${selectedAlerts.length} alerts dismissed successfully`);
    }
  };

  return (
    <div className="space-y-4 w-full overflow-x-auto">
      <div className="flex items-center gap-2">
        <SearchInput
          placeholder="Search alerts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="min-w-80"
        />
        <Selector
          value={selectedStatus}
          onChange={setSelectedStatus}
          placeholder="Filter by status"
          options={[
            { label: "All Status", value: "all" },
            { label: "Active", value: "active" },
            { label: "Resolved", value: "resolved" },
            { label: "Dismissed", value: "dismissed" },
          ]}
        />
        <Selector
          value={selectedSeverity}
          onChange={setSelectedSeverity}
          placeholder="Filter by severity"
          options={[
            { label: "All Severity", value: "all" },
            { label: "Low", value: "low" },
            { label: "Medium", value: "medium" },
            { label: "High", value: "high" },
          ]}
        />

        <div className="ml-auto" />

        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <>
            <Button variant="outline" onClick={handleBulkResolve}>
              <IconCheck />
              Resolve All{" "}
              {`(${table.getFilteredSelectedRowModel().rows.length})`}
            </Button>
            <Button variant="outline" onClick={handleBulkDismiss}>
              <IconX />
              Dismiss All{" "}
              {`(${table.getFilteredSelectedRowModel().rows.length})`}
            </Button>
          </>
        )}

        <DropdownMenuCheckboxComponent
          type="checkbox"
          trigger={
            <Button variant="outline" size={"icon"}>
              <EyeIcon />
            </Button>
          }
          items={table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => ({
              label: column.id,
              checked: column.getIsVisible(),
              onCheckedChange: (value) => column.toggleVisibility(!!value),
            }))}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading Alerts...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => router.push(`/h/stock/${row.original.id}`)}
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
                  No alerts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        currentPage={1}
        pageSize={10}
        totalItems={100}
        totalPages={10}
        pageSizeOptions={[10, 20, 30, 40, 50]}
        onPageChange={noop}
      />

      {/* Combined Dialog Component */}
      <AlertDialogComponent
        open={dialog.open}
        onOpenChange={(open) => {
          if (!open) setDialog({ ...dialog, open: false });
        }}
        title={
          dialog.type === "resolve"
            ? "Resolve Alert"
            : dialog.type === "dismiss"
            ? "Dismiss Alert"
            : dialog.type === "delete"
            ? "Delete Alert"
            : dialog.type === "bulkDelete"
            ? "Delete Multiple Alerts"
            : ""
        }
        description={
          dialog.type === "resolve"
            ? "Are you sure you want to mark this alert as resolved? This will indicate that the issue has been addressed."
            : dialog.type === "dismiss"
            ? "Are you sure you want to dismiss this alert? This will ignore the alert without resolving the underlying issue."
            : dialog.type === "delete"
            ? "Are you sure you want to delete this alert? This action cannot be undone."
            : dialog.type === "bulkDelete"
            ? "Are you sure you want to delete these alerts? This action cannot be undone."
            : ""
        }
        confirmButton={
          dialog.type === "delete" || dialog.type === "bulkDelete" ? (
            <span className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </span>
          ) : dialog.type === "resolve" ? (
            "Resolve"
          ) : dialog.type === "dismiss" ? (
            "Dismiss"
          ) : (
            "Confirm"
          )
        }
        cancelButton="Cancel"
        onConfirm={
          dialog.type === "resolve"
            ? handleResolveAlert
            : dialog.type === "dismiss"
            ? handleDismissAlert
            : dialog.type === "delete"
            ? handleDeleteAlert
            : dialog.type === "bulkDelete"
            ? handleBulkDelete
            : undefined
        }
      />
    </div>
  );
}
