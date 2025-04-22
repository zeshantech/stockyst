"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
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
import {
  IconEdit,
  IconTrash,
  IconEye,
  IconTruck,
  IconArrowRight,
  IconDownload,
  IconFileSpreadsheet,
  IconFileText,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenuCheckboxComponent,
  DropdownMenuComponent,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
} from "@/components/ui/table";
import { ITransfer } from "@/types/warehouse";
import { useWarehousing, useDeleteTransfer } from "@/hooks/use-warehousing";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { TransfersFilters } from "./transfers-filters";
import { BulkUpload } from "@/components/ui/bulk-upload";
import { EyeIcon } from "lucide-react";

// Status badge component for transfers
const TransferStatusBadge = ({ status }: { status: ITransfer["status"] }) => {
  const statusMap: Record<
    ITransfer["status"],
    {
      label: string;
      variant: "default" | "success" | "error" | "outline" | "secondary";
    }
  > = {
    draft: { label: "Draft", variant: "outline" },
    pending: { label: "Pending", variant: "secondary" },
    "in-transit": { label: "In Transit", variant: "default" },
    completed: { label: "Completed", variant: "success" },
    cancelled: { label: "Cancelled", variant: "error" },
  };

  const { label, variant } = statusMap[status] || {
    label: status,
    variant: "default",
  };

  return <Badge variant={variant}>{label}</Badge>;
};

