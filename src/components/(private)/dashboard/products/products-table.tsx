"use client";

import * as React from "react";
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
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconDotsVertical,
  IconDownload,
  IconFileSpreadsheet,
  IconFileText,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuComponent,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IProduct } from "@/types/product";
import {
  useBulkDeleteProducts,
  useBulkUploadProducts,
  useUpdateProductStatus,
} from "@/hooks/use-products";
import {
  AlertDialogAction,
  AlertDialogComponent,
} from "@/components/ui/alert-dialog";
import { EyeIcon } from "lucide-react";
import { SearchInput } from "@/components/ui/search-input";
import Image from "next/image";

interface ProductsTableProps {
  data: IProduct[];
}

export function ProductsTable({ data }: ProductsTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = React.useState(false);
  const [deleteProductDialogOpen, setDeleteProductDialogOpen] =
    React.useState(false);
  const [productToDelete, setProductToDelete] = React.useState<string | null>(
    null
  );

  const { mutate: bulkDeleteProducts, isPending: isBulkDeleting } =
    useBulkDeleteProducts();
  useBulkUploadProducts();
  const { mutate: updateProductStatus, isPending: isUpdatingStatus } =
    useUpdateProductStatus();

  const columns: ColumnDef<IProduct>[] = [
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
      accessorKey: "product",
      header: "Product",
      cell: ({ row }) => {
        const name = row.original.name;
        const description = row.original.description as string;
        return (
          <div className="flex items-center gap-3">
            {row.original.image && (
              <Image
                src={row.original.image}
                alt={name}
                width={40}
                height={40}
                className="h-10 w-10 object-cover rounded-md border border-gray-200"
              />
            )}
            <div className="flex flex-col gap-1">
              <div
                className="font-medium cursor-pointer hover:underline"
                onClick={() => router.push(`/h/products/${row.original.id}`)}
              >
                {name}
              </div>
              <div
                className="max-w-[300px] text-xs text-muted-foreground line-clamp-2"
                title={description}
              >
                {description}
              </div>
            </div>
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
      accessorKey: "price",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
          </Button>
        );
      },
      cell: ({ row }) => {
        const price = parseFloat(row.getValue("price"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(price);
        return <div>{formatted}</div>;
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
        const quantity = row.getValue("quantity") as number;
        return (
          <Badge
            variant={
              quantity > 20 ? "success" : quantity > 10 ? "warning" : "error"
            }
          >
            {quantity}
          </Badge>
        );
      },
    },
    {
      accessorKey: "categoryId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Category
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div>{row.getValue("categoryId")}</div>;
      },
    },
    {
      accessorKey: "supplierId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Supplier
          </Button>
        );
      },
      cell: ({ row }) => {
        return <div>{row.getValue("supplierId")}</div>;
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
        const status = row.getValue("status") as
          | "active"
          | "inactive"
          | "discontinued";
        return (
          <Badge
            variant={
              status === "active"
                ? "success"
                : status === "inactive"
                ? "warning"
                : "error"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenuComponent
            trigger={
              <Button variant="ghost" size={"icon"}>
                <IconDotsVertical />
              </Button>
            }
            align="end"
            items={[
              {
                content: "View Details",
                separator: true,
                onClick: () => router.push(`/h/products/${product.id}`),
              },
              {
                content: "Mark as Active",
                onClick: () =>
                  updateProductStatus({ id: product.id, status: "active" }),
                disabled: product.status === "active" || isUpdatingStatus,
              },
              {
                content: "Mark as Inactive",
                onClick: () =>
                  updateProductStatus({ id: product.id, status: "inactive" }),
                disabled: product.status === "inactive" || isUpdatingStatus,
              },
              {
                content: "Mark as Discontinued",
                onClick: () =>
                  updateProductStatus({
                    id: product.id,
                    status: "discontinued",
                  }),
                separator: true,
                disabled: product.status === "discontinued" || isUpdatingStatus,
              },
              {
                content: "Delete Product",
                onClick: () => {
                  setProductToDelete(product.id);
                  setDeleteProductDialogOpen(true);
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
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
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
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const handleBulkDelete = async () => {
    const selectedProductIds = table
      .getFilteredSelectedRowModel()
      .rows.map((row) => row.original.id);

    if (selectedProductIds.length === 0) return;

    bulkDeleteProducts({ ids: selectedProductIds });
    setRowSelection({});
    setBulkDeleteDialogOpen(false);
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    bulkDeleteProducts({ ids: [productToDelete] });
    setProductToDelete(null);
    setDeleteProductDialogOpen(false);
  };

  const handleExport = (format: "csv" | "excel" | "json") => {
    // Filter out selected rows or use all if none selected
    const rowsToExport =
      Object.keys(rowSelection).length > 0
        ? table.getFilteredSelectedRowModel().rows
        : table.getFilteredRowModel().rows;

    const data = rowsToExport.map((row) => row.original);

    if (format === "json") {
      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = "products.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } else if (format === "csv") {
      if (data.length === 0) return;

      // Get headers from first item
      const headers = Object.keys(data[0]).filter(
        (key) => key !== "tags" && key !== "specifications"
      );

      // Transform data to CSV
      const csvContent = [
        headers.join(","),
        ...data.map((row) => {
          return headers
            .map((header) => {
              const value = row[header as keyof IProduct];
              if (typeof value === "string" && value.includes(",")) {
                return `"${value}"`;
              }
              return value;
            })
            .join(",");
        }),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const href = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = href;
      link.download = "products.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } else if (format === "excel") {
      // For Excel, we'd typically use a library like XLSX
      // but will just use CSV for simplicity in this example
      console.log("Excel export would happen here");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center space-x-2">
          <SearchInput
            placeholder="Search products..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <IconDownload />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                <IconFileText />
                Export to CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("excel")}>
                <IconFileSpreadsheet />
                Export to Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("json")}>
                <IconFileText />
                Export to JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" href="/h/products/import">
            <IconUpload />
            Import
          </Button>

          {Object.keys(rowSelection).length ? (
            <Button
              color="error"
              loading={isBulkDeleting}
              onClick={() => setBulkDeleteDialogOpen(true)}
            >
              <IconTrash />
              Delete Selected
            </Button>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={"icon"}>
                <EyeIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
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
                      {column.id === "product"
                        ? "Product"
                        : column.id === "sku"
                        ? "SKU"
                        : column.id === "price"
                        ? "Price"
                        : column.id === "quantity"
                        ? "Quantity"
                        : column.id === "category"
                        ? "Category"
                        : column.id === "supplier"
                        ? "Supplier"
                        : column.id === "status"
                        ? "Status"
                        : column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
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
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </span>
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={pageSize.toString()}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size={"icon"}
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronsLeft />
          </Button>
          <Button
            size={"icon"}
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft />
          </Button>
          <Button
            size={"icon"}
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight />
          </Button>
          <Button
            variant="outline"
            size={"icon"}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronsRight />
          </Button>
        </div>
      </div>

      <AlertDialogComponent
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        title="Are you sure?"
        description={`This will delete ${
          table.getFilteredSelectedRowModel().rows.length
        } selected products. This action cannot be undone.`}
        confirmButton={
          <AlertDialogAction
            onClick={handleBulkDelete}
            disabled={isBulkDeleting}
          >
            {isBulkDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        }
        cancelButton="Cancel"
      />

      <AlertDialogComponent
        open={deleteProductDialogOpen}
        onOpenChange={setDeleteProductDialogOpen}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmButton={
          <AlertDialogAction
            onClick={handleDeleteProduct}
            disabled={isBulkDeleting}
          >
            {isBulkDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        }
        cancelButton="Cancel"
      />
    </div>
  );
}
