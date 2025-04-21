"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/selector";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required"),
  customer: z.string().min(1, "Customer name is required"),
  total: z.string().min(1, "Total amount is required"),
  status: z.enum([
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
  items: z.string().min(1, "Number of items is required"),
  date: z.string().min(1, "Order date is required"),
  paymentStatus: z.enum(["pending", "paid", "failed"]),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddOrderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderNumber: "",
      customer: "",
      total: "",
      status: "pending",
      items: "",
      date: new Date().toISOString().split("T")[0],
      paymentStatus: "pending",
      notes: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      console.log("Form submitted:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Order created successfully");
      router.push("/h/orders");
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order");
    } finally {
      setIsSubmitting(false);
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
          <h1 className="text-3xl font-bold">Add New Order</h1>
          <p className="text-muted-foreground">
            Create a new order in the system
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Order Number"
              placeholder="ORD-001"
              error={form.formState.errors.orderNumber?.message}
              {...form.register("orderNumber")}
              required
            />

            <Input
              label="Customer Name"
              placeholder="John Doe"
              error={form.formState.errors.customer?.message}
              {...form.register("customer")}
              required
            />

            <Input
              label="Total Amount"
              type="number"
              step="0.01"
              placeholder="1250.00"
              error={form.formState.errors.total?.message}
              {...form.register("total")}
              required
            />

            <Input
              label="Number of Items"
              type="number"
              placeholder="5"
              error={form.formState.errors.items?.message}
              {...form.register("items")}
              required
            />

            <Selector
              label="Order Status"
              options={[
                { value: "pending", label: "Pending" },
                { value: "processing", label: "Processing" },
                { value: "shipped", label: "Shipped" },
                { value: "delivered", label: "Delivered" },
                { value: "cancelled", label: "Cancelled" },
              ]}
              value={form.watch("status")}
              onChange={(value) => form.setValue("status", value as any)}
              error={form.formState.errors.status?.message}
              required
            />

            <Selector
              label="Payment Status"
              options={[
                { value: "pending", label: "Pending" },
                { value: "paid", label: "Paid" },
                { value: "failed", label: "Failed" },
              ]}
              value={form.watch("paymentStatus")}
              onChange={(value) => form.setValue("paymentStatus", value as any)}
              error={form.formState.errors.paymentStatus?.message}
              required
            />

            <Input
              label="Order Date"
              type="date"
              error={form.formState.errors.date?.message}
              {...form.register("date")}
              required
            />
          </div>

          <div className="space-y-2">
            <Textarea
              label="Notes"
              placeholder="Add any additional notes about this order"
              className="min-h-[100px]"
              info="Optional notes about the order"
              error={form.formState.errors.notes?.message}
              {...form.register("notes")}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" loading={isSubmitting}>
              <IconCheck />
              Create Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
