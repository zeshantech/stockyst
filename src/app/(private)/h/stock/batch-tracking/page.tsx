import React from "react";

import { Metadata } from "next";
import BatchTrackingTable from "@/components/(private)/dashboard/stock/batch-tracking/batch-tracking-table";
import BatchTrackingFilters from "@/components/(private)/dashboard/stock/batch-tracking/batch-tracking-filters";
import { Page } from "@/components/(private)/dashboard/page";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { DownloadIcon, PlusIcon, UploadIcon } from "lucide-react";
import BatchTrackingForm from "@/components/(private)/dashboard/stock/batch-tracking/batch-tracking-form";
import { DialogComponent } from "@/components/ui/dialog";

export const metadata: Metadata = {
  title: "Batch Tracking | InvenTree",
  description: "Track stock items by batch number",
};

export default function BatchTrackingPage() {
  return (
    <Page>
      <PageHeader
        title="Batch Tracking"
        description="Track and manage stock items by batch number"
        action={
          <div className="space-x-2">
            <Button variant="outline">
              <DownloadIcon />
              Export
            </Button>
            <Button variant="outline">
              <UploadIcon />
              Import
            </Button>

            <DialogComponent
              trigger={
                <Button>
                  <PlusIcon />
                  Add Batch
                </Button>
              }
              title="Add Batch"
              description="Create a new batch for tracking stock items"
            >
              <BatchTrackingForm />
            </DialogComponent>
          </div>
        }
      />
      <BatchTrackingFilters />
      <BatchTrackingTable />
    </Page>
  );
}
