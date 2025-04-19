"use client";

import React from "react";
import { Page } from "@/components/(private)/dashboard/page";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { FeatureComingSoon } from "@/components/ui/feature-coming-soon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, BarChart, ArrowDownUp } from "lucide-react";

export default function InventoryAdjustmentPage() {
  return (
    <Page>
      <PageHeader
        title="Inventory Adjustment"
        description="Manage stock adjustments and inventory reconciliation"
      />

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Adjustment History</CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureComingSoon
              title="Inventory Adjustments"
              description="View and manage inventory adjustments with detailed history and audit trails"
              variant="minimal"
              showBackButton={false}
              estimatedTime="Q2 2024"
              icon={<ArrowDownUp className="h-8 w-8 text-muted-foreground" />}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock Count</CardTitle>
            </CardHeader>
            <CardContent>
              <FeatureComingSoon
                title="Cycle Counting"
                description="Schedule and perform regular cycle counts to maintain inventory accuracy"
                variant="minimal"
                showBackButton={false}
                icon={
                  <ClipboardCheck className="h-8 w-8 text-muted-foreground" />
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Adjustment Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <FeatureComingSoon
                title="Variance Reports"
                description="Analyze inventory discrepancies and identify patterns to improve accuracy"
                variant="minimal"
                showBackButton={false}
                icon={<BarChart className="h-8 w-8 text-muted-foreground" />}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </Page>
  );
}
