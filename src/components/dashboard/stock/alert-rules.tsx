"use client";

import * as React from "react";
import { IconAlertCircle, IconPlus, IconSettings } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AlertRule } from "@/types/stock-alerts";
import { useTestAlert } from "@/hooks/use-test-alert";

interface AlertRulesProps {
  rules: AlertRule[];
}

export function AlertRules({ rules }: AlertRulesProps) {
  const router = useRouter();
  const { testAlert } = useTestAlert();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Alert Rules</CardTitle>
            <CardDescription>
              Manage your stock alert rules and notification preferences
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/h/stock/alerts/settings")}
            >
              <IconSettings className="mr-2 size-4" />
              Notification Settings
            </Button>
            <Button
              size="sm"
              onClick={() => router.push("/h/stock/alerts/new")}
            >
              <IconPlus className="mr-2 size-4" />
              New Rule
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Channels</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.id}>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <IconAlertCircle className="size-4 text-yellow-500" />
                    <span>
                      {rule.condition.type === "stock_level" && "Stock Level"}
                      {rule.condition.type === "stock_value" && "Stock Value"}
                      {rule.condition.type === "stock_age" && "Stock Age"}
                      {rule.condition.type === "custom" && "Custom"}
                    </span>
                    <span className="text-muted-foreground">
                      {rule.condition.operator === "less_than" && "<"}
                      {rule.condition.operator === "greater_than" && ">"}
                      {rule.condition.operator === "equals" && "="}
                      {rule.condition.operator === "between" && "between"}
                    </span>
                    <span>{rule.condition.value}</span>
                    {rule.condition.value2 && (
                      <span>and {rule.condition.value2}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {rule.products.type === "all" && "All Products"}
                  {rule.products.type === "category" && "Selected Categories"}
                  {rule.products.type === "specific" && "Specific Products"}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {rule.notificationChannels.map((channel) => (
                      <Badge
                        key={channel}
                        variant="outline"
                        className="capitalize"
                      >
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={rule.isActive ? "default" : "secondary"}>
                    {rule.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <IconSettings />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() =>
                          router.push(`/h/stock/alerts/${rule.id}/edit`)
                        }
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          testAlert.mutate({ alertRuleId: rule.id })
                        }
                        disabled={testAlert.isPending}
                      >
                        {testAlert.isPending ? "Testing..." : "Test Alert"}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() =>
                          router.push(`/h/stock/alerts/${rule.id}/delete`)
                        }
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
