"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { cn, formatCurrency } from "@/lib/utils";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export function PaymentForm({ clientSecret, onPaymentSuccess, className, amount }: { clientSecret: string; onPaymentSuccess: (paymentIntentId: string) => void; className?: string; amount?: number }) {
  if (!clientSecret) {
    return null;
  }

  const options = {
    clientSecret,
  };

  return (
    <div className={cn("w-full", className)}>
      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm onPaymentSuccess={onPaymentSuccess} amount={amount} />
      </Elements>
    </div>
  );
}

function CheckoutForm({ onPaymentSuccess, amount }: { onPaymentSuccess: (paymentIntentId: string) => void; amount?: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent?.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          if (paymentIntent.id) {
            onPaymentSuccess(paymentIntent.id);
          }
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, onPaymentSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message ?? "An unexpected error occurred.");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setMessage("Payment succeeded!");
      onPaymentSuccess(paymentIntent.id);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PaymentElement id="payment-element" />
      </div>
      <Button loading={isLoading} disabled={!stripe || !elements} className="w-full" type="submit">
        {amount ? `Pay ${formatCurrency(amount)}` : "Pay"}
      </Button>
      {message && <div className="text-sm text-error mt-2">{message}</div>}
    </form>
  );
}
