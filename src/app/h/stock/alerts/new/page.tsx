"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { IconAlertCircle } from "@tabler/icons-react";

import { AlertRuleForm } from "@/components/dashboard/stock/alert-rule-form";
import { AlertRuleFormData } from "@/types/stock-alerts";

export default function NewAlertRulePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: AlertRuleFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to create alert rule
      console.log("Creating alert rule:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      router.push("/h/stock/alerts/settings");
    } catch (error) {
      console.error("Failed to create alert rule:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <IconAlertCircle className="size-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">New Alert Rule</h1>
          <p className="text-muted-foreground">
            Create a new rule to monitor your stock levels
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <AlertRuleForm
          onSubmit={handleSubmit}
          onCancel={() => router.push("/h/stock/alerts/settings")}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
