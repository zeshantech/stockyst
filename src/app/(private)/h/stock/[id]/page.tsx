import React from "react";

import StockDetailClient from "./client";

export default async function StockDetailPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  return <StockDetailClient id={(await params).id} />;
}
