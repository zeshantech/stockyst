"use client";

import React from "react";
import { Page } from "@/components/(private)/dashboard/page";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { FeatureComingSoon } from "@/components/ui/feature-coming-soon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, TrendingUp, Clock, BadgePercent } from "lucide-react";

export default function SupplierTrackingPage() {
  return (
    <Page>
      <PageHeader
        title="Supplier Performance Tracking"
        description="Monitor and analyze supplier performance metrics"
      />

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureComingSoon
              title="Supplier Analytics"
              description="Comprehensive dashboard with key performance indicators for all suppliers"
              variant="minimal"
              showBackButton={false}
              estimatedTime="Q4 2024"
              icon={<LineChart className="h-8 w-8 text-muted-foreground" />}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quality Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <FeatureComingSoon
                title="Quality Metrics"
                description="Track defect rates, returns, and quality incidents by supplier"
                variant="minimal"
                showBackButton={false}
                icon={<TrendingUp className="h-8 w-8 text-muted-foreground" />}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <FeatureComingSoon
                title="On-Time Delivery"
                description="Monitor delivery times and reliability against promised dates"
                variant="minimal"
                showBackButton={false}
                icon={<Clock className="h-8 w-8 text-muted-foreground" />}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cost Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <FeatureComingSoon
              title="Pricing Comparisons"
              description="Compare costs across suppliers and track price changes over time"
              variant="minimal"
              showBackButton={false}
              icon={<BadgePercent className="h-8 w-8 text-muted-foreground" />}
            />
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
