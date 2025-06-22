"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { IconCheck } from "@tabler/icons-react";
import { format } from "date-fns";
import { useState } from "react";
import { SubscriptionManager } from "@/components/subscription/subscription-manager";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscription } from "@/hooks/use-subscription";

export function PlanOverview() {
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const { currentPlan, usageStats, isLoadingUsageStats, activeSubscription } = useSubscription();

  if (!currentPlan || !activeSubscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your current subscription plan and usage information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Plan</CardTitle>
        <CardDescription>Your current subscription plan and usage information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md bg-primary/5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-lg">{currentPlan.name} Plan</h3>
              <Badge variant="success">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {currentPlan.price[activeSubscription.billingCycle]} billed {activeSubscription.billingCycle}
            </p>
            {activeSubscription.nextBillingDate ? <p className="text-sm mt-3">Next billing date: {format(new Date(activeSubscription.nextBillingDate), "MMMM d, yyyy")}</p> : null}
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button onClick={() => setIsChangingPlan(true)}>Change Plan</Button>
          </div>
        </div>

        {isChangingPlan ? (
          <SubscriptionManager />
        ) : (
          <>
            <div className="space-y-2">
              <h3 className="font-medium">Plan Features</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-2">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <IconCheck className="h-4 w-4 text-success flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {isLoadingUsageStats || !usageStats ? (
              <div className="space-y-4">
                <h3 className="font-medium">Usage</h3>
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-medium">Usage</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Team Members</Label>
                    <div className="text-sm font-medium">
                      {usageStats.teamMembers.used} / {usageStats.teamMembers.total}
                    </div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${usageStats.teamMembers.percentage}%` }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {usageStats.teamMembers.used} of {usageStats.teamMembers.total} team members used
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Storage</Label>
                    <div className="text-sm font-medium">
                      {usageStats.storage.used} GB / {usageStats.storage.total} GB
                    </div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${usageStats.storage.percentage}%` }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">{usageStats.storage.percentage}% of storage used</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>API Requests</Label>
                    <div className="text-sm font-medium">
                      {usageStats.apiRequests.used.toLocaleString()} / {usageStats.apiRequests.total.toLocaleString()}
                    </div>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${usageStats.apiRequests.percentage}%` }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground">{usageStats.apiRequests.percentage}% of monthly API quota used</p>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
