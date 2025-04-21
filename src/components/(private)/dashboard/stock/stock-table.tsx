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
  noop,
  useReactTable,
} from "@tanstack/react-table";
import {
  IconDotsVertical,
  IconDownload,
  IconEye,
  IconFileSpreadsheet,
  IconFileText,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenuCheckboxComponent } from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TablePagination,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { IStock } from "@/types/stock";
import { BulkUpload } from "@/components/ui/bulk-upload";
import { DropdownMenuComponent } from "@/components/ui/dropdown-menu";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { useStocks } from "@/hooks/use-stock";
import { Selector } from "@/components/ui/selector";
import { SearchInput } from "@/components/ui/search-input";
import { EyeIcon, Upload } from "lucide-react";

export function StockTable() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [stockToDelete, setStockToDelete] = useState<IStock | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  const {
    stocks,
    isLoadingStock,
    deleteStock,
    bulkDeleteStock,
    bulkUploadStock,
    updateStockQuantity,
    updateStockLocation,
  } = useStocks();

  const columns: ColumnDef<IStock>[] = [
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
            onClick={() => router.push(`/h/stock/${row.original.id}`)}
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
    },
    {
      accessorKey: "unitCost",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Unit Cost
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("unitCost"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div>{formatted}</div>;
      },
    },
    {
      accessorKey: "totalValue",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Value
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("totalValue"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);
        return <div>{formatted}</div>;
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
              status === "in-stock"
                ? "success"
                : status === "low-stock"
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
      accessorKey: "lastRestocked",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Restocked
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <div>
            {new Date(row.getValue("lastRestocked")).toLocaleDateString()}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const stock = row.original;

        return (
          <DropdownMenuComponent
            trigger={
              <Button size={"icon"} variant={"ghost"}>
                <IconDotsVertical />
              </Button>
            }
            items={[
              {
                content: (
                  <>
                    <IconEye />
                    <span>View Details</span>
                  </>
                ),
                onClick: () => router.push(`/h/stock/${stock.id}`),
              },
              {
                content: (
                  <>
                    <IconPlus />
                    <span>Update Quantity</span>
                  </>
                ),
                onClick: () => {
                  const newQuantity = prompt(
                    "Enter new quantity:",
                    stock.quantity.toString()
                  );
                  if (newQuantity && !isNaN(Number(newQuantity))) {
                    updateStockQuantity({
                      id: stock.id,
                      quantity: Number(newQuantity),
                    });
                  }
                },
              },
              {
                content: (
                  <>
                    <IconPlus />
                    <span>Update Location</span>
                  </>
                ),
                onClick: () => {
                  const newLocation = prompt(
                    "Enter new location:",
                    stock.location
                  );
                  if (newLocation) {
                    updateStockLocation({
                      id: stock.id,
                      location: newLocation,
                    });
                  }
                },
                separator: true,
              },
              {
                content: (
                  <>
                    <IconTrash />
                    <span>Delete Stock</span>
                  </>
                ),
                className: "text-error",
                onClick: () => {
                  setStockToDelete(stock);
                  setDeleteDialogOpen(true);
                },
              },
            ]}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: stocks,
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

  const handleDeleteStock = async () => {
    if (!stockToDelete) return;

    try {
      await deleteStock({ id: stockToDelete.id });
      toast.success("Stock deleted successfully");
      setDeleteDialogOpen(false);
      setStockToDelete(null);
    } catch (error) {
      console.error("Error deleting stock:", error);
      toast.error("Failed to delete stock");
    }
  };

  const handleBulkDelete = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length === 0) return;

    try {
      const ids = selectedRows.map((row) => row.original.id);
      await bulkDeleteStock({ ids });
      toast.success(`${ids.length} stock items deleted successfully`);
      setBulkDeleteDialogOpen(false);
      table.resetRowSelection();
    } catch (error) {
      console.error("Error deleting stock items:", error);
      toast.error("Failed to delete stock items");
    }
  };

  const handleBulkUpload = async (formData: FormData) => {
    await bulkUploadStock({ formData });
  };

  const handleExport = (format: "csv" | "excel" | "json") => {
    // TODO: Implement export functionality
    toast.success(`Exporting stock as ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-4 w-full overflow-x-auto">
      <div className="flex flex-1 items-center gap-2">
        <SearchInput
          placeholder="Search stock..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
        />
        <Selector
          value={
            (table.getColumn("status")?.getFilterValue() as string) ?? "all"
          }
          onChange={(value) => table.getColumn("status")?.setFilterValue(value)}
          placeholder="Filter by status"
          options={[
            { label: "All", value: "all" },
            { label: "In Stock", value: "in-stock" },
            { label: "Low Stock", value: "low-stock" },
            { label: "Out of Stock", value: "out-of-stock" },
          ]}
        />

        <div className="ml-auto" />

        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <Button color="error" onClick={() => setBulkDeleteDialogOpen(true)}>
            <IconTrash />
            Delete Selected ({table.getFilteredSelectedRowModel().rows.length})
          </Button>
        )}
        <DropdownMenuComponent
          trigger={
            <Button variant="outline">
              <IconDownload />
              Export
            </Button>
          }
          items={[
            {
              content: (
                <>
                  <IconFileText />
                  <span>Export as CSV</span>
                </>
              ),
              onClick: () => handleExport("csv"),
            },
            {
              content: (
                <>
                  <IconFileSpreadsheet />
                  <span>Export as Excel</span>
                </>
              ),
              onClick: () => handleExport("excel"),
            },
            {
              content: (
                <>
                  <IconFileText />
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
              <Upload /> Import
            </Button>
          }
          title="Stock"
          description="Upload multiple stock items at once using CSV, Excel, or JSON files."
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
            {isLoadingStock ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading stock data...
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
                  No stock items found
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

      {/* Delete Confirmation Dialog */}
      <AlertDialogComponent
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Stock"
        description={`Are you sure you want to delete the stock item for "${stockToDelete?.productName}"? This action cannot be undone.`}
        cancelButton="Cancel"
        confirmButton="Delete"
        onConfirm={handleDeleteStock}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialogComponent
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        title="Delete Selected Stock Items"
        description={`Are you sure you want to delete ${
          table.getFilteredSelectedRowModel().rows.length
        } selected stock items? This action cannot be undone.`}
        cancelButton="Cancel"
        confirmButton="Delete"
        onConfirm={handleBulkDelete}
      />
    </div>
  );
}
