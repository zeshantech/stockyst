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

// Sample alert rule data
interface AlertRule {
  id: string;
  name: string;
  description: string;
  type: "low-stock" | "out-of-stock" | "expiry" | "price-change";
  conditions: {
    field: string;
    operator: string;
    value: string | number;
  }[];
  severity: "low" | "medium" | "high";
  actions: {
    sendEmail: boolean;
    sendNotification: boolean;
    createTask: boolean;
  };
  isActive: boolean;
}

const sampleAlertRules: AlertRule[] = [
  {
    id: "1",
    name: "Low Stock Alert",
    description: "Alert when stock falls below reorder point",
    type: "low-stock",
    conditions: [
      {
        field: "quantity",
        operator: "<=",
        value: "reorderPoint",
      },
    ],
    severity: "medium",
    actions: {
      sendEmail: true,
      sendNotification: true,
      createTask: false,
    },
    isActive: true,
  },
  {
    id: "2",
    name: "Out of Stock Alert",
    description: "Alert when stock reaches zero",
    type: "out-of-stock",
    conditions: [
      {
        field: "quantity",
        operator: "==",
        value: 0,
      },
    ],
    severity: "high",
    actions: {
      sendEmail: true,
      sendNotification: true,
      createTask: true,
    },
    isActive: true,
  },
  {
    id: "3",
    name: "Expiry Alert",
    description: "Alert when products are nearing expiry",
    type: "expiry",
    conditions: [
      {
        field: "daysToExpiry",
        operator: "<=",
        value: 30,
      },
    ],
    severity: "medium",
    actions: {
      sendEmail: true,
      sendNotification: true,
      createTask: false,
    },
    isActive: true,
  },
];

// Define the form schema
const alertRuleFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  type: z.enum(["low-stock", "out-of-stock", "expiry", "price-change"]),
  conditionField: z.string(),
  conditionOperator: z.string(),
  conditionValue: z.string(),
  severity: z.enum(["low", "medium", "high"]),
  sendEmail: z.boolean(),
  sendNotification: z.boolean(),
  createTask: z.boolean(),
  isActive: z.boolean(),
});

// Define the form values type
type AlertRuleFormValues = z.infer<typeof alertRuleFormSchema>;

