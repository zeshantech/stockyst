"use client";

import React from "react";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/(private)/dashboard/page";
import { PlusIcon, DownloadIcon } from "lucide-react";
import { StockTransfersTable } from "@/components/(private)/dashboard/stock/transfers/stock-transfers-table";
import { StockTransfersStats } from "@/components/(private)/dashboard/stock/transfers/stock-transfers-stats";
import Link from "next/link";

export default function StockTransfersPage() {
  return (
    <Page>
      <PageHeader
        title="Stock Transfers"
        description="Transfer inventory between locations and manage stock movements"
        action={
          <div className="space-x-2">
            <Button variant="outline">
              <DownloadIcon />
              Export
            </Button>
            <Button href="/h/stock/transfers/create">
              <PlusIcon />
              New Transfer
            </Button>
          </div>
        }
      />

      <StockTransfersStats />
      <StockTransfersTable />
    </Page>
  );
}
