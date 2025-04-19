"use client";

import React from "react";
import { Page } from "@/components/(private)/dashboard/page";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { FeatureComingSoon } from "@/components/ui/feature-coming-soon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PackageCheck,
  CalendarClock,
  History,
  PanelLeftClose,
} from "lucide-react";

export default function BatchManagementPage() {
  return (
    <Page>
      <PageHeader
        title="Batch Management"
        description="Track and manage inventory by batches and lots"
      />

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Batch Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureComingSoon
              title="Batch Identification"
              description="Organize inventory items by batch or lot numbers for effective tracking and traceability"
              variant="minimal"
              showBackButton={false}
              estimatedTime="Q3 2024"
              icon={<PackageCheck className="h-8 w-8 text-muted-foreground" />}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Expiry Management</CardTitle>
            </CardHeader>
            <CardContent>
              <FeatureComingSoon
                title="Batch Expiration"
                description="Track expiration dates for batches to ensure FEFO inventory management"
                variant="minimal"
                showBackButton={false}
                icon={
                  <CalendarClock className="h-8 w-8 text-muted-foreground" />
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Batch History</CardTitle>
            </CardHeader>
            <CardContent>
              <FeatureComingSoon
                title="Batch Audit Trail"
                description="Maintain complete history of batch movements and transactions"
                variant="minimal"
                showBackButton={false}
                icon={<History className="h-8 w-8 text-muted-foreground" />}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Batch Recall</CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureComingSoon
              title="Recall Management"
              description="Quickly identify and recall specific batches when quality issues arise"
              variant="minimal"
              showBackButton={false}
              icon={
                <PanelLeftClose className="h-8 w-8 text-muted-foreground" />
              }
            />
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
