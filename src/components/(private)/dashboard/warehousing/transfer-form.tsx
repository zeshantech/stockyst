import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { IconTrash, IconPlus } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { ITransfer, TransferFormValues } from "@/types/warehouse";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAllWarehouses } from "@/hooks/use-warehousing";

// Zod schema for transfer form validation
const transferFormSchema = z
  .object({
    sourceWarehouseId: z.string().min(1, "Source warehouse is required"),
    destinationWarehouseId: z
      .string()
      .min(1, "Destination warehouse is required"),
    items: z
      .array(
        z.object({
          productId: z.string().min(1, "Product is required"),
          quantity: z
            .string()
            .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
              message: "Quantity must be a positive number",
            }),
          sourceLocationId: z.string().optional(),
          destinationLocationId: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .min(1, "At least one item is required"),
    notes: z.string().optional(),
    trackingNumber: z.string().optional(),
    estimatedArrival: z.date().optional(),
  })
  .refine((data) => data.sourceWarehouseId !== data.destinationWarehouseId, {
    message: "Source and destination warehouses cannot be the same",
    path: ["destinationWarehouseId"],
  });

export function TransferForm({
  initialData,
  onSubmit,
  isSubmitting,
}: {
  initialData?: ITransfer;
  onSubmit: (data: TransferFormValues) => void;
  isSubmitting: boolean;
}) {
  const router = useRouter();
  const isEditMode = !!initialData;
  const { data: warehouses, isLoading: isLoadingWarehouses } =
    useAllWarehouses();
  const [sourceWarehouseId, setSourceWarehouseId] = useState<string>(
    initialData?.sourceWarehouseId || ""
  );
  const [destinationWarehouseId, setDestinationWarehouseId] = useState<string>(
    initialData?.destinationWarehouseId || ""
  );

  // Create form with the schema and initial values
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          items: initialData.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity.toString(),
            sourceLocationId: item.sourceLocationId,
            destinationLocationId: item.destinationLocationId,
            notes: item.notes,
          })),
          estimatedArrival: initialData.estimatedArrival,
        }
      : {
          sourceWarehouseId: "",
          destinationWarehouseId: "",
          items: [
            {
              productId: "",
              quantity: "1",
              sourceLocationId: "",
              destinationLocationId: "",
              notes: "",
            },
          ],
          notes: "",
          trackingNumber: "",
          estimatedArrival: undefined,
        },
  });

  // Create a field array for dynamic items
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Watch for changes in warehouse selections
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "sourceWarehouseId") {
        setSourceWarehouseId(value.sourceWarehouseId as string);
      }
      if (name === "destinationWarehouseId") {
        setDestinationWarehouseId(value.destinationWarehouseId as string);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Handle form submission
  const handleSubmit = form.handleSubmit((data) => {
    onSubmit(data);
  });

  // Mock products data (would be fetched from an API in a real implementation)
  const mockProducts = [
    { id: "1", name: "Laptop Pro X1" },
    { id: "2", name: "Office Chair Ergo" },
    { id: "3", name: "Wireless Mouse" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Edit Transfer" : "Create New Transfer"}
        </CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Warehouse selection */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="sourceWarehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Source Warehouse</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSourceWarehouseId(value);
                      }}
                      defaultValue={field.value}
                      disabled={isLoadingWarehouses || isEditMode}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select source warehouse" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {warehouses?.map((warehouse) => (
                          <SelectItem
                            key={warehouse.id}
                            value={warehouse.id}
                            disabled={
                              warehouse.id === destinationWarehouseId ||
                              warehouse.status !== "active"
                            }
                          >
                            {warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="destinationWarehouseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination Warehouse</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        setDestinationWarehouseId(value);
                      }}
                      defaultValue={field.value}
                      disabled={isLoadingWarehouses || isEditMode}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination warehouse" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {warehouses?.map((warehouse) => (
                          <SelectItem
                            key={warehouse.id}
                            value={warehouse.id}
                            disabled={
                              warehouse.id === sourceWarehouseId ||
                              warehouse.status !== "active"
                            }
                          >
                            {warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Transfer items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>Transfer Items</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    append({
                      productId: "",
                      quantity: "1",
                      sourceLocationId: "",
                      destinationLocationId: "",
                      notes: "",
                    })
                  }
                >
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="rounded-md border p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Item {index + 1}</h4>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fields.length > 1 && remove(index)}
                      disabled={fields.length <= 1}
                    >
                      <IconTrash className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`items.${index}.productId`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a product" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockProducts.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`items.${index}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`items.${index}.notes`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Optional notes about this item"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>

            {/* Additional information */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="trackingNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tracking Number</FormLabel>
                    <FormControl>
                      <Input placeholder="TR-2023-001" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional tracking number for this transfer
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedArrival"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Estimated Arrival</FormLabel>
                    <DatePicker date={field.value} onSelect={field.onChange} />
                    <FormDescription>
                      When the transfer is expected to arrive
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add any additional notes here"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Any additional information about this transfer
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">
                    {isEditMode ? "Updating..." : "Creating..."}
                  </span>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </>
              ) : isEditMode ? (
                "Update Transfer"
              ) : (
                "Create Transfer"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
