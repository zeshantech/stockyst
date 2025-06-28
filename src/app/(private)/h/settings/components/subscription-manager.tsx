"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IconShield } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { PricingCard } from "./pricing-card";
import { CustomPlanRequest } from "./custom-plan-request";
import { useBillingStore } from "@/store/useBillingStore";
import { IntervalType } from "@/types/plan";
import { SpinnerBox } from "../ui/spinner";
import { PaymentForm } from "../ui/payment-form";
import ReactConfetti from "react-confetti";

interface SubscriptionManagerProps {
  className?: string;
  showTitle?: boolean;
}

export function SubscriptionManager({ showTitle = false, className }: SubscriptionManagerProps) {
  const plans = useBillingStore((store) => store.plans);
  const isPlansLoading = useBillingStore((store) => store.isPlansLoading);
  const subscribeToPlanResult = useBillingStore((store) => store.subscribeToPlanResult);
  const clearSubscribeToPlanResult = useBillingStore((store) => store.clearSubscribeToPlanResult);

  const [activeTab, setActiveTab] = useState<IntervalType>(IntervalType.MONTHLY);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (subscribeToPlanResult?.paymentStatus === "paid") {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 10000);
    }
  }, [subscribeToPlanResult]);

  const freePlan = plans?.free;
  const proPlan = plans?.pro;
  const customPlan = plans?.custom;

  if (isPlansLoading) {
    return <SpinnerBox />;
  }

  return (
    <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", className)}>
      {showConfetti && <ReactConfetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={1000} tweenDuration={5000} />}

      {showTitle && (
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <span className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-sm font-medium text-primary mb-4">Simple Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">Choose Your Perfect Plan</h2>
            <p className="text-lg text-muted-foreground">Start with our free tier and upgrade as your business grows. No hidden fees or complicated tiers.</p>
          </motion.div>
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
      <div className="mb-10">
        {subscribeToPlanResult?.clientSecret && subscribeToPlanResult.paymentStatus === "pending" ? (
          <PaymentForm
            clientSecret={subscribeToPlanResult?.clientSecret}
            onPaymentSuccess={() => {
              clearSubscribeToPlanResult();
              setShowConfetti(true);
              setTimeout(() => {
                setShowConfetti(false);
              }, 10000);
            }}
          />
        ) : null}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-12">
        {freePlan && <PricingCard {...freePlan} activeTab={activeTab} />}
        {proPlan && <PricingCard {...proPlan} activeTab={activeTab} />}
        {customPlan && <PricingCard {...customPlan} activeTab={activeTab} />}
      </div>

      <div className="mt-12">
        <CustomPlanRequest />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }} viewport={{ once: true }} className="mt-16 text-center">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <IconShield className="h-4 w-4 text-primary" />
          All plans include secure data storage, regular updates, and responsive technical support
        </p>
      </motion.div>
    </div>
  );
}
