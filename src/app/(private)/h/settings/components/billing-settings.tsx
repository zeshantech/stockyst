"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlanOverview } from "./plan-overview";
import { PaymentMethods } from "./payment-methods";
import { Invoices } from "./invoices";
import { CancelSubscription } from "./cancel-subscription";

export function BillingSettings() {
  const [activeTab, setActiveTab] = useState("plans");

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-8 w-full">
          <TabsTrigger value="plans">Plans & Usage</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-8">
          <PlanOverview />
        </TabsContent>

        <TabsContent value="payment" className="space-y-8">
          <PaymentMethods />
        </TabsContent>

        <TabsContent value="history" className="space-y-8">
          <Invoices />
        </TabsContent>
      </Tabs>

      <CancelSubscription />
    </div>
  );
}
