"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconCreditCard, IconLoader2 } from "@tabler/icons-react";

// Define the form schema
const paymentFormSchema = z.object({
  cardholderName: z.string().min(1, "Cardholder name is required"),
  cardNumber: z.string().min(16, "Card number must be 16 digits").max(16),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid expiry date (MM/YY)"),
  cvc: z
    .string()
    .min(3, "CVC must be 3 digits")
    .max(4, "CVC must be 3 or 4 digits"),
});

type PaymentFormValues = z.infer<typeof paymentFormSchema>;

interface StripePaymentFormProps {
  onSubmit: (data: PaymentFormValues) => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  submitButtonText?: string;
}

export function StripePaymentForm({
  onSubmit,
  isLoading = false,
  title = "Add Payment Method",
  description = "Enter your card details to add a new payment method.",
  submitButtonText = "Add Card",
}: StripePaymentFormProps) {
  const [cardType, setCardType] = useState<string>("");

  // Initialize the form
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvc: "",
    },
  });

  // Handle form submission
  const handleSubmit = (data: PaymentFormValues) => {
    onSubmit(data);
  };

  // Detect card type based on card number
  const detectCardType = (number: string) => {
    if (number.startsWith("4")) {
      return "Visa";
    } else if (number.startsWith("5")) {
      return "Mastercard";
    } else if (number.startsWith("3")) {
      return "American Express";
    } else if (number.startsWith("6")) {
      return "Discover";
    }
    return "";
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <Input
            label="Cardholder Name"
            placeholder="John Doe"
            {...form.register("cardholderName")}
            error={form.formState.errors.cardholderName?.message}
          />

          <div className="relative">
            <Input
              label="Card Number"
              placeholder="4242 4242 4242 4242"
              {...form.register("cardNumber", {
                onChange: (e) => {
                  const formatted = formatCardNumber(e.target.value);
                  e.target.value = formatted;
                  setCardType(detectCardType(formatted.replace(/\s/g, "")));
                },
              })}
              error={form.formState.errors.cardNumber?.message}
              maxLength={19}
            />
            {cardType && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium">
                {cardType}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Expiry Date"
              placeholder="MM/YY"
              {...form.register("expiryDate", {
                onChange: (e) => {
                  const formatted = formatExpiryDate(e.target.value);
                  e.target.value = formatted;
                },
              })}
              error={form.formState.errors.expiryDate?.message}
              maxLength={5}
            />

            <Input
              label="CVC"
              placeholder="123"
              {...form.register("cvc", {
                onChange: (e) => {
                  const v = e.target.value
                    .replace(/\s+/g, "")
                    .replace(/[^0-9]/gi, "");
                  e.target.value = v;
                },
              })}
              error={form.formState.errors.cvc?.message}
              maxLength={4}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconCreditCard className="h-4 w-4" />
            <span>Your card information is encrypted and secure</span>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          onClick={form.handleSubmit(handleSubmit)}
          loading={isLoading}
        >
          submitButtonText
        </Button>
      </CardFooter>
    </Card>
  );
}
