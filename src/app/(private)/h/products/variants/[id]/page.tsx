import * as React from "react";

import VariantDetailsClient from "./client";

export default async function VariantDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <VariantDetailsClient id={(await params).id} />;
}
