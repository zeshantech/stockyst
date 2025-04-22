"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  IconBell,
  IconCheck,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DialogComponent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/selector";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { TestAlertRuleDialog } from "./test-alert-rule-dialog";
import { Label } from "@/components/ui/label";
import { AlertRule } from "@/types/stock-alerts";
import { useStockAlerts } from "@/hooks/use-stock-alerts";

// Define the form schema
const alertRuleFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  conditionType: z.enum(["stock_level", "stock_value", "stock_age", "custom"]),
  conditionOperator: z.enum(["less_than", "greater_than", "equals", "between"]),
  conditionValue: z.string(),
  productsType: z.enum(["all", "category", "specific"]),
  productIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  notificationChannels: z.array(z.string()),
  severity: z.enum(["low", "medium", "high"]),
  isActive: z.boolean(),
});

// Define the form values type
type AlertRuleFormValues = z.infer<typeof alertRuleFormSchema>;

export function AlertRules() {
  const {
    alertRules = [],
    isLoadingRules,
    createAlertRule,
    updateAlertRule,
    deleteAlertRule,
    toggleAlertRuleStatus,
    testAlertRule,
    isCreatingAlertRule,
    isUpdatingAlertRule,
    isDeletingAlertRule,
    isTestingAlertRule,
  } = useStockAlerts();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = React.useState(false);
  const [editingRule, setEditingRule] = React.useState<AlertRule | null>(null);
  const [selectedRule, setSelectedRule] = React.useState<AlertRule | null>(
    null
  );

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AlertRuleFormValues>({
    resolver: zodResolver(alertRuleFormSchema),
    defaultValues: {
      name: "",
      description: "",
      conditionType: "stock_level",
      conditionOperator: "less_than",
      conditionValue: "10",
      productsType: "all",
      productIds: [],
      categoryIds: [],
      notificationChannels: ["browser"],
      severity: "medium",
      isActive: true,
    },
  });

  // Open the dialog for adding a new rule
  const handleAddRule = () => {
    reset({
      name: "",
      description: "",
      conditionType: "stock_level",
      conditionOperator: "less_than",
      conditionValue: "10",
      productsType: "all",
      productIds: [],
      categoryIds: [],
      notificationChannels: ["browser"],
      severity: "medium",
      isActive: true,
    });
    setEditingRule(null);
    setIsDialogOpen(true);
  };

  // Open the dialog for editing an existing rule
  const handleEditRule = (rule: AlertRule) => {
    reset({
      name: rule.name,
      description: rule.description || "",
      conditionType: rule.condition.type,
      conditionOperator: rule.condition.operator,
      conditionValue: rule.condition.value.toString(),
      productsType: rule.products.type,
      productIds: rule.products.ids || [],
      categoryIds: rule.products.categoryIds || [],
      notificationChannels: rule.notificationChannels,
      severity: "medium", // Placeholder since the AlertRule type doesn't have severity
      isActive: rule.isActive,
    });
    setEditingRule(rule);
    setIsDialogOpen(true);
  };

  // Handle form submission
  const onSubmit = (data: AlertRuleFormValues) => {
    const ruleData: Omit<AlertRule, "id" | "createdAt"> = {
      name: data.name,
      description: data.description || "",
      condition: {
        type: data.conditionType,
        operator: data.conditionOperator,
        value: Number(data.conditionValue),
      },
      products: {
        type: data.productsType,
        ...(data.productsType === "specific" ? { ids: data.productIds } : {}),
        ...(data.productsType === "category"
          ? { categoryIds: data.categoryIds }
          : {}),
      },
      notificationChannels: data.notificationChannels as any[],
      isActive: data.isActive,
    };

    if (editingRule) {
      // Update existing rule
      updateAlertRule({
        ...ruleData,
        id: editingRule.id,
        createdAt: editingRule.createdAt,
      });
    } else {
      // Add new rule
      createAlertRule(ruleData);
    }

    setIsDialogOpen(false);
  };

  // Handle rule deletion
  const handleDeleteRule = (ruleId: string) => {
    deleteAlertRule(ruleId);
  };

  // Handle rule status toggle
  const handleToggleActive = (ruleId: string, currentStatus: boolean) => {
    toggleAlertRuleStatus({ id: ruleId, isActive: !currentStatus });
  };

  // Open the test dialog for a rule
  const handleTestRule = (rule: AlertRule) => {
    setSelectedRule(rule);
    setIsTestDialogOpen(true);
    testAlertRule(rule.id);
  };

  // Render severity badge - using a placeholder implementation since the AlertRule type doesn't have severity
  const renderSeverityBadge = (rule: AlertRule) => {
    // This is a placeholder implementation based on rule condition
    if (
      rule.condition.type === "stock_level" &&
      rule.condition.operator === "equals" &&
      rule.condition.value === 0
    ) {
      return <Badge variant="error">High</Badge>;
    } else if (
      rule.condition.type === "stock_level" &&
      rule.condition.operator === "less_than"
    ) {
      return <Badge variant="warning">Medium</Badge>;
    } else {
      return <Badge variant="outline">Low</Badge>;
    }
  };

  // Render alert type text
  const getAlertTypeText = (rule: AlertRule) => {
    switch (rule.condition.type) {
      case "stock_level":
        return rule.condition.operator === "equals" &&
          rule.condition.value === 0
          ? "Out of Stock"
          : "Low Stock";
      case "stock_age":
        return "Aging Inventory";
      case "stock_value":
        return "Stock Value";
      case "custom":
        return "Custom";
      default:
        return "Unknown";
    }
  };

  // Watch the form values for conditional rendering
  const productsType = watch("productsType");

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Alert Rules</CardTitle>
            <CardDescription>
              Configure rules to trigger stock alerts
            </CardDescription>
          </div>
          <Button onClick={handleAddRule} disabled={isCreatingAlertRule}>
            <IconPlus className="mr-2 h-4 w-4" />
            Add Rule
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Condition</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Notifications</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingRules ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <span className="mt-2 text-muted-foreground">
                          Loading alert rules...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : alertRules.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <IconBell className="h-10 w-10 text-muted-foreground/40" />
                        <span className="mt-2 text-muted-foreground">
                          No alert rules configured
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={handleAddRule}
                        >
                          <IconPlus className="mr-2 h-4 w-4" />
                          Create Your First Rule
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  alertRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{rule.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {rule.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getAlertTypeText(rule)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {rule.condition.type}{" "}
                            <span className="font-medium">
                              {rule.condition.operator}
                            </span>{" "}
                            {rule.condition.value}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{renderSeverityBadge(rule)}</TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {rule.notificationChannels.map((channel, idx) => (
                            <div key={idx} className="flex items-center">
                              <IconCheck className="h-3 w-3 mr-1 text-green-500" />
                              {channel}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() =>
                            handleToggleActive(rule.id, rule.isActive)
                          }
                          disabled={isDeletingAlertRule}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleTestRule(rule)}
                            title="Test Rule"
                            disabled={isTestingAlertRule}
                          >
                            <IconBell className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditRule(rule)}
                            title="Edit Rule"
                            disabled={isUpdatingAlertRule}
                          >
                            <IconEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteRule(rule.id)}
                            title="Delete Rule"
                            disabled={isDeletingAlertRule}
                          >
                            <IconTrash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Rule Dialog */}
      <DialogComponent
        contentClassName="!max-w-3xl w-full h-[95vh] overflow-auto hide-scrollbar "
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingRule ? "Edit Alert Rule" : "Create Alert Rule"}
        description="Configure when and how alerts should be triggered"
        footer={
          <Button
            type="submit"
            form="alert-rule-form"
            disabled={isCreatingAlertRule || isUpdatingAlertRule}
          >
            {editingRule ? "Update Rule" : "Create Rule"}
          </Button>
        }
      >
        <form
          id="alert-rule-form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Input
              id="name"
              placeholder="E.g. Low Stock Alert"
              label="Rule Name"
              error={errors.name?.message}
              {...register("name")}
            />
          </div>

          <div className="space-y-2">
            <Textarea
              label="Description"
              id="description"
              placeholder="Brief description of this alert rule"
              {...register("description")}
              error={errors.description?.message}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Selector
                value={watch("conditionType")}
                onChange={(value) => setValue("conditionType", value as any)}
                options={[
                  { value: "stock_level", label: "Stock Level" },
                  { value: "stock_age", label: "Stock Age" },
                  { value: "stock_value", label: "Stock Value" },
                  { value: "custom", label: "Custom" },
                ]}
                label="Alert Type"
                error={errors.conditionType?.message}
                info="Select the type of alert rule to create"
              />
            </div>

            <div className="space-y-2">
              <Selector
                value={watch("severity")}
                onChange={(value) => setValue("severity", value as any)}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                ]}
                label="Severity"
                error={errors.severity?.message}
                info="Set the severity level of this alert"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="font-medium">Condition</Label>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Selector
                  value={watch("conditionOperator")}
                  onChange={(value) =>
                    setValue("conditionOperator", value as any)
                  }
                  options={[
                    { value: "less_than", label: "Less than" },
                    { value: "equals", label: "Equal to" },
                    { value: "greater_than", label: "Greater than" },
                    { value: "between", label: "Between" },
                  ]}
                  label="Condition Operator"
                  error={errors.conditionOperator?.message}
                  info="The comparison operator to use"
                />
              </div>

              <div className="space-y-2">
                <Input
                  id="conditionValue"
                  type="text"
                  placeholder="Value"
                  label="Condition Value"
                  error={errors.conditionValue?.message}
                  info="Value to compare against"
                  {...register("conditionValue")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="font-medium">Product Selection</Label>
            <div className="space-y-2">
              <Selector
                value={watch("productsType")}
                onChange={(value) => setValue("productsType", value as any)}
                options={[
                  { value: "all", label: "All Products" },
                  { value: "category", label: "Product Categories" },
                  { value: "specific", label: "Specific Products" },
                ]}
                label="Product Selection Type"
                error={errors.productsType?.message}
                info="Which products should this rule apply to"
              />
            </div>

            {productsType === "category" && (
              <div className="mt-2 border rounded-md p-3">
                <p className="text-sm text-muted-foreground mb-2">
                  Select product categories (placeholder - would be a
                  multi-select component)
                </p>
              </div>
            )}

            {productsType === "specific" && (
              <div className="mt-2 border rounded-md p-3">
                <p className="text-sm text-muted-foreground mb-2">
                  Select specific products (placeholder - would be a product
                  selector)
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label className="font-medium">Notification Channels</Label>
            <div className="space-y-4">
              <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <label
                    htmlFor="emailNotification"
                    className="text-base font-medium"
                  >
                    Email
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications
                  </p>
                </div>
                <Switch
                  id="emailNotification"
                  checked={watch("notificationChannels").includes("email")}
                  onCheckedChange={(checked) => {
                    const current = watch("notificationChannels");
                    if (checked) {
                      setValue("notificationChannels", [...current, "email"]);
                    } else {
                      setValue(
                        "notificationChannels",
                        current.filter((c) => c !== "email")
                      );
                    }
                  }}
                />
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="browserNotification" className="font-medium">
                    Browser Notification
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display in-app notifications
                  </p>
                </div>
                <Switch
                  id="browserNotification"
                  checked={watch("notificationChannels").includes("browser")}
                  onCheckedChange={(checked) => {
                    const current = watch("notificationChannels");
                    if (checked) {
                      setValue("notificationChannels", [...current, "browser"]);
                    } else {
                      setValue(
                        "notificationChannels",
                        current.filter((c) => c !== "browser")
                      );
                    }
                  }}
                />
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="slackNotification">Slack</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications to Slack
                  </p>
                </div>
                <Switch
                  id="slackNotification"
                  checked={watch("notificationChannels").includes("slack")}
                  onCheckedChange={(checked) => {
                    const current = watch("notificationChannels");
                    if (checked) {
                      setValue("notificationChannels", [...current, "slack"]);
                    } else {
                      setValue(
                        "notificationChannels",
                        current.filter((c) => c !== "slack")
                      );
                    }
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="font-medium">
                Active
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable this alert rule
              </p>
            </div>
            <Switch
              id="isActive"
              checked={watch("isActive")}
              onCheckedChange={(checked) => setValue("isActive", checked)}
            />
          </div>
        </form>
      </DialogComponent>

      {/* Test Rule Dialog */}
      {selectedRule && (
        <TestAlertRuleDialog
          rule={selectedRule}
          open={isTestDialogOpen}
          onOpenChange={setIsTestDialogOpen}
        />
      )}
    </>
  );
}
