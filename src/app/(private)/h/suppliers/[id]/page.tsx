import * as React from "react";

import SupplierDetailsClient from "./client";

export default async function SupplierDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <SupplierDetailsClient id={(await params).id} />;
}
