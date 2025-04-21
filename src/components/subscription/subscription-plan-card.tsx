"use client";

import { ISubscriptionPlan, BillingCycle } from "@/types/subscription";
import { PricingCard } from "./pricing-card";

interface SubscriptionPlanCardProps {
  plan: ISubscriptionPlan;
  billingCycle: BillingCycle;
  isCurrentPlan?: boolean;
  onSelect?: (planId: string) => void;
  index?: number;
}

export function SubscriptionPlanCard({
  plan,
  billingCycle,
  isCurrentPlan = false,
  onSelect,
  index = 0,
}: SubscriptionPlanCardProps) {
  return (
    <PricingCard
      plan={plan}
      billingCycle={billingCycle}
      isCurrentPlan={isCurrentPlan}
      onSelect={onSelect}
      index={index}
    />
  );
}
