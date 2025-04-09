"use client";

import * as React from "react";
import { IconAlertCircle } from "@tabler/icons-react";

import { AlertRules } from "@/components/dashboard/stock/alert-rules";
import { NotificationPreferences } from "@/components/dashboard/stock/notification-preferences";
import { AlertRule, NotificationPreference } from "@/types/stock-alerts";

// Mock data - replace with actual API calls
const mockAlertRules: AlertRule[] = [
  {
    id: "1",
    name: "Low Stock Alert",
    description: "Alert when stock level falls below threshold",
    condition: {
      type: "stock_level",
      operator: "less_than",
      value: 10,
    },
    products: {
      type: "all",
    },
    notificationChannels: ["email", "browser"],
    isActive: true,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "High Value Alert",
    description: "Alert when stock value exceeds threshold",
    condition: {
      type: "stock_value",
      operator: "greater_than",
      value: 10000,
    },
    products: {
      type: "category",
      categoryIds: ["electronics"],
    },
    notificationChannels: ["email", "slack"],
    isActive: true,
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
];

const mockNotificationPreferences: NotificationPreference[] = [
  {
    channel: "email",
    isEnabled: true,
    details: {
      email: "user@example.com",
    },
  },
  {
    channel: "whatsapp",
    isEnabled: false,
    details: {
      whatsappNumber: "+1234567890",
    },
  },
  {
    channel: "phone",
    isEnabled: false,
    details: {
      phone: "+1234567890",
    },
  },
  {
    channel: "slack",
    isEnabled: true,
    details: {
      slackWebhook: "https://hooks.slack.com/services/...",
    },
  },
  {
    channel: "browser",
    isEnabled: true,
  },
];

export default function AlertSettingsPage() {
  const [notificationPreferences, setNotificationPreferences] = React.useState<
    NotificationPreference[]
  >(mockNotificationPreferences);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <IconAlertCircle className="size-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">Alert Settings</h1>
          <p className="text-muted-foreground">
            Configure your stock alert rules and notification preferences
          </p>
        </div>
      </div>

      {/* Notification Preferences */}
      <NotificationPreferences
        preferences={notificationPreferences}
        onUpdate={setNotificationPreferences}
      />

      {/* Alert Rules */}
      <AlertRules rules={mockAlertRules} />
    </div>
  );
}
