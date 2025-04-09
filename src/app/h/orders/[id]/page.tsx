"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  IconArrowLeft,
  IconCheck,
  IconEdit,
  IconTrash,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/selector";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { IOrder } from "@/types/order";
import { useOrderActions } from "@/hooks/use-order-actions";

const sampleOrder: IOrder = {
  id: "1",
  orderNumber: "ORD-001",
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: "+1 234 567 8900",
  items: [
    {
      id: "1",
      productId: "1",
      productName: "Product 1",
      quantity: 2,
      price: 29.99,
      total: 59.98,
    },
    {
      id: "2",
      productId: "2",
      productName: "Product 2",
      quantity: 1,
      price: 49.99,
      total: 49.99,
    },
  ],
  subtotal: 109.97,
  tax: 8.8,
  shipping: 10.0,
  total: 128.77,
  status: "pending",
  paymentStatus: "pending",
  shippingAddress: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
  },
  billingAddress: {
    street: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "USA",
  },
  notes: "Please deliver during business hours",
  createdAt: "2024-03-15T10:00:00Z",
  updatedAt: "2024-03-15T10:00:00Z",
};

const formSchema = z.object({
  customerName: z.string().min(2, {
    message: "Customer name must be at least 2 characters.",
  }),
  customerEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  customerPhone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  status: z.enum(
    ["pending", "processing", "shipped", "delivered", "cancelled"],
    {
      required_error: "Please select a status.",
    }
  ),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"], {
    required_error: "Please select a payment status.",
  }),
  notes: z.string().optional(),
});

export default function OrderDetailsPage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [order, setOrder] = React.useState<IOrder>(sampleOrder);
  const { deleteOrder } = useOrderActions();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      status: order.status,
      paymentStatus: order.paymentStatus,
      notes: order.notes,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOrder({
        ...order,
        ...values,
        updatedAt: new Date().toISOString(),
      });
      setIsEditing(false);
      toast.success("Order updated successfully");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteOrder.mutateAsync({ id: order.id });
      toast.success("Order deleted successfully");
      router.push("/h/orders");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/h/orders")}
        >
          <IconArrowLeft />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">
            View and manage order information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          {isEditing ? (
            <div className="rounded-lg border p-6">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Input
                      {...form.register("customerName")}
                      label="Customer Name"
                      error={form.formState.errors.customerName?.message}
                      info="Enter the customer's full name"
                    />
                  </div>
                  <div>
                    <Input
                      {...form.register("customerEmail")}
                      label="Email"
                      error={form.formState.errors.customerEmail?.message}
                      info="Enter customer's contact email"
                    />
                  </div>
                </div>
                <div>
                  <Input
                    {...form.register("customerPhone")}
                    label="Phone"
                    error={form.formState.errors.customerPhone?.message}
                    info="Enter customer's contact phone number"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Selector
                      options={[
                        { value: "pending", label: "Pending" },
                        { value: "processing", label: "Processing" },
                        { value: "shipped", label: "Shipped" },
                        { value: "delivered", label: "Delivered" },
                        { value: "cancelled", label: "Cancelled" },
                      ]}
                      value={form.getValues("status")}
                      onChange={(value) =>
                        form.setValue("status", value as any)
                      }
                      label="Order Status"
                      error={form.formState.errors.status?.message}
                      info="Current status of the order"
                    />
                  </div>
                  <div>
                    <Selector
                      options={[
                        { value: "pending", label: "Pending" },
                        { value: "paid", label: "Paid" },
                        { value: "failed", label: "Failed" },
                        { value: "refunded", label: "Refunded" },
                      ]}
                      value={form.getValues("paymentStatus")}
                      onChange={(value) =>
                        form.setValue("paymentStatus", value as any)
                      }
                      label="Payment Status"
                      error={form.formState.errors.paymentStatus?.message}
                      info="Current payment status"
                    />
                  </div>
                </div>
                <div>
                  <Textarea
                    {...form.register("notes")}
                    className="min-h-[100px]"
                    label="Notes"
                    error={form.formState.errors.notes?.message}
                    info="Additional notes about the order"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Saving..."
                    ) : (
                      <>
                        <IconCheck className="mr-2 size-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Order Information</h2>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <IconEdit className="mr-2 size-4" />
                  Edit Order
                </Button>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium">{order.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{order.customerPhone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Status</p>
                  <Badge
                    variant="outline"
                    className={
                      order.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.status === "processing"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "shipped"
                        ? "bg-purple-100 text-purple-800"
                        : order.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Payment Status
                  </p>
                  <Badge
                    variant="outline"
                    className={
                      order.paymentStatus === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : order.paymentStatus === "paid"
                        ? "bg-green-100 text-green-800"
                        : order.paymentStatus === "failed"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {order.paymentStatus.charAt(0).toUpperCase() +
                      order.paymentStatus.slice(1)}
                  </Badge>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="font-medium">{order.notes}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-lg border p-6">
            <h2 className="text-xl font-semibold">Order Items</h2>
            <div className="mt-4 space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${item.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-medium">
                  <span>Total</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
              <CardDescription>Current status of the order</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge
                variant="outline"
                className={
                  order.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.status === "processing"
                    ? "bg-blue-100 text-blue-800"
                    : order.status === "shipped"
                    ? "bg-purple-100 text-purple-800"
                    : order.status === "delivered"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }
              >
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                {order.status === "pending"
                  ? "Order is pending and waiting to be processed"
                  : order.status === "processing"
                  ? "Order is being processed"
                  : order.status === "shipped"
                  ? "Order has been shipped"
                  : order.status === "delivered"
                  ? "Order has been delivered"
                  : "Order has been cancelled"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>Current payment status</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge
                variant="outline"
                className={
                  order.paymentStatus === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-800"
                    : order.paymentStatus === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {order.paymentStatus.charAt(0).toUpperCase() +
                  order.paymentStatus.slice(1)}
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                {order.paymentStatus === "pending"
                  ? "Payment is pending"
                  : order.paymentStatus === "paid"
                  ? "Payment has been received"
                  : order.paymentStatus === "failed"
                  ? "Payment has failed"
                  : "Payment has been refunded"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
              <CardDescription>Delivery address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing Address</CardTitle>
              <CardDescription>Billing address</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p>{order.billingAddress.street}</p>
                <p>
                  {order.billingAddress.city}, {order.billingAddress.state}{" "}
                  {order.billingAddress.zipCode}
                </p>
                <p>{order.billingAddress.country}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Once you delete an order, there is no going back. Please be
                certain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleDelete}
              >
                <IconTrash className="mr-2 size-4" />
                Delete Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
