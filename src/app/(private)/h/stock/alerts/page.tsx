import React from "react";
import AlertsStats from "@/components/(private)/dashboard/stock/alerts/alerts-stats";
import AlertsTable from "@/components/(private)/dashboard/stock/alerts/alerts-table";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { AlertCircle, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/(private)/dashboard/page";

export default function AlertsPage() {
  return (
    <Page>
      <PageHeader
        description="Monitor and manage your stock alerts"
        title={"Stock Alerts"}
        titleIcon={<AlertCircle className="text-error" />}
        action={
          <div className="space-x-2">
            <Button variant="outline" href="/h/stock">
              <Plus />
              View Stock
            </Button>
            <Button
              variant="outline"
              size="icon"
              href="/h/stock/alerts/settings"
            >
              <Settings />
            </Button>
          </div>
        }
      />

      <AlertsStats />
      <AlertsTable />
    </Page>
  );
}
