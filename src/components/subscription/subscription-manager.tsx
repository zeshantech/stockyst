"use client";

import { useState } from "react";
import { IconShield } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { PricingCard } from "./pricing-card";
import { CustomPlanRequest } from "./custom-plan-request-card";
import { IntervalType } from "@/types/plan";
import { SpinnerBox } from "../ui/spinner";
import { useGetSubscriptionPlans } from "@/hooks/use-billing";

interface SubscriptionManagerProps {
  className?: string;
  showTitle?: boolean;
}

export function SubscriptionManager({ showTitle = false, className }: SubscriptionManagerProps) {
  const { data: plans, isLoading: isPlansLoading } = useGetSubscriptionPlans();

  const [activeTab, setActiveTab] = useState<IntervalType>(IntervalType.MONTHLY);

  const freePlan = plans?.free;
  const proPlan = plans?.pro;

  if (isPlansLoading) {
    return <SpinnerBox />;
  }

  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {showTitle && (
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">Simple Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Choose Your Perfect Plan</h2>
          <p className="text-lg text-muted-foreground">Start with our free tier and upgrade as your business grows. No hidden fees or complicated tiers.</p>
        </div>
      )}

      {/* Billing Cycle Toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center p-1 bg-muted rounded-lg">
          <button onClick={() => setActiveTab(IntervalType.MONTHLY)} className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all", activeTab === IntervalType.MONTHLY ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            Monthly billing
          </button>
          <button onClick={() => setActiveTab(IntervalType.ANNUAL)} className={cn("px-4 py-2 text-sm font-medium rounded-md transition-all flex items-center gap-1.5", activeTab === IntervalType.ANNUAL ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}>
            Yearly billing
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-background text-success">Save 20%</span>
          </button>
        </div>
      </div>

      {/* Main Subscription Plans (Free and Pro) */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-12">
        {freePlan && <PricingCard {...freePlan} activeTab={activeTab} />}
        {proPlan && <PricingCard {...proPlan} activeTab={activeTab} />}
      </div>

      <div className="mt-12">
        <CustomPlanRequest />
      </div>

      <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
        <IconShield className="h-4 w-4 text-primary" />
        All plans include secure data storage, regular updates, and responsive technical support
      </p>
    </div>
  );
}
