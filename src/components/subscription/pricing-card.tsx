"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconCheck } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { BillingCycle, ISubscriptionPlan } from "@/types/subscription";
import { Badge } from "../ui/badge";

interface PricingCardProps {
  plan: ISubscriptionPlan;
  billingCycle: BillingCycle;
  isCurrentPlan?: boolean;
  onSelect?: (planId: string) => void;
  index?: number;
  showPopularBadge?: boolean;
  className?: string;
}

export function PricingCard({
  plan,
  billingCycle,
  isCurrentPlan = false,
  onSelect,
  index = 0,
  showPopularBadge = true,
  className,
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      viewport={{ once: true }}
      className={cn("flex", className)}
    >
      <div
        className={cn(
          "relative rounded-2xl overflow-hidden border shadow-lg h-full flex flex-col w-full group transition-all duration-300",
          plan.isPopular
            ? "border-primary/40 shadow-primary/20"
            : "border-border hover:border-primary/20 hover:shadow-md",
          isCurrentPlan && "border-success shadow-success/20"
        )}
      >
        {/* Popular badge */}
        {plan.isPopular && showPopularBadge && (
          <>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 to-primary"></div>
            <div className="absolute -right-12 top-6 bg-gradient-to-r from-primary/80 to-primary text-primary-foreground px-12 py-1 rotate-45 text-xs font-medium shadow-md">
              Most Popular
            </div>
          </>
        )}

        {/* Current plan badge */}
        {isCurrentPlan && (
          <Badge className="absolute top-2 right-2 bg-success text-white">
            Current Plan
          </Badge>
        )}

        <div
          className={cn(
            "p-6",
            plan.isPopular
              ? "bg-gradient-to-br from-primary/5 to-background"
              : ""
          )}
        >
          <div className="mb-4">
            <h3
              className={cn(
                "text-2xl font-bold",
                plan.isPopular ? "text-primary" : "text-foreground",
                isCurrentPlan && "text-success"
              )}
            >
              {plan.name}
            </h3>
            <div className="flex items-end gap-1 mt-2">
              <span className="text-4xl font-extrabold text-foreground">
                {plan.price[billingCycle]}
              </span>
              <span className="text-sm text-muted-foreground mb-1">
                {plan.period[billingCycle]}
              </span>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              {plan.description}
            </div>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent my-6"></div>

          <ul className="space-y-4 text-sm flex-grow">
            {plan.features.map((feature, idx) => (
              <motion.li
                key={idx}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * idx + index * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className={cn(
                    "rounded-full p-1 mt-0.5",
                    plan.isPopular
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground",
                    isCurrentPlan && "bg-success/20 text-success"
                  )}
                >
                  <IconCheck className="h-3 w-3" />
                </div>
                <span className="text-foreground">{feature}</span>
              </motion.li>
            ))}

            {plan.limitations && plan.limitations.length > 0 && (
              <>
                <li className="pt-2 text-sm text-muted-foreground font-medium">
                  Limitations:
                </li>
                {plan.limitations.map((limitation, idx) => (
                  <motion.li
                    key={`limit-${idx}`}
                    className="flex items-start gap-3 text-muted-foreground"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.1 * (plan.features.length + idx) + index * 0.1,
                    }}
                    viewport={{ once: true }}
                  >
                    <div className="rounded-full p-1 mt-0.5 bg-muted text-muted-foreground">
                      <IconCheck className="h-3 w-3" />
                    </div>
                    <span>{limitation}</span>
                  </motion.li>
                ))}
              </>
            )}
          </ul>
        </div>

        <div className="p-6 border-t border-border mt-auto">
          <Button
            className={cn(
              "w-full h-12 font-medium transition-all duration-300",
              plan.isPopular
                ? "hover:shadow-lg hover:shadow-primary/20 hover:transform hover:translate-y-[-2px]"
                : ""
            )}
            variant={plan.buttonVariant}
            disabled={isCurrentPlan}
            onClick={() => onSelect && onSelect(plan.id)}
          >
            {isCurrentPlan ? "Current Plan" : plan.buttonText}
          </Button>

          <p className="text-xs text-center text-muted-foreground mt-3">
            {plan.id === "free" && "No credit card required to start"}
            {plan.id === "professional" && "14-day money-back guarantee"}
            {plan.id === "enterprise" && "Personalized onboarding included"}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
