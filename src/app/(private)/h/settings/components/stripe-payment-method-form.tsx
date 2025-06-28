import React, { useState } from "react";
import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useBillingStore } from "@/store/useBillingStore";
import { Button } from "@/components/ui/button";
import { SpinnerBackdrop } from "@/components/ui/spinner";
import { useStripePaymentMethod } from "@/hooks/use-billing";

interface StripePaymentMethodFormProps {
  onClose: () => void;
}

export function StripePaymentMethodForm({ onClose }: StripePaymentMethodFormProps) {
  const refetchPaymentMethods = useBillingStore((state) => state.refetchPaymentMethods);
  const clearPaymentMethodSetupIntentResult = useBillingStore((state) => state.clearPaymentMethodSetupIntentResult);

  const [isElementsLoading, setIsElementsLoading] = useState(true);

  const stripe = useStripe();
  const elements = useElements();
  const { mutate: confirmSetup, isPending } = useStripePaymentMethod();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    confirmSetup(
      { stripe, elements },
      {
        onSettled: () => {
          refetchPaymentMethods();
          onClose();
          clearPaymentMethodSetupIntentResult();
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 relative">
      {isElementsLoading && <SpinnerBackdrop>Loading payment form...</SpinnerBackdrop>}

      <PaymentElement
        options={{
          layout: {
            type: "accordion",
          },
        }}
        onReady={() => setIsElementsLoading(false)}
      />

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" className="flex-1" loading={isPending} disabled={!stripe || !elements || isElementsLoading}>
          Add Payment Method
        </Button>
      </div>
    </form>
  );
}
