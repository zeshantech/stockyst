"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import { IStockTransfer } from "@/types/stock";
import { useStocks } from "@/hooks/use-stock";
import { toast } from "sonner";
import { Edit, Eye, MoreVertical, Trash, FileText, Truck } from "lucide-react";
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
import { StockTransfersFilters } from "./stock-transfers-filters";
import { format } from "date-fns";
import { TablePagination } from "@/components/ui/table";

export function StockTransfersTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] =
    useState<IStockTransfer | null>(null);

  // Get filters from URL
  const searchTerm = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "all";
  const sourceLocationFilter = searchParams.get("source") || "all";
  const destinationLocationFilter = searchParams.get("destination") || "all";
  const dateRangeFilter = searchParams.get("date") || "all";
  const sortParam = searchParams.get("sort") || "date-desc";

  // This would come from the useStocks hook in a real application
  const { isLoadingStock } = useStocks();

  // Mock stock transfer data
  const transferData: IStockTransfer[] = [
    {
      id: "1",
      transferNumber: "TR-001",
      status: "completed",
      sourceLocationId: "1",
      sourceLocationName: "Warehouse A",
      destinationLocationId: "2",
      destinationLocationName: "Warehouse B",
      requestedBy: "John Doe",
      requestedDate: new Date("2023-06-01").toISOString(),
      completedDate: new Date("2023-06-02").toISOString(),
      notes: "Regular transfer",
      items: [
        {
          id: "1",
          transferId: "1",
          stockId: "1",
          productName: "Laptop Pro X1",
          sku: "LP-X1-2023",
          quantity: 5,
        },
        {
          id: "2",
          transferId: "1",
          stockId: "2",
          productName: "Office Chair Ergo",
          sku: "OC-E-2023",
          quantity: 3,
        },
      ],
      createdAt: new Date("2023-06-01"),
      updatedAt: new Date("2023-06-02"),
    },
    {
      id: "2",
      transferNumber: "TR-002",
      status: "in-progress",
      sourceLocationId: "2",
      sourceLocationName: "Warehouse B",
      destinationLocationId: "3",
      destinationLocationName: "Store Front",
      requestedBy: "Jane Smith",
      requestedDate: new Date("2023-06-05").toISOString(),
      notes: "Urgent transfer",
      items: [
        {
          id: "3",
          transferId: "2",
          stockId: "3",
          productName: "Wireless Mouse",
          sku: "WM-2023",
          quantity: 10,
        },
      ],
      createdAt: new Date("2023-06-05"),
      updatedAt: new Date("2023-06-05"),
    },
    {
      id: "3",
      transferNumber: "TR-003",
      status: "draft",
      sourceLocationId: "1",
      sourceLocationName: "Warehouse A",
      destinationLocationId: "3",
      destinationLocationName: "Store Front",
      requestedBy: "Mike Johnson",
      requestedDate: new Date("2023-06-10").toISOString(),
      notes: "Monthly stock replenishment",
      items: [
        {
          id: "4",
          transferId: "3",
          stockId: "4",
          productName: "Desk Lamp",
          sku: "DL-2023",
          quantity: 8,
        },
        {
          id: "5",
          transferId: "3",
          stockId: "5",
          productName: "Coffee Maker",
          sku: "CM-2023",
          quantity: 2,
        },
      ],
      createdAt: new Date("2023-06-10"),
      updatedAt: new Date("2023-06-10"),
    },
  ];

  // Filter transfers based on URL parameters
  const filteredTransfers = useMemo(() => {
    let filtered = [...transferData];

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.transferNumber.toLowerCase().includes(lowerSearch) ||
          item.sourceLocationName.toLowerCase().includes(lowerSearch) ||
          item.destinationLocationName.toLowerCase().includes(lowerSearch) ||
          item.requestedBy.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    // Apply source location filter
    if (sourceLocationFilter && sourceLocationFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.sourceLocationId === sourceLocationFilter
      );
    }

    // Apply destination location filter
    if (destinationLocationFilter && destinationLocationFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.destinationLocationId === destinationLocationFilter
      );
    }

    // Apply date range filter
    if (dateRangeFilter && dateRangeFilter !== "all") {
      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));

      filtered = filtered.filter((item) => {
        const requestDate = new Date(item.requestedDate);

        switch (dateRangeFilter) {
          case "today":
            return requestDate >= today;
          case "week":
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            return requestDate >= weekStart;
          case "month":
            const monthStart = new Date(
              today.getFullYear(),
              today.getMonth(),
              1
            );
            return requestDate >= monthStart;
          case "quarter":
            const quarterStart = new Date(today);
            quarterStart.setMonth(today.getMonth() - 3);
            return requestDate >= quarterStart;
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
          case "date":
            valueA = new Date(a.requestedDate).getTime();
            valueB = new Date(b.requestedDate).getTime();
            break;
          case "number":
            valueA = a.transferNumber;
            valueB = b.transferNumber;
            break;
          case "source":
            valueA = a.sourceLocationName;
            valueB = b.sourceLocationName;
            break;
          case "destination":
            valueA = a.destinationLocationName;
            valueB = b.destinationLocationName;
            break;
          default:
            valueA = new Date(a.requestedDate).getTime();
            valueB = new Date(b.requestedDate).getTime();
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
    transferData,
    searchTerm,
    statusFilter,
    sourceLocationFilter,
    destinationLocationFilter,
    dateRangeFilter,
    sortParam,
  ]);

  const handleDelete = (transfer: IStockTransfer) => {
    setSelectedTransfer(transfer);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTransfer) {
      // In a real application, this would call the deleteStockTransfer function from useStocks
      toast.success(
        `Transfer ${selectedTransfer.transferNumber} deleted successfully`
      );
      setDeleteDialogOpen(false);
      setSelectedTransfer(null);
    }
  };

  const handleBulkDelete = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      const transferNumbers = selectedRows.map(
        (row) => row.original.transferNumber
      );
      // In a real application, this would call the bulkDeleteStockTransfer function from useStocks
      toast.success(`${selectedRows.length} transfers deleted successfully`);
      setRowSelection({});
    }
  };

  const columns: ColumnDef<IStockTransfer>[] = [
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
      accessorKey: "transferNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0"
          >
            Transfer #
          </Button>
        );
      },
      cell: ({ row }) => (
        <div
          className="font-medium cursor-pointer hover:underline"
          onClick={() => router.push(`/h/stock/transfers/${row.original.id}`)}
        >
          {row.getValue("transferNumber")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={
              status === "completed"
                ? "success"
                : status === "in-progress"
                ? "warning"
                : status === "draft"
                ? "info"
                : "error"
            }
          >
            {status === "in-progress"
              ? "In Progress"
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "sourceLocationName",
      header: "From",
      cell: ({ row }) => <div>{row.getValue("sourceLocationName")}</div>,
    },
    {
      accessorKey: "destinationLocationName",
      header: "To",
      cell: ({ row }) => <div>{row.getValue("destinationLocationName")}</div>,
    },
    {
      accessorKey: "requestedDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = row.getValue("requestedDate") as string;
        return <div>{format(new Date(date), "dd MMM yyyy")}</div>;
      },
    },
    {
      accessorKey: "requestedBy",
      header: "Requested By",
      cell: ({ row }) => <div>{row.getValue("requestedBy")}</div>,
    },
    {
      id: "itemCount",
      header: "Items",
      cell: ({ row }) => <div>{row.original.items.length}</div>,
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transfer = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => router.push(`/h/stock/transfers/${transfer.id}`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  router.push(`/h/stock/transfers/${transfer.id}/edit`)
                }
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {transfer.status === "draft" && (
                <DropdownMenuItem
                  onClick={() => {
                    // Navigate to transfer detail page where they can start the transfer
                    router.push(`/h/stock/transfers/${transfer.id}`);
                  }}
                >
                  <Truck className="mr-2 h-4 w-4" />
                  Start Transfer
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  toast.success(`Transfer ${transfer.transferNumber} exported`);
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                Export PDF
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDelete(transfer)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

  if (isLoadingStock) {
    return <div className="flex justify-center p-8">Loading transfers...</div>;
  }

  return (
    <div className="space-y-4">
      <StockTransfersFilters />

      <div className="rounded-md border">
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <div className="p-2 border-b">
            <Button
              variant="outline"
              color="error"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash className="h-4 w-4 mr-2" />
              Delete Selected ({table.getFilteredSelectedRowModel().rows.length}
              )
            </Button>
          </div>
        )}

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
                  No transfer data found.
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the transfer
              {selectedTransfer ? ` ${selectedTransfer.transferNumber}` : ""}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
