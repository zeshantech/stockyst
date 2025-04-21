"use client";

import * as React from "react";
import { DateRange } from "react-day-picker";
import { IconChartBar, IconFileReport, IconLoader } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useLocations } from "@/hooks/use-locations";
import { useProducts } from "@/hooks/use-products";
import {
  useInventoryValuation,
  InventoryValuationResult,
} from "@/hooks/use-inventory-valuation";
import { InventoryValuationReport } from "@/components/(private)/dashboard/reports/inventory-valuation-report";

export default function ReportsPage() {
  const { locations } = useLocations();
  const { products } = useProducts();

  // State for filters
  const [valuationLocation, setValuationLocation] =
    React.useState<string>("all");
  const [movementLocation, setMovementLocation] = React.useState<string>("all");
  const [movementProduct, setMovementProduct] = React.useState<string>("all");
  const [movementDateRange, setMovementDateRange] = React.useState<
    DateRange | undefined
  >(undefined);

  // State for report results
  const [valuationResult, setValuationResult] =
    React.useState<InventoryValuationResult | null>(null);

  // Inventory Valuation Query
  const {
    refetch: fetchValuationReport,
    isLoading: isValuationLoading,
    isFetching: isValuationFetching,
  } = useInventoryValuation({ locationId: valuationLocation });

  // Handle generating valuation report
  const handleGenerateValuation = async () => {
    const { data } = await fetchValuationReport();
    setValuationResult(data || null);
  };

  const isLoading = isValuationLoading || isValuationFetching;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <IconChartBar className="size-8 text-info" />
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">
            Generate and view various reports for your inventory
          </p>
        </div>
      </div>

      {/* Report Configuration Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Inventory Valuation Report Card */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Valuation</CardTitle>
            <CardDescription>
              Calculate the total value of your current inventory.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* <div>
              <Label htmlFor="valuation-date">As of Date</Label>
              <p className="text-sm text-muted-foreground">
                Select date (optional, feature coming soon)
              </p>
            </div> */}
            <div>
              <Label htmlFor="valuation-location">Location</Label>
              <Select
                value={valuationLocation}
                onValueChange={setValuationLocation}
              >
                <SelectTrigger id="valuation-location">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              className="w-full"
              onClick={handleGenerateValuation}
              loading={isLoading}
            >
              <IconFileReport />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        {/* Stock Movement Report Card */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Movement</CardTitle>
            <CardDescription>
              Track the movement of stock items over a period.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Date Range</Label>
              <DatePickerWithRange
                date={movementDateRange}
                setDate={setMovementDateRange}
              />
            </div>
            <div>
              <Label htmlFor="movement-location">Location</Label>
              <Select
                value={movementLocation}
                onValueChange={setMovementLocation}
              >
                <SelectTrigger id="movement-location">
                  <SelectValue placeholder="Select Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="movement-product">Product</Label>
              <Select
                value={movementProduct}
                onValueChange={setMovementProduct}
              >
                <SelectTrigger id="movement-product">
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((prod) => (
                    <SelectItem key={prod.id} value={prod.id}>
                      {prod.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" disabled>
              {/* TODO: Implement */}
              <IconFileReport />
              Generate Report (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        {/* Placeholder for more reports */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>More Reports</CardTitle>
            <CardDescription>
              More report types will be added here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground">
              e.g., Low Stock, Sales Analysis, Aging Inventory...
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Report Display Area */}
      <div className="mt-6">
        {isValuationLoading && (
          <div className="flex justify-center items-center p-10">
            <IconLoader className="size-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {valuationResult && !isValuationFetching && (
          <InventoryValuationReport data={valuationResult} />
        )}
        {/* Add display areas for other reports here */}
      </div>
    </div>
  );
}
