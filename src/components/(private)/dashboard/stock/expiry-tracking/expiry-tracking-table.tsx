"use client";

import { useState } from "react";
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
import { IStockExpiry } from "@/types/stock";
import { useStocks } from "@/hooks/use-stock";
import { toast } from "sonner";
import { Edit, MoreVertical, Trash, Bell, Calendar } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { format, differenceInDays } from "date-fns";

export function ExpiryTrackingTable() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpiry, setSelectedExpiry] = useState<IStockExpiry | null>(
    null
  );

  // In a real app, you would have a dedicated hook for expiry tracking
  // For now, we'll use the sample stock data from useStocks
  const { stocks, isLoadingStock } = useStocks();

  // Transform stock data to expiry tracking format
  const expiryItems: IStockExpiry[] = stocks
    .filter((stock) => stock.expiryDate) // Only include items with expiry dates
    .map((stock) => {
      const expiryDate = stock.expiryDate || new Date().toISOString();
      const daysToExpiry = differenceInDays(new Date(expiryDate), new Date());
      let status: "upcoming" | "imminent" | "expired" = "upcoming";
      if (daysToExpiry < 0) {
        status = "expired";
      } else if (daysToExpiry < 30) {
        status = "imminent";
      }

      return {
        id: stock.id,
        stockId: stock.id,
        productName: stock.productName,
        sku: stock.sku,
        location: stock.location,
        quantity: stock.quantity,
        expiryDate,
        daysToExpiry,
        status,
        notes: stock.notes,
      };
    });

  // Add some mock data if no items have expiry dates
  if (expiryItems.length === 0) {
    expiryItems.push(
      {
        id: "exp-1",
        stockId: "1",
        productName: "Laptop Pro X1",
        sku: "LP-X1-2024",
        location: "Warehouse A",
        quantity: 45,
        expiryDate: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 45
        ).toISOString(),
        daysToExpiry: 45,
        status: "upcoming",
        notes: "Software license expiry",
      },
      {
        id: "exp-2",
        stockId: "2",
        productName: "Office Chair Ergo",
        sku: "OC-E-2024",
        location: "Warehouse B",
        quantity: 8,
        expiryDate: new Date(
          Date.now() + 1000 * 60 * 60 * 24 * 15
        ).toISOString(),
        daysToExpiry: 15,
        status: "imminent",
        notes: "Warranty expiry",
      },
      {
        id: "exp-3",
        stockId: "3",
        productName: "Wireless Mouse",
        sku: "WM-2024",
        location: "Warehouse A",
        quantity: 0,
        expiryDate: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 10
        ).toISOString(),
        daysToExpiry: -10,
        status: "expired",
        notes: "Battery shelf life expired",
      }
    );
  }

  const handleDelete = (item: IStockExpiry) => {
    setSelectedExpiry(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedExpiry) {
      // In a real app, this would call an API through a hook
      toast.success(
        `Expiry record for ${selectedExpiry.productName} deleted successfully`
      );
      setDeleteDialogOpen(false);
      setSelectedExpiry(null);
    }
  };

  const columns: ColumnDef<IStockExpiry>[] = [
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
      cell: ({ row }) => {
        return <div>{row.getValue("sku")}</div>;
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
      cell: ({ row }) => {
        return <div>{row.getValue("location")}</div>;
      },
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Quantity
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div>{row.getValue("quantity")}</div>;
      },
    },
    {
      accessorKey: "expiryDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Expiry Date
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("expiryDate") as string);
        return <div>{format(date, "dd MMM yyyy")}</div>;
      },
    },
    {
      accessorKey: "daysToExpiry",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Days Left
          </Button>
        );
      },
      cell: ({ row }) => {
        const days = row.getValue("daysToExpiry") as number;
        const displayText =
          days < 0 ? `Expired ${Math.abs(days)} days ago` : `${days} days`;
        return <div>{displayText}</div>;
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
              status === "upcoming"
                ? "success"
                : status === "imminent"
                ? "warning"
                : "error"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;

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
                onClick={() => router.push(`/h/stock/${item.stockId}`)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast.success(`Notification set for ${item.productName}`);
                }}
              >
                <Bell className="mr-2 h-4 w-4" />
                Set Notification
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  toast.success(`Added ${item.productName} to calendar`);
                }}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleDelete(item)}
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
    data: expiryItems,
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
    return (
      <div className="flex justify-center my-8">Loading expiry data...</div>
    );
  }

  return (
    <>
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
                  No expiry tracking data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-end p-4 border-t">
          <div className="flex items-center space-x-2">
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
          </div>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              expiry record
              {selectedExpiry ? ` for ${selectedExpiry.productName}` : ""}.
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
    </>
  );
}
