"use client";

import * as React from "react";
import {
  IconMail,
  IconBrandWhatsapp,
  IconPhone,
  IconBrandSlack,
  IconBrowser,
} from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NotificationPreference } from "@/types/stock-alerts";

interface NotificationPreferencesProps {
  preferences: NotificationPreference[];
  onUpdate: (preferences: NotificationPreference[]) => void;
}

const channelIcons = {
  email: IconMail,
  whatsapp: IconBrandWhatsapp,
  phone: IconPhone,
  slack: IconBrandSlack,
  browser: IconBrowser,
};

const channelLabels = {
  email: "Email",
  whatsapp: "WhatsApp",
  phone: "Phone",
  slack: "Slack",
  browser: "Browser",
};

const channelDescriptions = {
  email: "Receive alerts via email",
  whatsapp: "Get notifications on WhatsApp",
  phone: "Receive SMS alerts",
  slack: "Get alerts in your Slack workspace",
  browser: "Browser notifications",
};

export function NotificationPreferences({
  preferences,
  onUpdate,
}: NotificationPreferencesProps) {
  const handleToggle = (channel: string) => {
    const updated = preferences.map((pref) =>
      pref.channel === channel ? { ...pref, isEnabled: !pref.isEnabled } : pref
    );
    onUpdate(updated);
  };

  const handleDetailChange = (
    channel: string,
    field: string,
    value: string
  ) => {
    const updated = preferences.map((pref) =>
      pref.channel === channel
        ? {
            ...pref,
            details: { ...pref.details, [field]: value },
          }
        : pref
    );
    onUpdate(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Configure how you want to receive stock alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {preferences.map((preference) => {
          const Icon = channelIcons[preference.channel];
          return (
            <div
              key={preference.channel}
              className="flex flex-col gap-4 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="size-5 text-muted-foreground" />
                  <div>
                    <Label className="text-base">
                      {channelLabels[preference.channel]}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {channelDescriptions[preference.channel]}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={preference.isEnabled}
                  onCheckedChange={() => handleToggle(preference.channel)}
                />
              </div>

              {preference.isEnabled && (
                <div className="space-y-3 pl-8">
                  {preference.channel === "email" && (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={preference.details?.email || ""}
                        onChange={(e) =>
                          handleDetailChange(
                            preference.channel,
                            "email",
                            e.target.value
                          )
                        }
                        placeholder="your@email.com"
                      />
                    </div>
                  )}

                  {preference.channel === "whatsapp" && (
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">Phone Number</Label>
                      <Input
                        id="whatsapp"
                        type="tel"
                        value={preference.details?.whatsappNumber || ""}
                        onChange={(e) =>
                          handleDetailChange(
                            preference.channel,
                            "whatsappNumber",
                            e.target.value
                          )
                        }
                        placeholder="+1234567890"
                      />
                    </div>
                  )}

                  {preference.channel === "phone" && (
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={preference.details?.phone || ""}
                        onChange={(e) =>
                          handleDetailChange(
                            preference.channel,
                            "phone",
                            e.target.value
                          )
                        }
                        placeholder="+1234567890"
                      />
                    </div>
                  )}

                  {preference.channel === "slack" && (
                    <div className="space-y-2">
                      <Label htmlFor="slack">Webhook URL</Label>
                      <Input
                        id="slack"
                        type="url"
                        value={preference.details?.slackWebhook || ""}
                        onChange={(e) =>
                          handleDetailChange(
                            preference.channel,
                            "slackWebhook",
                            e.target.value
                          )
                        }
                        placeholder="https://hooks.slack.com/services/..."
                      />
                    </div>
                  )}

                  {preference.channel === "browser" && (
                    <div className="text-sm text-muted-foreground">
                      Browser notifications will be sent to your current
                      browser. Make sure notifications are enabled in your
                      browser settings.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
