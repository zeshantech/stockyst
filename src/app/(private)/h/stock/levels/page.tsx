"use client";

import React from "react";
import { Metadata } from "next";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/(private)/dashboard/page";
import { PlusIcon, DownloadIcon, UploadIcon, SettingsIcon } from "lucide-react";
import { StockLevelsTable } from "@/components/(private)/dashboard/stock/levels/stock-levels-table";
import { StockLevelsStats } from "@/components/(private)/dashboard/stock/levels/stock-levels-stats";
import { StockLevelDialog } from "@/components/(private)/dashboard/stock/levels/stock-level-dialog";

export default function StockLevelsPage() {
  return (
    <Page>
      <PageHeader
        title="Stock Levels"
        description="Set and monitor min/max levels and reorder points for your inventory"
        action={
          <div className="space-x-2">
            <Button variant="outline">
              <DownloadIcon className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline">
              <UploadIcon className="mr-2 h-4 w-4" />
              Import
            </Button>
            <Button variant="outline" size="icon">
              <SettingsIcon className="h-4 w-4" />
            </Button>
            <StockLevelDialog
              trigger={
                <Button>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Level
                </Button>
              }
            />
          </div>
        }
      />

      <StockLevelsStats />
      <StockLevelsTable />
    </Page>
  );
}
