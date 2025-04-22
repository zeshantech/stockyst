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
import { IStockLevel } from "@/types/stock";
import { useStocks } from "@/hooks/use-stock";
import { toast } from "sonner";
import { Edit, EyeIcon, MoreVertical, Trash, Upload } from "lucide-react";
import { StockLevelDialog } from "./stock-level-dialog";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { StockLevelsFilters } from "./stock-levels-filters";
import { BulkUpload } from "@/components/ui/bulk-upload";
import {
  IconDownload,
  IconFileSpreadsheet,
  IconFileText,
} from "@tabler/icons-react";

// Extended stock level interface to include location
interface ExtendedStockLevel extends IStockLevel {
  location: string;
  stockLevelStatus: "under-min" | "optimal" | "over-max";
  lastUpdated?: Date;
}

export function StockLevelsTable() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStockLevel, setSelectedStockLevel] =
    useState<ExtendedStockLevel | null>(null);

  const { stocks, isLoadingStock, deleteStock, bulkDeleteStock } = useStocks();

  // Get filters from URL
  const searchTerm = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "all";
  const locationFilter = searchParams.get("location") || "all";
  const stockLevelFilter = searchParams.get("level") || "all";
  const sortParam = searchParams.get("sort") || "name-asc";

  // Transform regular stock data to stock levels format with calculated stock level status
  const stockLevels = useMemo(() => {
    if (!stocks || stocks.length === 0) return [];

    return stocks.map((stock) => {
      // Calculate stock level status
      let stockLevelStatus: "under-min" | "optimal" | "over-max" = "optimal";

      if (stock.quantity < stock.reorderPoint) {
        stockLevelStatus = "under-min";
      } else if (stock.quantity > stock.reorderPoint * 2) {
        stockLevelStatus = "over-max";
      }

      return {
        id: stock.id,
        productId: stock.productId,
        productName: stock.productName,
        sku: stock.sku,
        location: stock.location,
        currentStock: stock.quantity,
        minLevel: stock.reorderPoint * 0.8,
        maxLevel: stock.reorderPoint * 2,
        reorderPoint: stock.reorderPoint,
        safetyStock: stock.reorderPoint * 0.5,
        preferredStockLevel: stock.reorderPoint * 1.5,
        status: stockLevelStatus,
        stockLevelStatus,
        lastUpdated: stock.updatedAt,
        notes: stock.notes,
      } as ExtendedStockLevel;
    });
  }, [stocks]);

  // Filter stock levels based on URL parameters
  const filteredStockLevels = useMemo(() => {
    let filtered = [...stockLevels];

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.productName.toLowerCase().includes(lowerSearch) ||
          item.sku.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply location filter
    if (locationFilter && locationFilter !== "all") {
      filtered = filtered.filter((item) =>
        item.location.includes(locationFilter)
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((item) => {
        if (statusFilter === "in-stock") return item.currentStock > 0;
        if (statusFilter === "low-stock")
          return (
            item.currentStock <= item.reorderPoint && item.currentStock > 0
          );
        if (statusFilter === "out-of-stock") return item.currentStock === 0;
        return true;
      });
    }

    // Apply stock level filter
    if (stockLevelFilter && stockLevelFilter !== "all") {
      filtered = filtered.filter((item) => item.status === stockLevelFilter);
    }

    // Apply sorting
    if (sortParam) {
      const [field, direction] = sortParam.split("-");
      const isAsc = direction === "asc";

      filtered.sort((a, b) => {
        let valueA, valueB;

        switch (field) {
          case "name":
            valueA = a.productName;
            valueB = b.productName;
            break;
          case "quantity":
            valueA = a.currentStock;
            valueB = b.currentStock;
            break;
          case "min-stock":
            valueA = a.minLevel;
            valueB = b.minLevel;
            break;
          case "max-stock":
            valueA = a.maxLevel;
            valueB = b.maxLevel;
            break;
          default:
            valueA = a.productName;
            valueB = b.productName;
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
    stockLevels,
    searchTerm,
    locationFilter,
    statusFilter,
    stockLevelFilter,
    sortParam,
  ]);

  const handleDelete = (stockLevel: ExtendedStockLevel) => {
    setSelectedStockLevel(stockLevel);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedStockLevel) {
      deleteStock({ id: selectedStockLevel.id });
      setDeleteDialogOpen(false);
      setSelectedStockLevel(null);
    }
  };

  const handleBulkDelete = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      const ids = selectedRows.map((row) => row.original.id);
      bulkDeleteStock({ ids });
      setRowSelection({});
      toast.success(`${selectedRows.length} stock level settings deleted`);
    }
  };

  const handleExport = (type: string) => {
    alert("export");
  };

  const handleBulkUpload = (formData: FormData) => {
    alert("import");
  };

  const columns: ColumnDef<ExtendedStockLevel>[] = [
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
      accessorKey: "productName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0"
          >
            Product Name
          </Button>
        );
      },
      cell: ({ row }) => (
        <div
          className="font-medium cursor-pointer hover:underline"
          onClick={() => router.push(`/h/stock/${row.original.id}`)}
        >
          {row.getValue("productName")}
        </div>
      ),
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => <div>{row.getValue("sku")}</div>,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => <div>{row.getValue("location")}</div>,
    },
    {
      accessorKey: "currentStock",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Current Stock
          </Button>
        );
      },
    },
    {
      accessorKey: "minLevel",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Min Level
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{Math.round(parseFloat(row.getValue("minLevel")))}</div>
      ),
    },
    {
      accessorKey: "maxLevel",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Max Level
          </Button>
        );
      },
      cell: ({ row }) => (
        <div>{Math.round(parseFloat(row.getValue("maxLevel")))}</div>
      ),
    },
    {
      accessorKey: "reorderPoint",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Reorder Point
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("reorderPoint")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={
              status === "under-min"
                ? "error"
                : status === "optimal"
                ? "success"
                : "warning"
            }
          >
            {status === "under-min"
              ? "Under Min"
              : status === "optimal"
              ? "Optimal"
              : "Over Max"}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const stockLevel = row.original;

        return (
          <DropdownMenuComponent
            trigger={
              <Button variant="ghost" size={"icon"}>
                <MoreVertical />
              </Button>
            }
            label="Actions"
            items={[
              {
                content: (
                  <StockLevelDialog
                    trigger={
                      <>
                        <Edit />
                        Edit
                      </>
                    }
                    stockLevel={stockLevel}
                  />
                ),
              },
              {
                content: (
                  <>
                    <Trash />
                    Delete
                  </>
                ),
                onClick: () => handleDelete(stockLevel),
                className: "text-destructive",
              },
            ]}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredStockLevels,
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
      <div className="flex justify-center p-8">Loading stock levels...</div>
    );
  }

  return (
    <div className="space-y-4 w-full overflow-x-auto">
      <div className="flex justify-between">
        <StockLevelsFilters />
        <div className="flex gap-2 items-center">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button variant="outline" color="error" onClick={handleBulkDelete}>
              <Trash />
              Delete Selected ({table.getFilteredSelectedRowModel().rows.length}
              )
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
                  No stock level data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={table.getState().pagination.pageIndex + 1}
        totalPages={table.getPageCount()}
        totalItems={filteredStockLevels.length}
        pageSize={table.getState().pagination.pageSize}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        onPageSizeChange={(size) => table.setPageSize(parseInt(size))}
        pageSizeOptions={[10, 20, 30, 50, 100]}
      />

      <AlertDialogComponent
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Are you absolutely sure?"
        description={`This action will delete the stock level settings for ${selectedStockLevel?.productName}.`}
        cancelButton="Cancel"
        confirmButton="Delete"
        onConfirm={confirmDelete}
        className="sm:max-w-lg"
      />
    </div>
  );
}
