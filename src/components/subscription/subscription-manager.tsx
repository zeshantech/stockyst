"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { IconShield } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { BillingCycle } from "@/types/subscription";
import { PricingCard } from "./pricing-card";
import { useSubscription } from "@/hooks/use-subscription";
import { toast } from "sonner";
import { useKeycloak } from "@/contexts/keycloak-provider";

interface SubscriptionManagerProps {
  className?: string;
  showTitle?: boolean;
  defaultBillingCycle?: BillingCycle;
}

export function SubscriptionManager({
  showTitle = false,
  defaultBillingCycle = "monthly",
}: SubscriptionManagerProps) {
  const { login, keycloak } = useKeycloak();

  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>(defaultBillingCycle);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const {
    currentPlan,
    subscriptionPlans,
    isLoadingActiveSubscription,
    isLoadingPaymentMethods,
    isLoadingBillingInfo,
    isLoadingInvoices,
  } = useSubscription();

  const handlePlanSelect = (planId: string) => {
    try {
      if (!keycloak?.authenticated) {
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

  if (
    !keycloak?.authenticated &&
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
          All plans include secure data storage, regular updates, and responsive
          technical support
        </p>
      </motion.div>
    </div>
  );
}
