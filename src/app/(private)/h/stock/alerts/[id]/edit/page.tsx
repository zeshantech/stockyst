"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { IconAlertCircle } from "@tabler/icons-react";

import { AlertRuleForm } from "@/components/(private)/dashboard/stock/alert-rule-form";
import { AlertRuleFormData } from "@/types/stock-alerts";

export default function EditAlertRulePage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [initialData, setInitialData] =
    React.useState<AlertRuleFormData | null>(null);

  React.useEffect(() => {
    // TODO: Implement API call to fetch alert rule data
    const fetchAlertRule = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        setInitialData({
          name: "Low Stock Alert",
          description: "Alert when stock levels are low",
          conditionType: "stock_level",
          operator: "less_than",
          values: ["10"],
          products: ["product-1", "product-2"],
          notificationChannels: ["email", "push"],
        });
      } catch (error) {
        console.error("Failed to fetch alert rule:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlertRule();
  }, [params.id]);

  const handleSubmit = async (data: AlertRuleFormData) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement API call to update alert rule
      console.log("Updating alert rule:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      router.push("/h/stock/alerts/settings");
    } catch (error) {
      console.error("Failed to update alert rule:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!initialData) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-muted-foreground">Alert rule not found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <IconAlertCircle className="size-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">Edit Alert Rule</h1>
          <p className="text-muted-foreground">
            Modify your stock level monitoring rule
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <AlertRuleForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => router.push("/h/stock/alerts/settings")}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
