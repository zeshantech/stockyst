"use client";

import { useState } from "react";
import { ProfileSettings } from "./components/profile-settings";
import { SecuritySettings } from "./components/security-settings";
import { APISettings } from "./components/api-settings";
import { StoreSettings } from "./components/store-settings";
import { NotificationSettings } from "./components/notification-settings";
import { IntegrationSettings } from "./components/integration-settings";
import { BillingSettings } from "./components/billing-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconUser,
  IconLock,
  IconKey,
  IconBuildingStore,
  IconBell,
  IconPlugConnected,
  IconReceipt,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: IconUser,
      component: ProfileSettings,
    },
    {
      id: "security",
      label: "Security",
      icon: IconLock,
      component: SecuritySettings,
    },
    {
      id: "api",
      label: "API",
      icon: IconKey,
      component: APISettings,
    },
    {
      id: "stores",
      label: "Stores",
      icon: IconBuildingStore,
      component: StoreSettings,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: IconBell,
      component: NotificationSettings,
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: IconPlugConnected,
      component: IntegrationSettings,
    },
    {
      id: "billing",
      label: "Billing",
      icon: IconReceipt,
      component: BillingSettings,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account settings and preferences.
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="bg-muted p-1 h-auto gap-1 flex flex-wrap items-center">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-background rounded-md"
              >
                <tab.icon className="size-4" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="pt-4">
              <tab.component />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
