"use client";

import React from "react";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Page } from "@/components/(private)/dashboard/page";

export default function CreateTransferPage() {
  return (
    <Page>
      <PageHeader
        title="New Transfer"
        description="This page is under construction"
        backButton={true}
        backUrl="/h/warehousing/transfers"
      />
      <div className="py-10 text-center">
        <h2 className="text-xl font-semibold">Coming Soon</h2>
        <p className="text-muted-foreground">
          Transfer creation form is being developed
        </p>
      </div>
    </Page>
  );
}
