"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconCreditCard, IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBillingStore } from "@/store/useBillingStore";
import { IPaymentMethod } from "@/types/plan";
import { useState } from "react";
import { StripePaymentMethodForm } from "./stripe-payment-method-form";
import { getStripe, noop } from "@/lib/utils";
import { Elements } from "@stripe/react-stripe-js";

export function PaymentMethods() {
  const paymentMethods = useBillingStore((state) => state.paymentMethods);
  const isLoadingPaymentMethods = useBillingStore((state) => state.isPaymentMethodsLoading);
  const paymentMethodSetupIntent = useBillingStore((state) => state.paymentMethodSetupIntent);
  const isPaymentMethodSetupIntentPending = useBillingStore((state) => state.isPaymentMethodSetupIntentPending);
  const paymentMethodSetupIntentResult = useBillingStore((state) => state.paymentMethodSetupIntentResult);

  const [isAddingPaymentMethod, setIsAddingPaymentMethod] = useState(false);

  const handleAddPaymentMethod = async () => {
    await paymentMethodSetupIntent();
    setIsAddingPaymentMethod(true);
  };

  if (isLoadingPaymentMethods) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Manage your payment methods for billing.</CardDescription>
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
          <CardDescription>Manage your payment methods for billing.</CardDescription>
        </div>
        <Button size="sm" href="/h/settings?tab=billing" onClick={handleAddPaymentMethod} loading={isPaymentMethodSetupIntentPending}>
          <IconPlus />
          Add Method
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAddingPaymentMethod && paymentMethodSetupIntentResult?.clientSecret ? (
          <Elements
            stripe={getStripe()}
            options={{
              clientSecret: paymentMethodSetupIntentResult.clientSecret,
            }}
          >
            <StripePaymentMethodForm onClose={() => setIsAddingPaymentMethod(false)} />
          </Elements>
        ) : paymentMethods?.length ? (
          paymentMethods.map((method: IPaymentMethod, index: number) => {
            return (
              <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-14 bg-primary/10 rounded-md flex items-center justify-center">
                    <IconCreditCard />
                  </div>
                  <div>
                    <p className="font-medium">
                      {method.brand} •••• {method.last4}
                      {method.isDefault && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Default</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {method.expMonth}/{method.expYear}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button color="error" variant="ghost" onClick={noop}>
                    <IconTrash />
                    Remove
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-6 border border-dashed rounded-lg">
            <IconCreditCard className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <h3 className="text-sm font-medium mb-1">No payment methods</h3>
            <p className="text-sm text-muted-foreground mb-4">You haven't added any payment methods yet.</p>
            <Button size="sm" onClick={handleAddPaymentMethod} loading={isPaymentMethodSetupIntentPending}>
              Add payment method
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
