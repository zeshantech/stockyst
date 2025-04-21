"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  IconCreditCard,
  IconEdit,
  IconTrash,
  IconPlus,
} from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/selector";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscription } from "@/hooks/use-subscription";

// Define the payment method interface
interface PaymentMethod {
  id: string;
  type: string;
  last4: string;
  expiryDate: string;
  isDefault: boolean;
  cardType: string;
}

interface CardDetails {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
}

const months = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
];
const years = Array.from({ length: 10 }, (_, i) =>
  (new Date().getFullYear() + i).toString()
);

const monthOptions = months.map((month) => ({ label: month, value: month }));
const yearOptions = years.map((year) => ({ label: year, value: year }));

const addPaymentMethodSchema = z.object({
  cardNumber: z
    .string()
    .min(15)
    .max(19)
    .regex(/^\d+$/, "Card number must only contain digits"),
  cardholderName: z.string().min(2, "Name is required"),
  expiryMonth: z.string().min(1, "Month is required"),
  expiryYear: z.string().min(4, "Year is required"),
  cvc: z.string().min(3).max(4).regex(/^\d+$/, "CVC must only contain digits"),
});

export function PaymentMethods() {
  const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false);
  const { paymentMethods, isLoadingPaymentMethods, addPaymentMethod } =
    useSubscription();

  const form = useForm<z.infer<typeof addPaymentMethodSchema>>({
    resolver: zodResolver(addPaymentMethodSchema),
    defaultValues: {
      cardNumber: "",
      cardholderName: "",
      expiryMonth: "",
      expiryYear: "",
      cvc: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof addPaymentMethodSchema>) => {
    try {
      await addPaymentMethod({
        cardNumber: data.cardNumber,
        cardholderName: data.cardholderName,
        expiryDate: `${data.expiryMonth}/${data.expiryYear}`,
        cvc: data.cvc,
      });
      setIsAddingPaymentMethod(false);
      form.reset();
    } catch (error) {
      console.error("Failed to add payment method:", error);
    }
  };

  if (isLoadingPaymentMethods) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your payment methods for billing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>
            Manage your payment methods for billing.
          </CardDescription>
        </div>
        <Dialog
          open={isAddingPaymentMethod}
          onOpenChange={setIsAddingPaymentMethod}
        >
          <DialogTrigger asChild>
            <Button size="sm">
              <IconPlus className="h-4 w-4 mr-2" />
              Add Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Add a new payment method to your account.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                {...form.register("cardNumber")}
                error={form.formState.errors.cardNumber?.message}
              />
              <Input
                label="Name on Card"
                placeholder="John Doe"
                {...form.register("cardholderName")}
                error={form.formState.errors.cardholderName?.message}
              />
              <div className="grid grid-cols-3 gap-4">
                <Selector
                  label="Month"
                  options={monthOptions}
                  placeholder="MM"
                  value={form.watch("expiryMonth")}
                  onChange={(value) => form.setValue("expiryMonth", value)}
                  error={form.formState.errors.expiryMonth?.message}
                />
                <Selector
                  label="Year"
                  options={yearOptions}
                  placeholder="YYYY"
                  value={form.watch("expiryYear")}
                  onChange={(value) => form.setValue("expiryYear", value)}
                  error={form.formState.errors.expiryYear?.message}
                />
                <Input
                  label="CVC"
                  placeholder="123"
                  {...form.register("cvc")}
                  error={form.formState.errors.cvc?.message}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddingPaymentMethod(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Save
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods && paymentMethods.length > 0 ? (
          paymentMethods.map((method: PaymentMethod, index: number) => {
            // Extract month and year from expiryDate if needed
            const expiryParts = method.expiryDate.split("/");
            const expiryMonth = expiryParts[0] || "";
            const expiryYear = expiryParts[1] || "";

            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-md"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-14 bg-primary/10 rounded-md flex items-center justify-center">
                    <IconCreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {method.type} •••• {method.last4}
                      {method.isDefault && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {expiryMonth}/{expiryYear}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost">
                    <IconEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-6 border border-dashed rounded-lg">
            <IconCreditCard className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <h3 className="text-sm font-medium mb-1">No payment methods</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You haven't added any payment methods yet.
            </p>
            <Button size="sm" onClick={() => setIsAddingPaymentMethod(true)}>
              Add payment method
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
