"use client";

import { PageHeader } from "@/components/landing/page-header";
import { PageFooter } from "@/components/landing/page-footer";
import { PricingComponent } from "@/components/landing/pricing-component";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <PageHeader />

      {/* Main Content */}
      <main className="flex-grow bg-muted/30">
        <PricingComponent defaultBillingCycle="yearly" />
      </main>

      {/* Footer */}
      <PageFooter />
    </div>
  );
}
