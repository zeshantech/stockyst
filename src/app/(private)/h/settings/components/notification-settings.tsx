"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  IconBellRinging,
  IconMail,
  IconDeviceMobile,
  IconBrandSlack,
  IconBrowserCheck,
  IconClock,
  IconRotate,
} from "@tabler/icons-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function NotificationSettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    browserNotifications: true,
    slackIntegration: false,

    // Email notification specific settings
    dailyDigest: true,
    inventoryAlerts: true,
    orderUpdates: true,
    productChanges: false,
    securityAlerts: true,

    // Real-time notification settings
    lowStockAlerts: true,
    newOrders: true,
    deliveryUpdates: true,
    priceChanges: false,
    systemUpdates: true,
  });

  const handleSettingChange = (setting: string, value: boolean) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);

    try {
      // In a real implementation, we would save settings to the backend
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Notification settings updated successfully");
    } catch (error) {
      toast.error("Failed to update notification settings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Methods</CardTitle>
          <CardDescription>
            Configure how you want to receive notifications from Stockyst.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-md border">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <IconMail className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Email Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive email notifications for important alerts and
                    updates.
                  </div>
                </div>
              </div>
              <Switch
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("emailNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-md border">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <IconBellRinging className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">In-App Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications within the Stockyst platform.
                  </div>
                </div>
              </div>
              <Switch checked={true} disabled />
            </div>

            <div className="flex items-center justify-between p-3 rounded-md border">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <IconDeviceMobile className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive push notifications on your mobile devices.
                  </div>
                </div>
              </div>
              <Switch
                checked={notificationSettings.pushNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("pushNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-md border">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <IconBrowserCheck className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Browser Notifications</div>
                  <div className="text-sm text-muted-foreground">
                    Receive desktop notifications when browser is open.
                  </div>
                </div>
              </div>
              <Switch
                checked={notificationSettings.browserNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("browserNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-md border">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                  <IconBrandSlack className="size-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Slack Integration</div>
                  <div className="text-sm text-muted-foreground">
                    Receive notifications in your Slack workspace.
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {notificationSettings.slackIntegration ? (
                  <Button variant="outline" size="sm" className="h-8">
                    Configure
                  </Button>
                ) : (
                  <Button size="sm" className="h-8">
                    Connect
                  </Button>
                )}
                <Switch
                  checked={notificationSettings.slackIntegration}
                  onCheckedChange={(checked) =>
                    handleSettingChange("slackIntegration", checked)
                  }
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="email" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="email">Email Notifications</TabsTrigger>
          <TabsTrigger value="realtime">Real-Time Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="email" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Notification Preferences</CardTitle>
              <CardDescription>
                Choose which email notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <div className="font-medium">Daily Digest</div>
                    <div className="text-sm text-muted-foreground">
                      Receive a daily summary of inventory activity.
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.dailyDigest}
                    onCheckedChange={(checked) =>
                      handleSettingChange("dailyDigest", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <div className="font-medium">Inventory Alerts</div>
                    <div className="text-sm text-muted-foreground">
                      Low stock, stockouts, and other inventory alerts.
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.inventoryAlerts}
                    onCheckedChange={(checked) =>
                      handleSettingChange("inventoryAlerts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <div className="font-medium">Order Updates</div>
                    <div className="text-sm text-muted-foreground">
                      Status changes for purchase and sales orders.
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.orderUpdates}
                    onCheckedChange={(checked) =>
                      handleSettingChange("orderUpdates", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <div className="font-medium">Product Changes</div>
                    <div className="text-sm text-muted-foreground">
                      Updates to product information and prices.
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.productChanges}
                    onCheckedChange={(checked) =>
                      handleSettingChange("productChanges", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div>
                    <div className="font-medium">Security Alerts</div>
                    <div className="text-sm text-muted-foreground">
                      Login attempts, password changes, and other security
                      events.
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.securityAlerts}
                    onCheckedChange={(checked) =>
                      handleSettingChange("securityAlerts", checked)
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="text-lg font-medium">
                  Email Delivery Options
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="digest-frequency">
                      Daily Digest Frequency
                    </Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="digest-frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="digest-time">Delivery Time</Label>
                    <Select defaultValue="morning">
                      <SelectTrigger id="digest-time">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8 AM)</SelectItem>
                        <SelectItem value="afternoon">
                          Afternoon (1 PM)
                        </SelectItem>
                        <SelectItem value="evening">Evening (6 PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-emails">
                    Additional Email Recipients
                  </Label>
                  <Input
                    id="additional-emails"
                    placeholder="john@example.com, jane@example.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Separate multiple email addresses with commas.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="realtime" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Alert Settings</CardTitle>
              <CardDescription>
                Configure which events trigger real-time notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100">
                      <IconBellRinging className="size-5 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium">Low Stock Alerts</div>
                      <div className="text-sm text-muted-foreground">
                        Receive alerts when stock levels fall below threshold.
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.lowStockAlerts}
                    onCheckedChange={(checked) =>
                      handleSettingChange("lowStockAlerts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100">
                      <IconRotate className="size-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">New Orders</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified when new orders are placed.
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.newOrders}
                    onCheckedChange={(checked) =>
                      handleSettingChange("newOrders", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100">
                      <IconClock className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Delivery Updates</div>
                      <div className="text-sm text-muted-foreground">
                        Get real-time updates on order deliveries.
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.deliveryUpdates}
                    onCheckedChange={(checked) =>
                      handleSettingChange("deliveryUpdates", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-100">
                      <IconRotate className="size-5 text-yellow-600" />
                    </div>
                    <div>
                      <div className="font-medium">Price Changes</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified when product prices change.
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.priceChanges}
                    onCheckedChange={(checked) =>
                      handleSettingChange("priceChanges", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-md border">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-100">
                      <IconRotate className="size-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">System Updates</div>
                      <div className="text-sm text-muted-foreground">
                        Get notified about system maintenance and updates.
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.systemUpdates}
                    onCheckedChange={(checked) =>
                      handleSettingChange("systemUpdates", checked)
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 bg-muted/20 rounded-md">
                <div>
                  <div className="font-medium">Do Not Disturb</div>
                  <div className="text-sm text-muted-foreground">
                    Set quiet hours when you won't receive any notifications.
                  </div>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Notification Settings"}
        </Button>
      </div>
    </div>
  );
}
