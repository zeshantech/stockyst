"use client";

import React from "react";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Page } from "@/components/(private)/dashboard/page";

export default function TransfersPage() {
  return (
    <Page>
      <PageHeader
        title="Transfers"
        description="This page is under construction"
      />
      <div className="py-10 text-center">
        <h2 className="text-xl font-semibold">Coming Soon</h2>
        <p className="text-muted-foreground">This feature is being developed</p>
      </div>
    </Page>
  );
}
