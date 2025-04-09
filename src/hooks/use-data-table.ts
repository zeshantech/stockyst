import { useState, useMemo } from "react";
import {
  ColumnFiltersState,
  FilterFn,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Custom filter function that checks if a value contains a string
const containsString: FilterFn<any> = (row, columnId, filterValue) => {
  const value = row.getValue(columnId);
  if (value == null) return false;
  return String(value)
    .toLowerCase()
    .includes(String(filterValue).toLowerCase());
};

export function useDataTable<TData>({
  data,
  columns,
  initialSorting = [],
  initialColumnFilters = [],
  initialColumnVisibility = {},
  initialRowSelection = {},
  globalFilter = "",
  setGlobalFilter,
}: {
  data: TData[];
  columns: any[];
  initialSorting?: SortingState;
  initialColumnFilters?: ColumnFiltersState;
  initialColumnVisibility?: VisibilityState;
  initialRowSelection?: Record<string, boolean>;
  globalFilter?: string;
  setGlobalFilter?: (value: string) => void;
}) {
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility
  );
  const [rowSelection, setRowSelection] =
    useState<Record<string, boolean>>(initialRowSelection);

  const table = useReactTable({
    data,
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
    globalFilterFn: containsString,
    onGlobalFilterChange: setGlobalFilter,
  });

  return {
    table,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    globalFilter,
    setGlobalFilter,
  };
}
