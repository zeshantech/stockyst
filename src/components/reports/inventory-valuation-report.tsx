"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { IconPrinter, IconFileExport } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils"; // Assuming a currency formatter exists
import {
  InventoryValuationItem,
  InventoryValuationResult,
} from "@/hooks/use-inventory-valuation";

const columns: ColumnDef<InventoryValuationItem>[] = [
  { accessorKey: "productName", header: "Product" },
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "locationName", header: "Location" },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <div className="text-right">{row.original.quantity}</div>
    ),
  },
  {
    accessorKey: "unitCost",
    header: "Unit Cost",
    cell: ({ row }) => (
      <div className="text-right">{formatCurrency(row.original.unitCost)}</div>
    ),
  },
  {
    accessorKey: "totalValue",
    header: "Total Value",
    cell: ({ row }) => (
      <div className="text-right font-medium">
        {formatCurrency(row.original.totalValue)}
      </div>
    ),
  },
];

interface InventoryValuationReportProps {
  data: InventoryValuationResult;
}

export function InventoryValuationReport({
  data,
}: InventoryValuationReportProps) {
  const table = useReactTable({
    data: data.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedLocation = data.filters.locationId
    ? data.items.find((i) => i.locationId === data.filters.locationId)
        ?.locationName || data.filters.locationId
    : "All Locations";

  const handlePrint = () => {
    window.print(); // Basic browser print
  };

  const handleExport = () => {
    // Basic CSV export simulation (replace with actual library later)
    console.log("Exporting data:", data.items);
    const csvHeader = columns.map((col: any) => col.header).join(","); // Simple header mapping
    const csvBody = data.items
      .map((item) =>
        columns
          .map((col: any) => {
            // Check if accessorKey exists before trying to access it
            if (col.accessorKey) {
              return JSON.stringify(
                item[col.accessorKey as keyof InventoryValuationItem]
              );
            } // Handle columns without accessorKey (e.g., display columns) if needed
            return ""; // Return empty string for columns without accessorKey
          })
          .join(",")
      )
      .join("\n");
    console.log("CSV Data:\n", csvHeader + "\n" + csvBody);
    toast.info(
      "Export to CSV functionality coming soon. Data logged to console."
    );
  };

  return (
    <Card className="col-span-full print-container">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle>Inventory Valuation Report</CardTitle>
          <CardDescription>
            Total value of inventory as of{" "}
            {format(new Date(data.generatedAt), "PPP p")}. Filtered by: Location
            (<Badge variant="secondary">{selectedLocation}</Badge>)
          </CardDescription>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <IconFileExport className="mr-2 size-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <IconPrinter className="mr-2 size-4" />
            Print
          </Button>
        </div>
      </CardHeader>
      <CardContent>
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
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="justify-end font-bold">
        Total Inventory Value: {formatCurrency(data.totalValue)}
      </CardFooter>
    </Card>
  );
}

// Basic print styles (could be moved to a global CSS file)
const printStyles = `
@media print {
  body * {
    visibility: hidden;
  }
  .print-container,
  .print-container * {
    visibility: visible;
  }
  .print-container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  /* Add any other print-specific styles here */
}
`;

if (typeof window !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = printStyles;
  document.head.appendChild(styleSheet);
}
