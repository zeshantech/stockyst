"use client";

import React, { useState, useEffect } from "react";
import { MailIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DialogComponent } from "@/components/ui/dialog";
import {
  useNewsletterSubscribe,
  useEmailValidation,
} from "@/hooks/use-newsletter";

export interface DevelopmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DevelopmentDialog({
  open,
  onOpenChange,
}: DevelopmentDialogProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Use our custom hooks
  const { isValid, errorMessage } = useEmailValidation(email);
  const { mutate: subscribe, error } = useNewsletterSubscribe();

  // Check localStorage on component mount
  useEffect(() => {
    const isSubscribed = localStorage.getItem("newsletter_subscribed");
    if (isSubscribed === "true") {
      setSubscribed(true);
    }
  }, []);

  const handleSubscribe = async () => {
    if (!isValid) {
      return;
    }
    subscribe(email);
    setSubscribed(true);
    // Save subscription status to localStorage
    localStorage.setItem("newsletter_subscribed", "true");
  };

  // If user is already subscribed, don't show the dialog
  useEffect(() => {
    if (subscribed && open) {
      onOpenChange(false);
    }
  }, [subscribed, open, onOpenChange]);

  return (
    <DialogComponent
      open={open && !subscribed}
      onOpenChange={onOpenChange}
      title="Development Site"
      description="This site is currently under development. All data is static and nothing functional for now!"
      contentClassName="max-w-md"
      footer={
        !subscribed ? (
          <Button onClick={handleSubscribe}>Subscribe</Button>
        ) : (
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        )
      }
    >
      <div className="flex flex-col gap-4">
        {!subscribed ? (
          <>
            <div className="flex items-center gap-2 text-info">
              <MailIcon className="size-5" />
              <span>Stay updated with our newsletter</span>
            </div>

            {(errorMessage || error) && (
              <Alert variant="error" className="py-2">
                <AlertDescription>
                  {errorMessage ||
                    (error as any)?.message ||
                    "Failed to subscribe"}
                </AlertDescription>
              </Alert>
            )}

            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </>
        ) : (
          <div className="flex items-center gap-2 text-success">
            <CheckCircleIcon className="size-5" />
            <span>Thank you! We'll notify you once the site is ready.</span>
          </div>
        )}
      </div>
    </DialogComponent>
  );
}
