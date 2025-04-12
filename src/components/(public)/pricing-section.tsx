"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconCheck, IconShield } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// Define pricing plans
const pricingPlans = [
  {
    id: "basic",
    name: "Basic",
    price: "$19",
    period: "/month",
    features: [
      "Up to 500 inventory items",
      "2 team members",
      "Basic reporting",
      "Standard support",
    ],
    isPopular: false,
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
  },
  {
    id: "professional",
    name: "Professional",
    price: "$49",
    period: "/month",
    features: [
      "Unlimited inventory items",
      "10 team members",
      "Advanced reporting",
      "API access",
      "Email support",
      "Custom fields",
    ],
    isPopular: true,
    buttonText: "Get Started",
    buttonVariant: "default" as const,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    period: "/month",
    features: [
      "Unlimited inventory items",
      "Unlimited team members",
      "Advanced reporting + custom reports",
      "Premium API access",
      "24/7 priority support",
      "Custom fields & workflows",
      "Dedicated account manager",
    ],
    isPopular: false,
    buttonText: "Contact Sales",
    buttonVariant: "default" as const,
  },
];

export function PricingSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              No hidden fees or complicated tiers. Select the plan that fits
              your business needs.
            </p>
          </motion.div>
        </div>

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
                        {plan.price}
                      </span>
                      <span className="text-sm text-muted-foreground mb-1">
                        {plan.period}
                      </span>
                    </div>
                    <div className="mt-3 text-sm text-muted-foreground">
                      {plan.id === "basic" &&
                        "Perfect for small businesses just starting out"}
                      {plan.id === "professional" &&
                        "Great for growing businesses with expanding needs"}
                      {plan.id === "enterprise" &&
                        "Advanced features for large organizations"}
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
                          <IconCheck className="size-3" />
                        </div>
                        <span className="text-foreground">{feature}</span>
                      </motion.li>
                    ))}
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
                  >
                    {plan.buttonText}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground mt-3">
                    {plan.id === "basic" && "No credit card required to start"}
                    {plan.id === "professional" &&
                      "14-day money back guarantee"}
                    {plan.id === "enterprise" &&
                      "Custom implementation included"}
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
            <IconShield className="size-4 text-primary" />
            All plans include 99.9% uptime guarantee and 24/7 technical support
          </p>
        </motion.div>
      </div>
    </section>
  );
}
