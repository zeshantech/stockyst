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
import { Edit, EyeIcon, MoreVertical, Trash, Upload, Plus } from "lucide-react";
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
import { WarehouseLocationsFilters } from "./warehouse-locations-filters";
import { ILocation } from "@/types/warehouse";

interface WarehouseLocationsTableProps {
  warehouseId: string;
}

export function WarehouseLocationsTable({
  warehouseId,
}: WarehouseLocationsTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<ILocation | null>(
    null
  );

  const {
    warehouses,
    locations,
    isLoadingWarehouses,
    isLoadingLocations,
    getLocationsByWarehouseId,
  } = useWarehousing();

  // Get filters from URL
  const searchTerm = searchParams.get("search") || "";
  const typeFilter = searchParams.get("type") || "all";
  const statusFilter = searchParams.get("status") || "all";
  const sortParam = searchParams.get("sort") || "name-asc";

  // Get locations for this warehouse
  const warehouseLocations = useMemo(() => {
    return getLocationsByWarehouseId(warehouseId);
  }, [warehouseId, getLocationsByWarehouseId]);

  // Filter locations based on URL parameters
  const filteredLocations = useMemo(() => {
    let filtered = [...warehouseLocations];

    // Apply search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerSearch) ||
          item.code.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply type filter
    if (typeFilter && typeFilter !== "all") {
      filtered = filtered.filter((item) => item.type === typeFilter);
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
            valueA = a.name;
            valueB = b.name;
            break;
          case "capacity":
            valueA = a.capacity;
            valueB = b.capacity;
            break;
          case "utilization":
            valueA = a.utilization;
            valueB = b.utilization;
            break;
          default:
            valueA = a.name;
            valueB = b.name;
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
  }, [warehouseLocations, searchTerm, typeFilter, statusFilter, sortParam]);

  const handleDelete = (location: ILocation) => {
    setSelectedLocation(location);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedLocation) {
      toast.success(`Deleted location: ${selectedLocation.name}`);
      setDeleteDialogOpen(false);
      setSelectedLocation(null);
    }
  };

  const handleBulkDelete = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    if (selectedRows.length > 0) {
      toast.success(`${selectedRows.length} locations deleted`);
      setRowSelection({});
    }
  };

  const handleExport = (type: string) => {
    toast.success(`Exporting data as ${type.toUpperCase()}`);
  };

  const handleBulkUpload = async (formData: FormData) => {
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Locations data uploaded successfully");
    return Promise.resolve();
  };

  const columns: ColumnDef<ILocation>[] = [
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
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="pl-0"
          >
            Location Name
          </Button>
        );
      },
      cell: ({ row }) => (
        <div
          className="font-medium cursor-pointer hover:underline"
          onClick={() =>
            router.push(`/h/warehousing/locations/${row.original.id}`)
          }
        >
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => <div>{row.getValue("code")}</div>,
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="capitalize">
          {(row.getValue("type") as string).replace("-", " ")}
        </div>
      ),
    },
    {
      accessorKey: "capacity",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Capacity
          </Button>
        );
      },
    },
    {
      accessorKey: "utilization",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Utilization
          </Button>
        );
      },
    },
    {
      id: "utilizationPercentage",
      header: "Utilization %",
      cell: ({ row }) => {
        const capacity = row.original.capacity;
        const utilization = row.original.utilization;
        const percentage = capacity
          ? Math.round((utilization / capacity) * 100)
          : 0;

        let variant = "success";
        if (percentage > 90) variant = "error";
        else if (percentage > 75) variant = "warning";

        return <Badge variant={variant}>{percentage}%</Badge>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let variant: "success" | "warning" | "error" | "secondary" =
          "secondary";

        switch (status) {
          case "active":
            variant = "success";
            break;
          case "inactive":
            variant = "error";
            break;
          case "maintenance":
            variant = "warning";
            break;
          case "reserved":
            variant = "secondary";
            break;
        }

        return (
          <Badge variant={variant} className="capitalize">
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const location = row.original;

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
                onClick: () => toast.info(`Edit ${location.name}`),
              },
              {
                content: (
                  <>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </>
                ),
                onClick: () => handleDelete(location),
                className: "text-destructive",
              },
            ]}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredLocations,
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

  if (isLoadingWarehouses || isLoadingLocations) {
    return (
      <div className="flex justify-center p-8">
        Loading warehouse locations...
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
        <WarehouseLocationsFilters warehouseId={warehouseId} />
        <div className="flex gap-2 items-center">
          <Button
            onClick={() =>
              router.push(`/h/warehousing/${warehouseId}/locations/add`)
            }
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>

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
            title="Warehouse Locations"
            description="Upload multiple location definitions at once using CSV, Excel, or JSON files."
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
                  No locations found. Click "Add Location" to create a storage
                  location.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={table.getState().pagination.pageIndex + 1}
        totalPages={table.getPageCount()}
        totalItems={filteredLocations.length}
        pageSize={table.getState().pagination.pageSize}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        onPageSizeChange={(size) => table.setPageSize(parseInt(size))}
        pageSizeOptions={[10, 20, 30, 50, 100]}
      />

      <AlertDialogComponent
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Are you absolutely sure?"
        description={`This action will delete the location: ${selectedLocation?.name}. This may affect inventory and operations.`}
        cancelButton="Cancel"
        confirmButton="Delete"
        onConfirm={confirmDelete}
        className="sm:max-w-lg"
      />
    </div>
  );
}
