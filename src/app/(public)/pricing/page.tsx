"use client";

import { PageHeader } from "@/components/(public)/page-header";
import { PageFooter } from "@/components/(public)/page-footer";
import { SubscriptionManager } from "@/components/subscription/subscription-manager";

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <PageHeader />

      {/* Main Content */}
      <main className="flex-grow bg-muted/30">
        <SubscriptionManager />
      </main>

      {/* Footer */}
      <PageFooter />
    </div>
  );
}
