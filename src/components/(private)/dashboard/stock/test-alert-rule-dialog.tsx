"use client";

import * as React from "react";
import { IconAlertCircle, IconHelp } from "@tabler/icons-react";
import { useStockAlerts } from "@/hooks/use-stock-alerts";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TestAlertRuleDialogProps {
  alertRuleId: string;
  conditionType: string;
  children: React.ReactNode;
}

export function TestAlertRuleDialog({
  alertRuleId,
  conditionType,
  children,
}: TestAlertRuleDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [testValue, setTestValue] = React.useState("");
  const { createStockAlert } = useStockAlerts();

  const getParameterDescription = () => {
    switch (conditionType) {
      case "stock_level":
        return "Enter a stock level value to test if the alert would trigger";
      case "stock_value":
        return "Enter a monetary value to test if the alert would trigger";
      case "stock_age":
        return "Enter a number of days to test if the alert would trigger";
      default:
        return "Enter a value to test if the alert would trigger";
    }
  };

  const handleTest = async () => {
    try {
      // Create a test alert using the useStockAlerts hook
      await createStockAlert.mutateAsync({
        stockId: "test-stock",
        alertType: "low-stock",
        notes: `Test alert with value: ${testValue}`,
      });
    } catch (error) {
      console.error("Failed to test alert rule:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Test Alert Rule</DialogTitle>
          <DialogDescription>
            Test your alert rule with different values to see if it would
            trigger
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="test-value">Test Value</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <IconHelp className="size-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{getParameterDescription()}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="test-value"
              value={testValue}
              onChange={(e) => setTestValue(e.target.value)}
              placeholder="Enter a value to test"
            />
          </div>
          <Button
            onClick={handleTest}
            disabled={createStockAlert.isPending || !testValue}
            className="w-full"
          >
            {createStockAlert.isPending ? "Testing..." : "Test Alert Rule"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
