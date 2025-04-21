"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Selector } from "@/components/ui/selector";
import {
  AlertRule,
  AlertRuleFormData,
  NotificationChannel,
} from "@/types/stock-alerts";
import { TestAlertRuleDialog } from "./test-alert-rule-dialog";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  condition: z.object({
    type: z.enum(["stock_level", "stock_value", "stock_age", "custom"]),
    operator: z.enum(["less_than", "greater_than", "equals", "between"]),
    value: z.number().min(0),
    value2: z.number().optional(),
  }),
  products: z.object({
    type: z.enum(["all", "category", "specific"]),
    ids: z.array(z.string()).optional(),
    categoryIds: z.array(z.string()).optional(),
  }),
  notificationChannels: z.array(
    z.enum(["email", "whatsapp", "phone", "slack", "browser"])
  ),
});

interface AlertRuleFormProps {
  initialData?: AlertRuleFormData & { id?: string };
  onSubmit: (formData: AlertRuleFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function AlertRuleForm({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AlertRuleFormProps) {
  const form = useForm<AlertRuleFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      condition: {
        type: "stock_level",
        operator: "less_than",
        value: 0,
      },
      products: {
        type: "all",
      },
      notificationChannels: ["email", "browser"],
    },
  });

  // Create a derived AlertRule object for testing
  const name = form.watch("name");
  const description = form.watch("description");
  const condition = form.watch("condition");
  const products = form.watch("products");
  const notificationChannels = form.watch("notificationChannels");

  const testRule: AlertRule = React.useMemo(() => {
    return {
      id: initialData?.id || "new-rule",
      name: name || "New Rule",
      description: description || "",
      condition,
      products,
      notificationChannels,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }, [name, description, condition, products, notificationChannels, initialData?.id, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <div className="grid gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <div>
            <Input
              label="Rule Name"
              placeholder="Low Stock Alert"
              {...form.register("name")}
              error={form.formState.errors.name?.message}
              info="Give your alert rule a descriptive name"
            />
          </div>

          <div>
            <Textarea
              label="Description"
              placeholder="Alert when stock level falls below threshold"
              {...form.register("description")}
              error={form.formState.errors.description?.message}
              info="Describe what this alert rule does"
            />
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Alert Condition</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Selector
                label="Condition Type"
                placeholder="Select condition type"
                value={form.watch("condition.type")}
                onChange={(value) =>
                  form.setValue("condition.type", value as any)
                }
                options={[
                  { value: "stock_level", label: "Stock Level" },
                  { value: "stock_value", label: "Stock Value" },
                  { value: "stock_age", label: "Stock Age" },
                  { value: "custom", label: "Custom" },
                ]}
                error={form.formState.errors.condition?.message}
              />
            </div>

            <div>
              <Selector
                label="Operator"
                placeholder="Select operator"
                value={form.watch("condition.operator")}
                onChange={(value) =>
                  form.setValue("condition.operator", value as any)
                }
                options={[
                  { value: "less_than", label: "Less Than" },
                  { value: "greater_than", label: "Greater Than" },
                  { value: "equals", label: "Equals" },
                  { value: "between", label: "Between" },
                ]}
                error={form.formState.errors.condition?.operator?.message}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Input
                type="number"
                label="Value"
                {...form.register("condition.value", {
                  valueAsNumber: true,
                })}
                error={form.formState.errors.condition?.value?.message}
              />
            </div>

            {form.watch("condition.operator") === "between" && (
              <div>
                <Input
                  type="number"
                  label="Second Value"
                  {...form.register("condition.value2", {
                    valueAsNumber: true,
                  })}
                  error={form.formState.errors.condition?.value2?.message}
                />
              </div>
            )}
          </div>
        </div>

        {/* Products */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Products</h3>
          <div>
            <Selector
              label="Apply To"
              placeholder="Select products to apply to"
              value={form.watch("products.type")}
              onChange={(value) => form.setValue("products.type", value as any)}
              options={[
                { value: "all", label: "All Products" },
                { value: "category", label: "Selected Categories" },
                { value: "specific", label: "Specific Products" },
              ]}
              error={form.formState.errors.products?.message}
            />
          </div>
        </div>

        {/* Notification Channels */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Channels</h3>
          <div>
            <label className="text-base">Channels</label>
            <p className="text-sm text-gray-500">
              Select the channels to receive alerts
            </p>
            <div className="grid gap-2 mt-2">
              {(
                [
                  "email",
                  "whatsapp",
                  "phone",
                  "slack",
                  "browser",
                ] as NotificationChannel[]
              ).map((channel) => (
                <div key={channel} className="flex items-center gap-2">
                  <Checkbox
                    checked={form
                      .watch("notificationChannels")
                      ?.includes(channel)}
                    onCheckedChange={(checked) => {
                      const current = form.watch("notificationChannels") || [];
                      if (checked) {
                        form.setValue("notificationChannels", [
                          ...current,
                          channel,
                        ]);
                      } else {
                        form.setValue(
                          "notificationChannels",
                          current.filter((value) => value !== channel)
                        );
                      }
                    }}
                  />
                  <label className="font-normal">
                    {channel.charAt(0).toUpperCase() + channel.slice(1)}
                  </label>
                </div>
              ))}
            </div>
            {form.formState.errors.notificationChannels && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.notificationChannels.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <TestAlertRuleDialog
          rule={testRule}
          alertRuleId={initialData?.id || "new-rule"}
          conditionType={form.watch("condition.type")}
        >
          <Button type="button" variant="outline">
            Test Rule
          </Button>
        </TestAlertRuleDialog>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Rule"}
        </Button>
      </div>
    </form>
  );
}
