import * as React from "react";

import EditAlertRuleClient from "./client";

export default async function EditAlertRulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <EditAlertRuleClient id={(await params).id} />;
}
