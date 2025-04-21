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
import { Edit, EyeIcon, MoreVertical, Trash } from "lucide-react";
import { AlertDialogComponent } from "@/components/ui/alert-dialog";
import { useWarehousing } from "@/hooks/use-warehousing";
import { IconExternalLink } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";

export function WarehousesTable() {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(
    null
  );

  const { warehouses, isLoadingWarehouses } = useWarehousing();

  const handleDelete = (warehouseId: string) => {
    setSelectedWarehouseId(warehouseId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedWarehouseId) {
      const warehouse = warehouses.find((w) => w.id === selectedWarehouseId);
      toast.success(`Deleted warehouse: ${warehouse?.name}`);
      setDeleteDialogOpen(false);
      setSelectedWarehouseId(null);
    }
  };

  const columns: ColumnDef<any>[] = [
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
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="pl-0"
        >
          Name
        </Button>
      ),
      cell: ({ row }) => (
        <div
          className="font-medium cursor-pointer hover:underline flex items-center"
          onClick={() => router.push(`/h/warehousing/${row.original.id}`)}
        >
          {row.getValue("name")}
          <IconExternalLink className="ml-1 h-3 w-3 text-muted-foreground" />
        </div>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("type")}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        let variant: "success" | "warning" | "secondary" | "default" =
          "default";

        switch (status.toLowerCase()) {
          case "active":
            variant = "success";
            break;
          case "maintenance":
            variant = "warning";
            break;
          case "inactive":
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
      accessorKey: "capacity",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Capacity
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("capacity")} units</div>,
    },
    {
      accessorKey: "utilization",
      header: "Utilization",
      cell: ({ row }) => {
        const capacity = row.original.capacity;
        const utilization = row.original.utilization;
        const percentage =
          capacity > 0 ? Math.round((utilization / capacity) * 100) : 0;

        let variant: "success" | "warning" | "error" = "success";
        if (percentage > 90) variant = "error";
        else if (percentage > 75) variant = "warning";

        return <Badge variant={variant}>{percentage}%</Badge>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const warehouse = row.original;

        return (
          <DropdownMenuComponent
            trigger={
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
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
                onClick: () =>
                  router.push(`/h/warehousing/${warehouse.id}/edit`),
              },
              {
                content: (
                  <>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </>
                ),
                onClick: () => handleDelete(warehouse.id),
                className: "text-destructive",
              },
            ]}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: warehouses,
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
    return <div className="flex justify-center p-8">Loading warehouses...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter warehouses..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(e) =>
              table.getColumn("name")?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              variant="outline"
              className="text-destructive"
              onClick={() => {
                toast.success(
                  `${
                    table.getFilteredSelectedRowModel().rows.length
                  } warehouses deleted`
                );
                setRowSelection({});
              }}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete ({table.getFilteredSelectedRowModel().rows.length})
            </Button>
          )}
          <DropdownMenuCheckboxComponent
            type="checkbox"
            trigger={
              <Button variant="outline" size="icon">
                <EyeIcon className="h-4 w-4" />
                <span className="sr-only">Column visibility</span>
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
                  No warehouses found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        currentPage={table.getState().pagination.pageIndex + 1}
        totalPages={table.getPageCount()}
        totalItems={warehouses.length}
        pageSize={table.getState().pagination.pageSize}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        onPageSizeChange={(size) => table.setPageSize(parseInt(size))}
        pageSizeOptions={[10, 20, 30, 50]}
      />

      <AlertDialogComponent
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Warehouse"
        description="Are you sure you want to delete this warehouse? This action cannot be undone."
        cancelButton="Cancel"
        confirmButton="Delete"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
