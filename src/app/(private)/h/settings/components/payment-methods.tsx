"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconCreditCard, IconEdit, IconTrash, IconPlus } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBillingStore } from "@/store/useBillingStore";
import { IPaymentMethod } from "@/types/plan";

export function PaymentMethods() {
  const paymentMethods = useBillingStore((state) => state.paymentMethods);
  const isLoadingPaymentMethods = useBillingStore((state) => state.isPaymentMethodsLoading);
  const paymentMethodSetupIntent = useBillingStore((state) => state.paymentMethodSetupIntent);
  const paymentMethodSetupIntentResult = useBillingStore((state) => state.paymentMethodSetupIntentResult);

  const handleAddPaymentMethod = async () => {
    const clientSecret = await paymentMethodSetupIntent();
    console.log(clientSecret);
  };

  if (paymentMethodSetupIntentResult) {
    return <div>Client Secret: {paymentMethodSetupIntentResult.clientSecret}</div>;
  }

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
        <Button size="sm" onClick={handleAddPaymentMethod}>
          <IconPlus className="h-4 w-4 mr-2" />
          Add Method
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods && paymentMethods.length > 0 ? (
          paymentMethods.map((method: IPaymentMethod, index: number) => {
            return (
              <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-14 bg-primary/10 rounded-md flex items-center justify-center">
                    <IconCreditCard className="h-5 w-5" />
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
                  <Button size="icon" variant="ghost">
                    <IconEdit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive">
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
            <p className="text-sm text-muted-foreground mb-4">You haven't added any payment methods yet.</p>
            <Button size="sm" onClick={handleAddPaymentMethod}>
              Add payment method
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