export function TransfersTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<ITransfer | null>(
    null
  );

  const { transfers, warehouses, isLoadingTransfers } = useWarehousing();
  const { mutate: deleteTransfer } = useDeleteTransfer();

  // Get filters from URL
  const searchTerm = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "all";
  const sourceFilter = searchParams.get("source") || "all";
  const destinationFilter = searchParams.get("destination") || "all";
  const dateRangeFilter = searchParams.get("date") || "all";
  const sortParam = searchParams.get("sort") || "date-desc";

  // Function to get warehouse name by ID
  const getWarehouseName = (id: string) => {
    const warehouse = warehouses?.find((w) => w.id === id);
    return warehouse ? warehouse.name : id;
  };

  // Filter transfers based on URL parameters
  const filteredTransfers = useMemo(() => {
    if (!transfers) return [];

    let filtered = [...transfers];

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.id.toLowerCase().includes(lowerSearch) ||
          (item.trackingNumber &&
            item.trackingNumber.toLowerCase().includes(lowerSearch)) ||
          getWarehouseName(item.sourceWarehouseId)
            .toLowerCase()
            .includes(lowerSearch) ||
          getWarehouseName(item.destinationWarehouseId)
            .toLowerCase()
            .includes(lowerSearch)
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply source filter
    if (sourceFilter && sourceFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.sourceWarehouseId === sourceFilter
      );
    }

    // Apply destination filter
    if (destinationFilter && destinationFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.destinationWarehouseId === destinationFilter
      );
    }

    // Apply date range filter
    if (dateRangeFilter && dateRangeFilter !== "all") {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));

      filtered = filtered.filter((item) => {
        const initiatedDate = new Date(item.initiatedAt);

        switch (dateRangeFilter) {
          case "today":
            return initiatedDate >= today;
          case "week":
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - 7);
            return initiatedDate >= weekStart;
          case "month":
            const monthStart = new Date(
              today.getFullYear(),
              today.getMonth(),
              1
            );
            return initiatedDate >= monthStart;
          case "quarter":
            const quarterStart = new Date(today);
            quarterStart.setMonth(today.getMonth() - 3);
            return initiatedDate >= quarterStart;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    if (sortParam) {
      const [field, direction] = sortParam.split("-");
      const isAsc = direction === "asc";

      filtered.sort((a, b) => {
        let valueA, valueB;

        switch (field) {
          case "id":
            valueA = a.id;
            valueB = b.id;
            break;
          case "date":
            valueA = new Date(a.initiatedAt).getTime();
            valueB = new Date(b.initiatedAt).getTime();
            break;
          case "arrival":
            if (a.estimatedArrival && b.estimatedArrival) {
              valueA = new Date(a.estimatedArrival).getTime();
              valueB = new Date(b.estimatedArrival).getTime();
            } else if (a.estimatedArrival) {
              return isAsc ? -1 : 1;
            } else if (b.estimatedArrival) {
              return isAsc ? 1 : -1;
            } else {
              valueA = 0;
              valueB = 0;
            }
            break;
          case "items":
            valueA = a.items.length;
            valueB = b.items.length;
            break;
          default:
            valueA = new Date(a.initiatedAt).getTime();
            valueB = new Date(b.initiatedAt).getTime();
        }

        if (typeof valueA === "string" && typeof valueB === "string") {
          return isAsc
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        } else {
          return isAsc
            ? (valueA as number) - (valueB as number)
            : (valueB as number) - (valueA as number);
        }
      });
    }

    return filtered;
  }, [
    transfers,
    searchTerm,
    statusFilter,
    sourceFilter,
    destinationFilter,
    dateRangeFilter,
    sortParam,
    warehouses,
    getWarehouseName,
  ]);

  const handleDelete = (transfer: ITransfer) => {
    setSelectedTransfer(transfer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTransfer) {
      deleteTransfer({ id: selectedTransfer.id });
      setDeleteDialogOpen(false);
      setSelectedTransfer(null);
    }
  };

  const handleBulkDelete = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      selectedRows.forEach((row) => {
        deleteTransfer({ id: row.original.id });
      });
      setRowSelection({});
      toast.success(`${selectedRows.length} transfers deleted`);
    }
  };

  const handleExport = (type: string) => {
    toast.success(`Exported transfers as ${type.toUpperCase()}`);
  };

  const handleBulkUpload = async (formData: FormData) => {
    // This would be an API call in a real app
    toast.success("Transfers imported successfully");
    return Promise.resolve();
  };

  // Function to render direction icon based on transfer direction
  const DirectionIcon = ({
    sourceId,
    destinationId,
  }: {
    sourceId: string;
    destinationId: string;
  }) => (
    <div className="flex items-center gap-1 text-muted-foreground">
      <div className="min-w-24 truncate text-right">
        {getWarehouseName(sourceId)}
      </div>
      <IconArrowRight className="h-4 w-4 shrink-0" />
      <div className="min-w-24 truncate">{getWarehouseName(destinationId)}</div>
    </div>
  );

  const columns: ColumnDef<ITransfer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            !!table.getIsAllPageRowsSelected() ||
            !!(table.getIsSomePageRowsSelected() && "indeterminate")
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
      accessorKey: "id",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0"
          >
            ID/Tracking
          </Button>
        );
      },
      cell: ({ row }) => (
        <div
          className="space-y-1 cursor-pointer hover:underline"
          onClick={() =>
            router.push(`/h/warehousing/transfers/${row.original.id}`)
          }
        >
          <div className="flex items-center">
            <IconTruck className="mr-2 h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{row.original.id}</span>
          </div>
          {row.original.trackingNumber && (
            <div className="text-xs text-muted-foreground">
              {row.original.trackingNumber}
            </div>
          )}
        </div>
      ),
    },
    {
      id: "direction",
      header: "From ↔ To",
      cell: ({ row }) => (
        <DirectionIcon
          sourceId={row.original.sourceWarehouseId}
          destinationId={row.original.destinationWarehouseId}
        />
      ),
    },
    {
      accessorKey: "initiatedAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Initiated
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="space-y-1">
          <div>{format(new Date(row.original.initiatedAt), "MMM d, yyyy")}</div>
          <div className="text-xs text-muted-foreground">
            by {row.original.initiatedBy}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <TransferStatusBadge status={row.original.status} />,
    },
    {
      id: "itemCount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Items
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.original.items.length}
        </div>
      ),
    },
    {
      accessorKey: "estimatedArrival",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Arrival
          </Button>
        );
      },
      cell: ({ row }) =>
        row.original.estimatedArrival ? (
          format(new Date(row.original.estimatedArrival), "MMM d, yyyy")
        ) : (
          <span className="text-muted-foreground">Not set</span>
        ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const transfer = row.original;

        return (
          <DropdownMenuComponent
            trigger={
              <Button variant="ghost" size="icon">
                <IconEye className="h-4 w-4" />
              </Button>
            }
            label="Actions"
            items={
              [
                {
                  content: (
                    <>
                      <IconEye className="mr-2 h-4 w-4" />
                      View Details
                    </>
                  ),
                  onClick: () =>
                    router.push(`/h/warehousing/transfers/${transfer.id}`),
                },
                transfer.status !== "completed" &&
                  transfer.status !== "cancelled" && {
                    content: (
                      <>
                        <IconEdit className="mr-2 h-4 w-4" />
                        Edit
                      </>
                    ),
                    onClick: () =>
                      router.push(
                        `/h/warehousing/transfers/${transfer.id}/edit`
                      ),
                  },
                transfer.status === "draft" && {
                  content: (
                    <>
                      <IconTrash className="mr-2 h-4 w-4" />
                      Delete
                    </>
                  ),
                  onClick: () => handleDelete(transfer),
                  className: "text-destructive",
                },
              ].filter(Boolean) as {
                content: React.ReactNode;
                onClick?: () => void;
                className?: string;
              }[]
            }
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredTransfers,
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
    },
  });

  if (isLoadingTransfers) {
    return <div className="flex justify-center p-8">Loading transfers...</div>;
  }

  return (
    <div className="space-y-4 w-full overflow-x-auto">
      <div className="flex justify-between">
        <TransfersFilters />
        <div className="flex gap-2 items-center">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button variant="outline" color="error" onClick={handleBulkDelete}>
              <IconTrash className="mr-2 h-4 w-4" />
              Delete Selected ({table.getFilteredSelectedRowModel().rows.length}
              )
            </Button>
          )}

          <DropdownMenuComponent
            trigger={
              <Button variant="outline">
                <IconDownload className="mr-2 h-4 w-4" />
                Export
              </Button>
            }
            items={[
              {
                content: (
                  <>
                    <IconFileText className="mr-2 h-4 w-4" />
                    <span>Export as CSV</span>
                  </>
                ),
                onClick: () => handleExport("csv"),
              },
              {
                content: (
                  <>
                    <IconFileSpreadsheet className="mr-2 h-4 w-4" />
                    <span>Export as Excel</span>
                  </>
                ),
                onClick: () => handleExport("excel"),
              },
              {
                content: (
                  <>
                    <IconFileText className="mr-2 h-4 w-4" />
                    <span>Export as JSON</span>
                  </>
                ),
                onClick: () => handleExport("json"),
              },
            ]}
          />
          <BulkUpload
            trigger={
              <Button variant={"outline"}>
                <Upload className="mr-2 h-4 w-4" /> Import
              </Button>
            }
            title="Stock Transfers"
            description="Upload multiple transfers at once using CSV, Excel, or JSON files."
            onUpload={handleBulkUpload}
            onExport={handleExport}
          />
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() =>
                    router.push(`/h/warehousing/transfers/${row.original.id}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={(e) => {
                        if (
                          cell.column.id === "actions" ||
                          cell.column.id === "select"
                        ) {
                          e.stopPropagation();
                        }
                      }}
                    >
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
                  No transfers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={table.getState().pagination.pageIndex + 1}
        totalPages={table.getPageCount()}
        totalItems={filteredTransfers.length}
        pageSize={table.getState().pagination.pageSize}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        onPageSizeChange={(size) => table.setPageSize(parseInt(size))}
        pageSizeOptions={[10, 20, 30, 50, 100]}
      />

      <AlertDialogComponent
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Are you absolutely sure?"
        description={`This action will delete the transfer ${selectedTransfer?.id}.`}
        cancelButton="Cancel"
        confirmButton="Delete"
        onConfirm={confirmDelete}
        className="sm:max-w-lg"
      />
    </div>
  );
}
