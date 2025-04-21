import * as React from "react";

import ProductDetailsClient from "@/components/(private)/dashboard/products/ProductDetailsClient";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <ProductDetailsClient id={(await params).id} />;
}
