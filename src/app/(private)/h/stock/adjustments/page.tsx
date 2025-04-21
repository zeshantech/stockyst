import React from "react";
import { Metadata } from "next";
import AdjustmentsHeader from "@/components/(private)/dashboard/stock/adjustments/adjustments-header";
import AdjustmentsTable from "@/components/(private)/dashboard/stock/adjustments/adjustments-table";
import AdjustmentsFilters from "@/components/(private)/dashboard/stock/adjustments/adjustments-filters";

export const metadata: Metadata = {
  title: "Stock Adjustments | Stockyst",
  description: "Manage stock adjustments and inventory reconciliation",
};

export default function AdjustmentsPage() {
  return (
    <div className="space-y-6">
      <AdjustmentsHeader />
      <AdjustmentsFilters />
      <AdjustmentsTable />
    </div>
  );
}
