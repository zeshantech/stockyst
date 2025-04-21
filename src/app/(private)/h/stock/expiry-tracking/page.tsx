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

export default function ExpiryTrackingPage() {
  return (
    <Page>
      <PageHeader
        title="Expiry Tracking"
        description="Monitor and manage expiring stock items"
        action={
          <Button>
            <PlusIcon />
            Add Expiry Date
          </Button>
        }
      />

      <ExpiryTrackingStats />
      <ExpiryTrackingFilters />
      <ExpiryTrackingTable />
    </Page>
  );
}
