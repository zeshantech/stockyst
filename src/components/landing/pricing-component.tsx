"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconCheck, IconShield } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// Define pricing plans
const pricingPlans = [
  {
    id: "free",
    name: "Free",
    price: {
      monthly: "$0",
      yearly: "$0",
    },
    period: {
      monthly: "/month",
      yearly: "/year",
    },
    features: [
      "Up to 100 inventory items",
      "1 team member",
      "Basic reporting",
      "Community support",
      "CSV import/export",
      "7 day history retention",
    ],
    limitations: ["No API access", "No custom fields", "Limited integrations"],
    isPopular: false,
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
  },
  {
    id: "professional",
    name: "Professional",
    price: {
      monthly: "$49",
      yearly: "$490",
    },
    period: {
      monthly: "/month",
      yearly: "/year",
    },
    features: [
      "Unlimited inventory items",
      "10 team members",
      "Advanced reporting",
      "API access",
      "Email support",
      "Custom fields",
      "All integrations",
      "Barcode scanning",
      "Batch operations",
      "Priority support",
      "1 year history retention",
    ],
    isPopular: true,
    buttonText: "Get Started",
    buttonVariant: "default" as const,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: {
      monthly: "$99",
      yearly: "$990",
    },
    period: {
      monthly: "/month",
      yearly: "/year",
    },
    features: [
      "Unlimited inventory items",
      "Unlimited team members",
      "Advanced reporting + custom reports",
      "Premium API access",
      "24/7 priority support",
      "Custom fields & workflows",
      "Dedicated account manager",
      "Advanced security features",
      "Multi-location management",
      "Custom integrations",
      "Unlimited history retention",
      "SLA guarantees",
    ],
    isPopular: false,
    buttonText: "Contact Sales",
    buttonVariant: "default" as const,
  },
];

interface PricingComponentProps {
  showTitle?: boolean;
  defaultBillingCycle?: "monthly" | "yearly";
  className?: string;
}

export function PricingComponent({
  showTitle = true,
  defaultBillingCycle = "monthly",
  className,
}: PricingComponentProps) {
  const [billingCycle, setBillingCycle] = React.useState<"monthly" | "yearly">(
    defaultBillingCycle
  );

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

            <div className="mt-8 inline-flex items-center p-1 bg-muted rounded-lg">
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
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="flex"
            >
              <div
                className={cn(
                  "relative rounded-2xl overflow-hidden border shadow-lg h-full flex flex-col w-full group transition-all duration-300",
                  plan.isPopular
                    ? "border-primary/40 shadow-primary/20"
                    : "border-border hover:border-primary/20 hover:shadow-md"
                )}
              >
                {plan.isPopular && (
                  <>
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 to-primary"></div>
                    <div className="absolute -right-12 top-6 bg-gradient-to-r from-primary/80 to-primary text-primary-foreground px-12 py-1 rotate-45 text-xs font-medium shadow-md">
                      Most Popular
                    </div>
                  </>
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
                        plan.isPopular ? "text-primary" : "text-foreground"
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
                      {plan.id === "free" &&
                        "Perfect for individuals and small startups just getting started"}
                      {plan.id === "professional" &&
                        "Ideal for growing businesses with expanding inventory needs"}
                      {plan.id === "enterprise" &&
                        "Complete solution for large organizations with complex requirements"}
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
                              : "bg-muted text-muted-foreground"
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
                              delay:
                                0.1 * (plan.features.length + idx) +
                                index * 0.1,
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
                    onClick={() => {
                      if (plan.id === "enterprise") {
                        window.location.href = "/request-demo";
                      }
                    }}
                  >
                    {plan.buttonText}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-3">
                    {plan.id === "free" && "No credit card required to start"}
                    {plan.id === "professional" &&
                      "14-day money-back guarantee on all paid plans"}
                    {plan.id === "enterprise" &&
                      "Personalized onboarding and dedicated support included"}
                  </p>
                </div>
              </div>
            </motion.div>
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
      </div>
    </div>
  );
}
