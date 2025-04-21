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
import { toast } from "sonner";
import { Edit, EyeIcon, MoreVertical, Trash, Upload } from "lucide-react";
import {
  AlertDialogComponent,
} from "@/components/ui/alert-dialog";
import { BulkUpload } from "@/components/ui/bulk-upload";
import {
  IconDownload,
  IconFileSpreadsheet,
  IconFileText,
} from "@tabler/icons-react";
import { useWarehousing } from "@/hooks/use-warehousing";
import { WarehouseInventoryFilters } from "./warehouse-inventory-filters";

// Interface for inventory items in a warehouse
interface WarehouseInventoryItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  location: string;
  quantity: number;
  minStockLevel: number;
  maxStockLevel: number;
  category: string;
  status: "in-stock" | "low-stock" | "out-of-stock";
  lastUpdated: Date;
}

interface WarehouseInventoryTableProps {
  warehouseId: string;
}

export function WarehouseInventoryTable({
  warehouseId,
}: WarehouseInventoryTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInventoryItem, setSelectedInventoryItem] =
    useState<WarehouseInventoryItem | null>(null);

  const { warehouses, isLoadingWarehouses } = useWarehousing();

  // Sample inventory items for demo
  const inventoryItems: WarehouseInventoryItem[] = useMemo(
    () => [
      {
        id: "inv1",
        productId: "p1",
        productName: "Laptop Pro X1",
        sku: "LPX1-001",
        location: "Zone A, Shelf 3",
        quantity: 25,
        minStockLevel: 10,
        maxStockLevel: 50,
        category: "Electronics",
        status: "in-stock",
        lastUpdated: new Date("2024-04-10"),
      },
      {
        id: "inv2",
        productId: "p2",
        productName: "Office Chair Ergo",
        sku: "OCE-002",
        location: "Zone B, Shelf 1",
        quantity: 8,
        minStockLevel: 10,
        maxStockLevel: 30,
        category: "Furniture",
        status: "low-stock",
        lastUpdated: new Date("2024-04-08"),
      },
      {
        id: "inv3",
        productId: "p3",
        productName: "Wireless Mouse",
        sku: "WM-003",
        location: "Zone A, Shelf 4",
        quantity: 42,
        minStockLevel: 15,
        maxStockLevel: 60,
        category: "Electronics",
        status: "in-stock",
        lastUpdated: new Date("2024-04-12"),
      },
      {
        id: "inv4",
        productId: "p4",
        productName: "USB-C Dock",
        sku: "USBC-004",
        location: "Zone A, Shelf 2",
        quantity: 0,
        minStockLevel: 5,
        maxStockLevel: 20,
        category: "Electronics",
        status: "out-of-stock",
        lastUpdated: new Date("2024-04-05"),
      },
      {
        id: "inv5",
        productId: "p5",
        productName: "Monitor Stand",
        sku: "MS-005",
        location: "Zone C, Shelf 2",
        quantity: 15,
        minStockLevel: 8,
        maxStockLevel: 25,
        category: "Office Accessories",
        status: "in-stock",
        lastUpdated: new Date("2024-04-09"),
      },
    ],
    []
  );

  // Get filters from URL
  const searchTerm = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "all";
  const locationFilter = searchParams.get("location") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const sortParam = searchParams.get("sort") || "name-asc";

  // Filter inventory items based on URL parameters
  const filteredInventoryItems = useMemo(() => {
    let filtered = [...inventoryItems];

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.productName.toLowerCase().includes(lowerSearch) ||
          item.sku.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply category filter
    if (categoryFilter && categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    // Apply location filter
    if (locationFilter && locationFilter !== "all") {
      filtered = filtered.filter((item) =>
        item.location.includes(locationFilter)
      );
    }

    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((item) => item.status === statusFilter);
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
            valueA = a.quantity;
            valueB = b.quantity;
            break;
          case "category":
            valueA = a.category;
            valueB = b.category;
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
    inventoryItems,
    searchTerm,
    categoryFilter,
    locationFilter,
    statusFilter,
    sortParam,
  ]);

  const handleDelete = (item: WarehouseInventoryItem) => {
    setSelectedInventoryItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedInventoryItem) {
      toast.success(
        `Deleted inventory item: ${selectedInventoryItem.productName}`
      );
      setDeleteDialogOpen(false);
      setSelectedInventoryItem(null);
    }
  };

  const handleBulkDelete = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      toast.success(`${selectedRows.length} inventory items deleted`);
      setRowSelection({});
    }
  };

  const handleExport = (type: string) => {
    toast.success(`Exporting data as ${type.toUpperCase()}`);
  };

  const handleBulkUpload = async (formData: FormData) => {
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Inventory data uploaded successfully");
    return Promise.resolve();
  };

  const columns: ColumnDef<WarehouseInventoryItem>[] = [
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
            className="pl-0"
          >
            Product Name
          </Button>
        );
      },
      cell: ({ row }) => (
        <div
          className="font-medium cursor-pointer hover:underline"
          onClick={() => router.push(`/h/products/${row.original.productId}`)}
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
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
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
      accessorKey: "minStockLevel",
      header: "Min Level",
    },
    {
      accessorKey: "maxStockLevel",
      header: "Max Level",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge
            variant={
              status === "out-of-stock"
                ? "error"
                : status === "low-stock"
                ? "warning"
                : "success"
            }
          >
            {status === "out-of-stock"
              ? "Out of Stock"
              : status === "low-stock"
              ? "Low Stock"
              : "In Stock"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "lastUpdated",
      header: "Last Updated",
      cell: ({ row }) => {
        const date = row.original.lastUpdated;
        return <div>{date.toLocaleDateString()}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original;

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
                  <>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </>
                ),
                onClick: () => toast.info(`Edit ${item.productName}`),
              },
              {
                content: (
                  <>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </>
                ),
                onClick: () => handleDelete(item),
                className: "text-destructive",
              },
            ]}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredInventoryItems,
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

  if (isLoadingWarehouses) {
    return (
      <div className="flex justify-center p-8">
        Loading warehouse inventory...
      </div>
    );
  }

  const warehouse = warehouses.find((w) => w.id === warehouseId);
  if (!warehouse) {
    return <div className="flex justify-center p-8">Warehouse not found</div>;
  }

  return (
    <div className="space-y-4 w-full overflow-x-auto">
      <div className="flex justify-between">
        <WarehouseInventoryFilters warehouseId={warehouseId} />
        <div className="flex gap-2 items-center">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button variant="outline" color="error" onClick={handleBulkDelete}>
              <Trash className="mr-2 h-4 w-4" />
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
            title="Warehouse Inventory"
            description="Upload multiple inventory items at once using CSV, Excel, or JSON files."
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
                  No inventory data found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={table.getState().pagination.pageIndex + 1}
        totalPages={table.getPageCount()}
        totalItems={filteredInventoryItems.length}
        pageSize={table.getState().pagination.pageSize}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        onPageSizeChange={(size) => table.setPageSize(parseInt(size))}
        pageSizeOptions={[10, 20, 30, 50, 100]}
      />

      <AlertDialogComponent
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Are you absolutely sure?"
        description={`This action will delete the inventory item: ${selectedInventoryItem?.productName}.`}
        cancelButton="Cancel"
        confirmButton="Delete"
        onConfirm={confirmDelete}
        className="sm:max-w-lg"
      />
    </div>
  );
}
