"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconAlertTriangle } from "@tabler/icons-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useBillingStore } from "@/store/useBillingStore";

export function CancelSubscription() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const cancelSubscription = useBillingStore((state) => state.cancelSubscription);
  const isCancellingSubscription = useBillingStore((state) => state.isCancelSubscriptionPending);

  const handleCancelSubscription = () => {
    cancelSubscription();
    setIsConfirmOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cancel Subscription</CardTitle>
        <CardDescription>Cancel your subscription and delete account data.</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant={"error"}>
          <IconAlertTriangle />
          <AlertTitle>Warning: This action cannot be undone</AlertTitle>
          <AlertDescription>
            After cancelling subscription, you will still have access to the premium features for the rest of the billing cycle.
            <ConfirmationDialog
              trigger={
                <Button className="mt-4" color="error">
                  Cancel Subscription
                </Button>
              }
              title="Are you absolutely sure?"
              description="This action will cancel your subscription and you will still have access to the premium features for the rest of the billing cycle, but we will not deduct any money from your account."
              cancelText="Cancel"
              confirmText="Yes, Cancel Subscription"
              onConfirm={handleCancelSubscription}
              isLoading={isCancellingSubscription}
              confirmButtonProps={{
                color: "error",
              }}
              open={isConfirmOpen}
              onOpenChange={setIsConfirmOpen}
            />
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
