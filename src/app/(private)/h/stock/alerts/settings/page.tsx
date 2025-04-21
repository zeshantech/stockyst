"use client";

import React from "react";
import { IconAlertCircle } from "@tabler/icons-react";

import { AlertRules } from "@/components/(private)/dashboard/stock/alert-rules";
import { NotificationPreferences } from "@/components/(private)/dashboard/stock/notification-preferences";
import { AlertRule, NotificationPreference } from "@/types/stock-alerts";

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
        <IconAlertCircle className="size-8 text-warning" />
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
      <AlertRules />
    </div>
  );
}
