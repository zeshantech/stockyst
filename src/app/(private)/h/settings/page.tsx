"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProfileSettings } from "./components/profile-settings";
import { SecuritySettings } from "./components/security-settings";
import { APISettings } from "./components/api-settings";
import { StoreSettings } from "./components/store-settings";
import { NotificationSettings } from "./components/notification-settings";
import { IntegrationSettings } from "./components/integration-settings";
import { BillingSettings } from "./components/billing-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconUser, IconLock, IconKey, IconBuildingStore, IconBell, IconPlugConnected, IconReceipt } from "@tabler/icons-react";
import { useInitializeBillingStore } from "@/store/useBillingStore";

function SettingsContent() {
  useInitializeBillingStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabParam || "profile");

  useEffect(() => {
    if (tabParam && TABS.some((tab) => tab.id === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleOnTabChange = (value: string) => {
    setActiveTab(value);
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleOnTabChange}>
          <TabsList className="bg-muted p-1 h-auto gap-1 flex flex-wrap items-center w-full">
            {TABS.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                <tab.icon className="size-4" />
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {TABS.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <tab.component />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}

const TABS = [
  {
    id: "profile",
    label: "Profile",
    icon: IconUser,
    component: ProfileSettings,
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
