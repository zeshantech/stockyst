"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IconBell } from "@tabler/icons-react";

import { Button, ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTestAlert } from "@/hooks/use-test-alert";
import { toast } from "sonner";
import { AlertRule } from "@/types/stock-alerts";

interface TestAlertRuleDialogProps {
  children?: React.ReactNode;
  rule: AlertRule;
  alertRuleId: string;
  conditionType: AlertRule["condition"]["type"];
}

// Form schema for test values
const testFormSchema = z.object({
  productId: z.string().min(1, { message: "Please select a product" }),
  testValue: z.string().min(1, { message: "Test value is required" }),
  notes: z.string().optional(),
});

type TestFormValues = z.infer<typeof testFormSchema>;

export function TestAlertRuleDialog({
  children,
  rule,
  alertRuleId,
  conditionType,
}: TestAlertRuleDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [testResult, setTestResult] = React.useState<
    "idle" | "triggered" | "not-triggered"
  >("idle");

  const { testAlert, isTestingAlert } = useTestAlert();

  const form = useForm<TestFormValues>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      productId: "",
      testValue: "",
      notes: "",
    },
  });

  // Reset form and test result when dialog opens/closes
  React.useEffect(() => {
    if (open) {
      form.reset();
      setTestResult("idle");
    }
  }, [open, form]);

  // Sample products for testing
  const sampleProducts = [
    { id: "1", name: "Laptop Pro X1", sku: "LP-X1-2024" },
    { id: "2", name: "Office Chair Ergo", sku: "OC-E-2024" },
    { id: "3", name: "Wireless Mouse", sku: "WM-2024" },
    { id: "4", name: "Desk Lamp", sku: "DL-2024" },
    { id: "5", name: "Coffee Maker", sku: "CM-2024" },
  ];

  // Test the rule with provided values
  const onSubmit = (data: TestFormValues) => {
    // Condition to test
    const condition = rule.condition;
    const testValue = parseFloat(data.testValue);

    let isTriggered = false;

    // Evaluate the condition based on the operator
    switch (condition.operator) {
      case "equals":
        isTriggered = testValue === condition.value;
        break;
      case "less_than":
        isTriggered = testValue < condition.value;
        break;
      case "greater_than":
        isTriggered = testValue > condition.value;
        break;
      case "between":
        if (condition.value2) {
          isTriggered =
            testValue >= condition.value && testValue <= condition.value2;
        }
        break;
      default:
        break;
    }

    // Set test result
    setTestResult(isTriggered ? "triggered" : "not-triggered");

    // Show test result message
    if (isTriggered) {
      toast.success("Alert rule would be triggered with these values");
    } else {
      toast.info("Alert rule would not be triggered with these values");
    }

    // Simulate API call to test the alert
    testAlert({
      ruleId: alertRuleId,
      productId: data.productId,
      value: data.testValue,
      notes: data.notes || "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" type="button">
            Test Rule
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Test Alert Rule: {rule?.name || "New Rule"}</DialogTitle>
          <DialogDescription>
            Test this alert rule by providing sample values
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="productId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Product</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a product" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sampleProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} ({product.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="testValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Test Value for{" "}
                    {conditionType === "stock_level"
                      ? "Stock Quantity"
                      : conditionType === "stock_value"
                      ? "Stock Value"
                      : conditionType === "stock_age"
                      ? "Days Until Expiry"
                      : "Custom Field"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder={`Enter a value to test`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Test Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes for this test"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {testResult !== "idle" && (
              <Alert
                variant={testResult === "triggered" ? "destructive" : "default"}
              >
                <IconBell className="h-4 w-4" />
                <AlertTitle>
                  {testResult === "triggered"
                    ? "Alert Would Trigger"
                    : "Alert Would Not Trigger"}
                </AlertTitle>
                <AlertDescription>
                  {testResult === "triggered"
                    ? "The current test values would trigger this alert rule."
                    : "The current test values would not trigger this alert rule."}
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
              <Button type="submit" disabled={isTestingAlert}>
                {isTestingAlert ? "Testing..." : "Test Rule"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
