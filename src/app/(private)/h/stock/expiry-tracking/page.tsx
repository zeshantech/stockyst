"use client";

import React from "react";
import { Metadata } from "next";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/(private)/dashboard/page";
import {
  PlusIcon,
  DownloadIcon,
  UploadIcon,
  BellIcon,
  FilterIcon,
} from "lucide-react";
import { ExpiryTrackingTable } from "@/components/(private)/dashboard/stock/expiry-tracking/expiry-tracking-table";
import { ExpiryTrackingFilters } from "@/components/(private)/dashboard/stock/expiry-tracking/expiry-tracking-filters";
import { ExpiryTrackingStats } from "@/components/(private)/dashboard/stock/expiry-tracking/expiry-tracking-stats";
import { ExpiryNotificationsDialog } from "@/components/(private)/dashboard/stock/expiry-tracking/expiry-notifications-dialog";

export const metadata: Metadata = {
  title: "Stock Expiry Tracking | InvenTree",
  description: "Track and manage expiring stock items",
};

export default function ExpiryTrackingPage() {
  return (
    <Page>
      <PageHeader
        title="Expiry Tracking"
        description="Monitor and manage expiring stock items"
        action={
          <div className="space-x-2">
            <Button variant="outline">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
            <ExpiryNotificationsDialog
              trigger={
                <Button variant="outline">
                  <BellIcon className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
              }
            />
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Add Expiry Date
            </Button>
          </div>
        }
      />

      <ExpiryTrackingStats />
      <ExpiryTrackingFilters />
      <ExpiryTrackingTable />
    </Page>
  );
}
