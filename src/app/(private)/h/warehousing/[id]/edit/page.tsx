"use client";

import React from "react";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Page } from "@/components/(private)/dashboard/page";
import { useParams } from "next/navigation";

export default function EditWarehousePage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <Page>
      <PageHeader
        title={`Edit Warehouse ${id}`}
        description="This page is under construction"
        backButton={true}
        backUrl={`/h/warehousing/${id}`}
      />
      <div className="py-10 text-center">
        <h2 className="text-xl font-semibold">Coming Soon</h2>
        <p className="text-muted-foreground">
          Warehouse edit form is being developed
        </p>
      </div>
    </Page>
  );
}