export function AlertRules() {
  const [alertRules, setAlertRules] =
    React.useState<AlertRule[]>(sampleAlertRules);
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
      type: "low-stock",
      conditionField: "quantity",
      conditionOperator: "<=",
      conditionValue: "reorderPoint",
      severity: "medium",
      sendEmail: false,
      sendNotification: true,
      createTask: false,
      isActive: true,
    },
  });

  // Open the dialog for adding a new rule
  const handleAddRule = () => {
    reset({
      name: "",
      description: "",
      type: "low-stock",
      conditionField: "quantity",
      conditionOperator: "<=",
      conditionValue: "reorderPoint",
      severity: "medium",
      sendEmail: false,
      sendNotification: true,
      createTask: false,
      isActive: true,
    });
    setEditingRule(null);
    setIsDialogOpen(true);
  };

  // Open the dialog for editing an existing rule
  const handleEditRule = (rule: AlertRule) => {
    reset({
      name: rule.name,
      description: rule.description,
      type: rule.type,
      conditionField: rule.conditions[0].field,
      conditionOperator: rule.conditions[0].operator,
      conditionValue: rule.conditions[0].value.toString(),
      severity: rule.severity,
      sendEmail: rule.actions.sendEmail,
      sendNotification: rule.actions.sendNotification,
      createTask: rule.actions.createTask,
      isActive: rule.isActive,
    });
    setEditingRule(rule);
    setIsDialogOpen(true);
  };

  // Handle form submission
  const onSubmit = (data: AlertRuleFormValues) => {
    const newRule: AlertRule = {
      id: editingRule ? editingRule.id : `rule-${Date.now()}`,
      name: data.name,
      description: data.description || "",
      type: data.type,
      conditions: [
        {
          field: data.conditionField,
          operator: data.conditionOperator,
          value: data.conditionValue,
        },
      ],
      severity: data.severity,
      actions: {
        sendEmail: data.sendEmail,
        sendNotification: data.sendNotification,
        createTask: data.createTask,
      },
      isActive: data.isActive,
    };

    if (editingRule) {
      // Update existing rule
      setAlertRules(
        alertRules.map((rule) => (rule.id === editingRule.id ? newRule : rule))
      );
      toast.success("Alert rule updated successfully");
    } else {
      // Add new rule
      setAlertRules([...alertRules, newRule]);
      toast.success("Alert rule created successfully");
    }

    setIsDialogOpen(false);
  };

  // Handle rule deletion
  const handleDeleteRule = (ruleId: string) => {
    setAlertRules(alertRules.filter((rule) => rule.id !== ruleId));
    toast.success("Alert rule deleted successfully");
  };

  // Handle rule status toggle
  const handleToggleActive = (ruleId: string) => {
    setAlertRules(
      alertRules.map((rule) =>
        rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
      )
    );
  };

  // Open the test dialog for a rule
  const handleTestRule = (rule: AlertRule) => {
    setSelectedRule(rule);
    setIsTestDialogOpen(true);
  };

  // Render severity badge
  const renderSeverityBadge = (severity: AlertRule["severity"]) => {
    switch (severity) {
      case "low":
        return <Badge variant="outline">Low</Badge>;
      case "medium":
        return <Badge variant="warning">Medium</Badge>;
      case "high":
        return <Badge variant="error">High</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Render alert type text
  const getAlertTypeText = (type: AlertRule["type"]) => {
    switch (type) {
      case "low-stock":
        return "Low Stock";
      case "out-of-stock":
        return "Out of Stock";
      case "expiry":
        return "Expiry";
      case "price-change":
        return "Price Change";
      default:
        return "Unknown";
    }
  };

  // Watch the conditionValue field to determine if it's "reorderPoint"
  const conditionValue = watch("conditionValue");

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
          <Button onClick={handleAddRule}>
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
                  <TableHead>Actions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Manage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alertRules.length === 0 ? (
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
                      <TableCell>{getAlertTypeText(rule.type)}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {rule.conditions.map((condition, index) => (
                            <div key={index}>
                              {condition.field}{" "}
                              <span className="font-medium">
                                {condition.operator}
                              </span>{" "}
                              {condition.value}
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {renderSeverityBadge(rule.severity)}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          {rule.actions.sendEmail && (
                            <div className="flex items-center">
                              <IconCheck className="h-3 w-3 mr-1 text-green-500" />
                              Email
                            </div>
                          )}
                          {rule.actions.sendNotification && (
                            <div className="flex items-center">
                              <IconCheck className="h-3 w-3 mr-1 text-green-500" />
                              Notification
                            </div>
                          )}
                          {rule.actions.createTask && (
                            <div className="flex items-center">
                              <IconCheck className="h-3 w-3 mr-1 text-green-500" />
                              Task
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={rule.isActive}
                          onCheckedChange={() => handleToggleActive(rule.id)}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleTestRule(rule)}
                            title="Test Rule"
                          >
                            <IconBell className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditRule(rule)}
                            title="Edit Rule"
                          >
                            <IconEdit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteRule(rule.id)}
                            title="Delete Rule"
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
          <Button type="submit" form="alert-rule-form">
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
                value={watch("type")}
                onChange={(value) => setValue("type", value as any)}
                options={[
                  { value: "low-stock", label: "Low Stock" },
                  { value: "out-of-stock", label: "Out of Stock" },
                  { value: "expiry", label: "Expiry" },
                  { value: "price-change", label: "Price Change" },
                ]}
                label="Alert Type"
                error={errors.type?.message}
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
                  value={watch("conditionField")}
                  onChange={(value) => setValue("conditionField", value)}
                  options={[
                    { value: "quantity", label: "Quantity" },
                    { value: "price", label: "Price" },
                    { value: "daysToExpiry", label: "Days to Expiry" },
                  ]}
                  label="Condition Field"
                  error={errors.conditionField?.message}
                  info="Which field to check in the condition"
                />
              </div>

              <div className="space-y-2">
                <Selector
                  value={watch("conditionOperator")}
                  onChange={(value) => setValue("conditionOperator", value)}
                  options={[
                    { value: "<", label: "Less than" },
                    { value: "<=", label: "Less than or equal" },
                    { value: "==", label: "Equal to" },
                    { value: ">", label: "Greater than" },
                    { value: ">=", label: "Greater than or equal" },
                  ]}
                  label="Condition Operator"
                  error={errors.conditionOperator?.message}
                  info="The comparison operator to use"
                />
              </div>

              <div className="space-y-2">
                {conditionValue === "reorderPoint" ? (
                  <Selector
                    value={watch("conditionValue")}
                    onChange={(value) => setValue("conditionValue", value)}
                    options={[
                      { value: "reorderPoint", label: "Reorder Point" },
                      { value: "minimum", label: "Minimum" },
                    ]}
                    label="Condition Value"
                    error={errors.conditionValue?.message}
                    info="Value to compare against"
                  />
                ) : (
                  <Input
                    id="conditionValue"
                    type="text"
                    placeholder="Value"
                    label="Condition Value"
                    error={errors.conditionValue?.message}
                    info="Value to compare against"
                    {...register("conditionValue")}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="font-medium">Actions</Label>
            <div className="space-y-4">
              <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <label htmlFor="sendEmail" className="text-base font-medium">
                    Send Email
                  </label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications to configured recipients
                  </p>
                </div>
                <Switch
                  id="sendEmail"
                  checked={watch("sendEmail")}
                  onCheckedChange={(checked) => setValue("sendEmail", checked)}
                />
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="sendNotification" className="font-medium">
                    Send Notification
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display in-app notifications
                  </p>
                </div>
                <Switch
                  id="sendNotification"
                  checked={watch("sendNotification")}
                  onCheckedChange={(checked) =>
                    setValue("sendNotification", checked)
                  }
                />
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="createTask">Create Task</Label>
                  <p className="text-sm text-muted-foreground">
                    Create a task for staff to follow up
                  </p>
                </div>
                <Switch
                  id="createTask"
                  checked={watch("createTask")}
                  onCheckedChange={(checked) => setValue("createTask", checked)}
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
