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
import { IconAlertTriangle } from "@tabler/icons-react";
import { useSubscription } from "@/hooks/use-subscription";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export function CancelSubscription() {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { cancelSubscription, isCancellingSubscription } = useSubscription();

  const handleCancelSubscription = async () => {
    await cancelSubscription();
    setIsConfirmOpen(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cancel Subscription</CardTitle>
        <CardDescription>
          Cancel your subscription and delete account data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert variant={"error"}>
          <IconAlertTriangle />
          <AlertTitle>Warning: This action cannot be undone</AlertTitle>
          <AlertDescription>
            Cancelling your subscription will immediately revoke access to
            premium features. Your data will be retained for 30 days after
            cancellation.
            <ConfirmationDialog
              trigger={
                <Button className="mt-4" color="error">
                  Cancel Subscription
                </Button>
              }
              title="Are you absolutely sure?"
              description="This action will immediately cancel your subscription and revoke access to premium features. Your data will be retained for 30 days and then permanently deleted."
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
