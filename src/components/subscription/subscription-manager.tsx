"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconShield } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { BillingCycle } from "@/types/subscription";
import { PricingCard } from "./pricing-card";
import { StripePaymentForm } from "./stripe-payment-form";
import { useSubscription } from "@/hooks/use-subscription";
import { toast } from "sonner";
import { useKeycloak } from "@/contexts/KeycloakProvider";

interface SubscriptionManagerProps {
  className?: string;
  showTitle?: boolean;
  defaultBillingCycle?: BillingCycle;
}

export function SubscriptionManager({
  className,
  showTitle = false,
  defaultBillingCycle = "monthly",
}: SubscriptionManagerProps) {
  const { isAuthenticated, login } = useKeycloak();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>(defaultBillingCycle);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const {
    activeSubscription,
    paymentMethods,
    billingInfo,
    invoices,
    currentPlan,
    subscriptionPlans,
    isLoadingActiveSubscription,
    isLoadingPaymentMethods,
    isLoadingBillingInfo,
    isLoadingInvoices,
    isCreatingSubscription,
    isUpdatingSubscription,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    addPaymentMethod,
  } = useSubscription();

  const handlePlanSelect = (planId: string) => {
    try {
      if (!isAuthenticated) {
        login(window.location.origin + window.location.pathname);
        return;
      }

      setSelectedPlanId(planId);
      setShowPaymentForm(true);
    } catch (error) {
      console.error("Error checking authentication:", error);
      toast.error("Authentication error. Please try again.");
    }
  };

  const handlePaymentSubmit = async (paymentMethod: any) => {
    try {
      if (!selectedPlanId) return;

      // Add payment method
      await addPaymentMethod(paymentMethod);

      // Create or update subscription
      if (activeSubscription) {
        await updateSubscription({
          planId: selectedPlanId,
          billingCycle,
        });
      } else {
        await createSubscription({
          planId: selectedPlanId,
          billingCycle,
        });
      }

      setShowPaymentForm(false);
      setSelectedPlanId(null);
      toast.success("Subscription updated successfully!");
    } catch (_) {
      toast.error("Failed to update subscription. Please try again.");
    }
  };

  const handleCancelSubscription = async () => {
    try {
      await cancelSubscription();
      toast.success("Subscription cancelled successfully!");
    } catch (_) {
      toast.error("Failed to cancel subscription. Please try again.");
    }
  };

  if (
    !isAuthenticated &&
    (isLoadingActiveSubscription ||
      isLoadingPaymentMethods ||
      isLoadingBillingInfo ||
      isLoadingInvoices)
  ) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn("py-12", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showTitle && (
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">
                Simple Pricing
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Choose Your Perfect Plan
              </h2>
              <p className="text-lg text-muted-foreground">
                Start with our free tier and upgrade as your business grows. No
                hidden fees or complicated tiers.
              </p>
            </motion.div>
          </div>
        )}

        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center p-1 bg-muted rounded-lg">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all",
                billingCycle === "monthly"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-1.5",
                billingCycle === "yearly"
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Yearly billing
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-background text-success">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {subscriptionPlans.map((plan, index) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              billingCycle={billingCycle}
              isCurrentPlan={currentPlan?.id === plan.id}
              onSelect={handlePlanSelect}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <IconShield className="h-4 w-4 text-primary" />
            All plans include secure data storage, regular updates, and
            responsive technical support
          </p>
        </motion.div>

        {/* Payment Form Modal */}
        {showPaymentForm && selectedPlanId && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-lg shadow-lg max-w-md w-full p-6"
            >
              <h2 className="text-2xl font-bold mb-4">
                Complete Your Subscription
              </h2>
              <p className="text-muted-foreground mb-6">
                Please enter your payment details to complete your subscription
                to the{" "}
                {subscriptionPlans.find((p) => p.id === selectedPlanId)?.name}{" "}
                plan.
              </p>
              <StripePaymentForm
                onSubmit={handlePaymentSubmit}
                isLoading={isCreatingSubscription || isUpdatingSubscription}
              />
              <Button
                variant="ghost"
                className="w-full mt-4"
                onClick={() => {
                  setShowPaymentForm(false);
                  setSelectedPlanId(null);
                }}
              >
                Cancel
              </Button>
            </motion.div>
          </div>
        )}

        {activeSubscription && (
          <div className="mt-16 space-y-8">
            {/* Current Subscription Details */}
            <div className="bg-card rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold">Current Subscription</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-medium">{currentPlan?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Billing Cycle</p>
                  <p className="font-medium capitalize">
                    {activeSubscription.billingCycle}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Next Billing Date
                  </p>
                  <p className="font-medium">
                    {new Date(
                      activeSubscription.currentPeriodEnd
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p
                    className={cn(
                      "font-medium capitalize",
                      activeSubscription.status === "active"
                        ? "text-green-500"
                        : "text-yellow-500"
                    )}
                  >
                    {activeSubscription.status}
                  </p>
                </div>
              </div>
              {!activeSubscription.cancelAtPeriodEnd && (
                <Button
                  variant="outline"
                  onClick={handleCancelSubscription}
                  className="mt-4"
                >
                  Cancel Subscription
                </Button>
              )}
            </div>

            {/* Payment Methods */}
            {paymentMethods && paymentMethods.length > 0 && (
              <div className="bg-card rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Payment Methods</h3>
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-muted rounded flex items-center justify-center">
                          {method.type === "card" && (
                            <span className="text-lg">💳</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {method.type === "card" && `•••• ${method.last4}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Expires {method.expiryDate}
                          </p>
                        </div>
                      </div>
                      {method.isDefault && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Billing Information */}
            {billingInfo && (
              <div className="bg-card rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Billing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{billingInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{billingInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{billingInfo.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">City</p>
                    <p className="font-medium">{billingInfo.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">State</p>
                    <p className="font-medium">{billingInfo.state}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Zip Code</p>
                    <p className="font-medium">{billingInfo.zipCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Country</p>
                    <p className="font-medium">{billingInfo.country}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Invoices */}
            {invoices && invoices.length > 0 && (
              <div className="bg-card rounded-lg p-6 space-y-4">
                <h3 className="text-xl font-semibold">Invoices</h3>
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {new Date(invoice.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {invoice.amount}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-xs px-2 py-1 rounded",
                            invoice.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          )}
                        >
                          {invoice.status}
                        </span>
                        {invoice.invoiceUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(invoice.invoiceUrl, "_blank")
                            }
                          >
                            View
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
