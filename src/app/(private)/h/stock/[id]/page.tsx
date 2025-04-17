"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  IconAdjustmentsHorizontal,
  IconArrowLeft,
  IconBarcode,
  IconCalendarEvent,
  IconClipboardList,
  IconEdit,
  IconHistory,
  IconMapPin,
  IconPackage,
  IconPackageExport,
  IconPackageImport,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogComponent,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { IStock } from "@/types/stock";
import { useStock, useStocks } from "@/hooks/use-stock";
import { Separator } from "@/components/ui/separator";
import { Selector } from "@/components/ui/selector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogComponent,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type StockDetailPageProps = {
  params: {
    id: string;
  };
};

const updateQuantitySchema = z.object({
  quantity: z.coerce
    .number()
    .min(0, { message: "Quantity must be 0 or greater" }),
  notes: z.string().optional(),
});

const updateLocationSchema = z.object({
  location: z.string().min(1, { message: "Location is required" }),
  notes: z.string().optional(),
});

type UpdateQuantityFormValues = z.infer<typeof updateQuantitySchema>;
type UpdateLocationFormValues = z.infer<typeof updateLocationSchema>;

export default function StockDetailPage({ params }: StockDetailPageProps) {
  const router = useRouter();

  const [isQuantityDialogOpen, setIsQuantityDialogOpen] = React.useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const { updateStockQuantity, updateStockLocation, deleteStock } = useStocks();
  const { data: stock, isLoading, error } = useStock(params.id);

  const quantityForm = useForm<UpdateQuantityFormValues>({
    resolver: zodResolver(updateQuantitySchema),
    defaultValues: {
      quantity: stock?.quantity || 0,
      notes: "",
    },
  });

  const locationForm = useForm<UpdateLocationFormValues>({
    resolver: zodResolver(updateLocationSchema),
    defaultValues: {
      location: stock?.location || "",
      notes: "",
    },
  });

  // Update form values when stock data loads
  React.useEffect(() => {
    if (stock) {
      quantityForm.setValue("quantity", stock.quantity);
      locationForm.setValue("location", stock.location);
    }
  }, [stock, quantityForm, locationForm]);

  const onUpdateQuantity = (data: UpdateQuantityFormValues) => {
    if (!stock) return;

    updateStockQuantity({
      id: stock.id,
      quantity: data.quantity,
      notes: data.notes,
    });

    setIsQuantityDialogOpen(false);
  };

  const onUpdateLocation = (data: UpdateLocationFormValues) => {
    if (!stock) return;

    updateStockLocation({
      id: stock.id,
      location: data.location,
      notes: data.notes,
    });

    setIsLocationDialogOpen(false);
  };

  const handleDeleteStock = () => {
    if (!stock) return;

    deleteStock({ id: stock.id });
    setIsDeleteDialogOpen(false);
    router.push("/h/stock");
  };

  // Mock transaction history data
  const transactionHistory = [
    {
      id: "1",
      date: new Date("2024-03-20"),
      type: "addition",
      quantity: 5,
      user: "John Doe",
      notes: "Received from supplier",
    },
    {
      id: "2",
      date: new Date("2024-03-15"),
      type: "transfer-in",
      quantity: 10,
      user: "Jane Smith",
      notes: "Transferred from Warehouse B",
    },
    {
      id: "3",
      date: new Date("2024-03-10"),
      type: "subtraction",
      quantity: -2,
      user: "Alex Johnson",
      notes: "Damaged goods",
    },
    {
      id: "4",
      date: new Date("2024-03-05"),
      type: "adjustment",
      quantity: 3,
      user: "Sarah Williams",
      notes: "Stock count adjustment",
    },
    {
      id: "5",
      date: new Date("2024-03-01"),
      type: "transfer-out",
      quantity: -5,
      user: "Mike Brown",
      notes: "Transferred to Store Front",
    },
  ];

  // Sample locations
  const sampleLocations = [
    "Warehouse A",
    "Warehouse B",
    "Store Front",
    "Distribution Center",
  ];

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p>Loading stock details...</p>
        </div>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <IconPackage className="h-10 w-10 text-destructive" />
          <p className="text-xl font-semibold">Stock item not found</p>
          <p className="text-muted-foreground">
            The stock item you are looking for does not exist.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push("/h/stock")}
            className="mt-4"
          >
            <IconArrowLeft className="mr-2 h-4 w-4" />
            Back to Stock
          </Button>
        </div>
      </div>
    );
  }

  const renderStatusBadge = (status: IStock["status"]) => {
    switch (status) {
      case "in-stock":
        return <Badge variant="success">In Stock</Badge>;
      case "low-stock":
        return <Badge variant="warning">Low Stock</Badge>;
      case "out-of-stock":
        return <Badge variant="error">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/h/stock")}
          >
            <IconArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {stock.productName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-muted-foreground">SKU: {stock.sku}</p>
              {renderStatusBadge(stock.status)}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsQuantityDialogOpen(true)}
          >
            <IconAdjustmentsHorizontal />
            Adjust Quantity
          </Button>
          <Button color="error" onClick={() => setIsDeleteDialogOpen(true)}>
            <IconTrash />
            Delete
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Stock Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Stock Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Current Quantity
                </div>
                <div className="font-medium">
                  {stock.quantity}{" "}
                  {stock.quantity <= stock.reorderPoint && (
                    <Badge
                      variant={stock.quantity === 0 ? "error" : "warning"}
                      className="ml-2"
                    >
                      {stock.quantity === 0 ? "Out of Stock" : "Low Stock"}
                    </Badge>
                  )}
                </div>
              </div>
              <Separator />

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Reorder Point
                </div>
                <div className="font-medium">{stock.reorderPoint}</div>
              </div>
              <Separator />

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Unit Cost</div>
                <div className="font-medium">${stock.unitCost.toFixed(2)}</div>
              </div>
              <Separator />

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">Total Value</div>
                <div className="font-medium">
                  ${stock.totalValue.toFixed(2)}
                </div>
              </div>
              <Separator />

              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Last Restocked
                </div>
                <div className="font-medium">
                  {format(new Date(stock.lastRestocked), "MMM d, yyyy")}
                </div>
              </div>

              {stock.expiryDate && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Expiry Date
                    </div>
                    <div className="font-medium">
                      {format(new Date(stock.expiryDate), "MMM d, yyyy")}
                    </div>
                  </div>
                </>
              )}

              {stock.batchNumber && (
                <>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Batch Number
                    </div>
                    <div className="font-medium">{stock.batchNumber}</div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>Location</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsLocationDialogOpen(true)}
                >
                  <IconEdit />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <IconMapPin className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{stock.location}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              {stock.notes ? (
                <p>{stock.notes}</p>
              ) : (
                <p className="text-muted-foreground italic">No notes added</p>
              )}
            </CardContent>
            <CardFooter className="pt-0">
              <Button variant="outline" size="sm" className="w-full">
                <IconPencil />
                Edit Notes
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Column - Tabs */}
        <div className="md:col-span-2">
          <Tabs defaultValue="transactions">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="transactions">
                <IconHistory />
                Transactions
              </TabsTrigger>
              <TabsTrigger value="movements">
                <IconPackageExport />
                Movements
              </TabsTrigger>
              <TabsTrigger value="details">
                <IconClipboardList />
                Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle>Transaction History</CardTitle>
                    <Button variant="outline" size="icon">
                      <IconPackageImport />
                      Export
                    </Button>
                  </div>
                  <CardDescription>
                    Recent stock quantity changes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactionHistory.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-start p-3 border rounded-md"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                transaction.quantity > 0 ? "success" : "error"
                              }
                            >
                              {transaction.type === "addition"
                                ? "Addition"
                                : transaction.type === "subtraction"
                                ? "Subtraction"
                                : transaction.type === "adjustment"
                                ? "Adjustment"
                                : transaction.type === "transfer-in"
                                ? "Transfer In"
                                : "Transfer Out"}
                            </Badge>
                            <span className="text-sm font-medium">
                              {transaction.quantity > 0 ? "+" : ""}
                              {transaction.quantity} units
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {transaction.notes}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {format(transaction.date, "MMM d, yyyy")}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {transaction.user}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button variant="outline" size="sm">
                    Load More
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="movements" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Stock Movements</CardTitle>
                  <CardDescription>
                    Transfers and movement between locations
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center p-6">
                  <div className="text-center">
                    <IconPackageExport className="h-12 w-12 text-muted-foreground/40 mx-auto" />
                    <p className="mt-2 text-muted-foreground">
                      No movement records found for this stock item
                    </p>
                    <Button variant="outline" className="mt-4">
                      <IconPlus />
                      Transfer Stock
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                  <CardDescription>
                    Product information and specifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium">Product ID</h3>
                      <p className="text-sm text-muted-foreground">
                        {stock.productId}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">SKU</h3>
                      <p className="text-sm text-muted-foreground">
                        {stock.sku}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">Created At</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(stock.createdAt), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      High-performance laptop for professionals with Intel i7
                      processor, 16GB RAM, and 512GB SSD storage. Features a
                      15.6" display and comes with a 1-year warranty.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-sm font-medium mb-2">Specifications</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          Processor:
                        </span>{" "}
                        Intel i7
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">RAM:</span> 16GB
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Storage:</span>{" "}
                        512GB SSD
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Display:</span>{" "}
                        15.6"
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      router.push(`/h/products/${stock.productId}`)
                    }
                  >
                    <IconPackage />
                    View Product Details
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Update Quantity Dialog */}
      <DialogComponent
        open={isQuantityDialogOpen}
        onOpenChange={setIsQuantityDialogOpen}
        title="Update Stock Quantity"
        description={`Adjust the quantity of ${stock.productName}`}
        footer={
          <Button type="submit" form="quantity-form">
            Update Quantity
          </Button>
        }
      >
        <form
          id="quantity-form"
          onSubmit={quantityForm.handleSubmit(onUpdateQuantity)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="quantity" className="text-sm font-medium">
              Quantity
            </label>
            <Input
              id="quantity"
              type="number"
              {...quantityForm.register("quantity")}
            />
            <p className="text-sm text-muted-foreground">
              Current quantity: {stock.quantity}
            </p>
            {quantityForm.formState.errors.quantity && (
              <p className="text-sm text-destructive">
                {quantityForm.formState.errors.quantity.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              placeholder="Reason for quantity adjustment"
              {...quantityForm.register("notes")}
            />
            <p className="text-sm text-muted-foreground">
              Add notes explaining the reason for this adjustment
            </p>
            {quantityForm.formState.errors.notes && (
              <p className="text-sm text-destructive">
                {quantityForm.formState.errors.notes.message}
              </p>
            )}
          </div>
        </form>
      </DialogComponent>

      {/* Update Location Dialog */}
      <DialogComponent
        open={isLocationDialogOpen}
        onOpenChange={setIsLocationDialogOpen}
        title="Update Stock Location"
        description={`Change the storage location of ${stock.productName}`}
        footer={
          <Button type="submit" form="location-form">
            Update Location
          </Button>
        }
      >
        <form
          id="location-form"
          onSubmit={locationForm.handleSubmit(onUpdateLocation)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Selector
              onChange={(value) => locationForm.setValue("location", value)}
              defaultValue={locationForm.getValues("location")}
              placeholder="Select a location"
              options={sampleLocations.map((location) => ({
                label: location,
                value: location,
              }))}
            />
            <p className="text-sm text-muted-foreground">
              Current location: {stock.location}
            </p>
            {locationForm.formState.errors.location && (
              <p className="text-sm text-destructive">
                {locationForm.formState.errors.location.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <Textarea
              id="notes"
              placeholder="Reason for location change"
              {...locationForm.register("notes")}
            />
            <p className="text-sm text-muted-foreground">
              Add notes explaining the reason for this change
            </p>
            {locationForm.formState.errors.notes && (
              <p className="text-sm text-destructive">
                {locationForm.formState.errors.notes.message}
              </p>
            )}
          </div>
        </form>
      </DialogComponent>

      {/* Delete Confirmation Dialog */}
      <AlertDialogComponent
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Delete Stock Item"
        description="Are you sure you want to delete this stock item? This action cannot be undone."
        cancelButton="Cancel"
        confirmButton="Delete"
        onConfirm={handleDeleteStock}
        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
      />
    </div>
  );
}
