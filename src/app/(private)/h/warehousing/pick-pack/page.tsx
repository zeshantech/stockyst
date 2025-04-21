"use client";

import React from "react";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Page } from "@/components/(private)/dashboard/page";

export default function PickPackPage() {
  return (
    <Page>
      <PageHeader
        title="Pick & Pack"
        description="This page is under construction"
      />
      <div className="py-10 text-center">
        <h2 className="text-xl font-semibold">Coming Soon</h2>
        <p className="text-muted-foreground">
          Pick and pack operations are being developed
        </p>
      </div>
    </Page>
  );
}
