"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  IconBrandStripe,
  IconBrandPaypal,
  IconBrandGoogle,
  IconBrandAmazon,
  IconBrandZapier,
  IconCheck,
  IconLink,
  IconRefresh,
  IconX,
  IconShoppingCartPin,
  IconShoppingCart,
  IconBrandShopee,
  IconBrandBooking,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface Integration {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected";
  lastSync?: string;
  description: string;
}

export function IntegrationSettings() {
  const [activeTab, setActiveTab] = useState("ecommerce");
  const [connecting, setConnecting] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);

  const ecommerceIntegrations: Integration[] = [
    {
      id: "shopify",
      name: "Shopify",
      icon: <IconBrandShopee className="h-8 w-8 text-[#7AB55C]" />,
      status: "connected",
      lastSync: "2023-06-15 14:30",
      description:
        "Sync products, orders, and inventory with your Shopify store.",
    },
    {
      id: "woocommerce",
      name: "WooCommerce",
      icon: <IconBrandAmazon className="h-8 w-8 text-[#7F54B3]" />,
      status: "disconnected",
      description:
        "Connect your WordPress WooCommerce store for seamless inventory management.",
    },
    {
      id: "amazon",
      name: "Amazon",
      icon: <IconBrandAmazon className="h-8 w-8 text-[#FF9900]" />,
      status: "disconnected",
      description: "Manage your Amazon marketplace inventory from InvenTree.",
    },
  ];

  const paymentIntegrations: Integration[] = [
    {
      id: "stripe",
      name: "Stripe",
      icon: <IconBrandStripe className="h-8 w-8 text-[#6772E5]" />,
      status: "connected",
      lastSync: "2023-06-18 09:15",
      description: "Process payments and manage subscriptions with Stripe.",
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <IconBrandPaypal className="h-8 w-8 text-[#00457C]" />,
      status: "disconnected",
      description: "Accept payments through PayPal for your orders.",
    },
  ];

  const accountingIntegrations: Integration[] = [
    {
      id: "quickbooks",
      name: "QuickBooks",
      icon: <IconBrandBooking className="h-8 w-8 text-[#2CA01C]" />,
      status: "connected",
      lastSync: "2023-06-17 16:45",
      description:
        "Sync invoices, purchases, and financial data with QuickBooks.",
    },
    {
      id: "xero",
      name: "Xero",
      icon: (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#13B5EA] text-white font-bold">
          X
        </div>
      ),
      status: "disconnected",
      description:
        "Connect your Xero accounting software for financial management.",
    },
  ];

  const otherIntegrations: Integration[] = [
    {
      id: "google",
      name: "Google Workspace",
      icon: <IconBrandGoogle className="h-8 w-8" />,
      status: "connected",
      lastSync: "2023-06-16 10:30",
      description: "Integrate with Google Sheets, Drive, and Calendar.",
    },
    {
      id: "zapier",
      name: "Zapier",
      icon: <IconBrandZapier className="h-8 w-8 text-[#FF4A00]" />,
      status: "connected",
      lastSync: "2023-06-14 11:20",
      description: "Connect with 3,000+ apps and automate your workflows.",
    },
  ];

  const getIntegrations = () => {
    switch (activeTab) {
      case "ecommerce":
        return ecommerceIntegrations;
      case "payment":
        return paymentIntegrations;
      case "accounting":
        return accountingIntegrations;
      case "other":
        return otherIntegrations;
      default:
        return [];
    }
  };

  const handleConnect = async (id: string) => {
    setConnecting(id);

    try {
      // In a real app, this would connect to the integration
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(`Successfully connected to ${id}`);

      // Update the integration status
      // In a real app, you would update the state based on the API response
    } catch (error) {
      toast.error(`Failed to connect to ${id}`);
      console.error(error);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (id: string) => {
    try {
      // In a real app, this would disconnect the integration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Successfully disconnected from ${id}`);

      // Update the integration status
      // In a real app, you would update the state based on the API response
    } catch (error) {
      toast.error(`Failed to disconnect from ${id}`);
      console.error(error);
    }
  };

  const handleSync = async (id: string) => {
    setSyncing(id);

    try {
      // In a real app, this would sync data with the integration
      await new Promise((resolve) => setTimeout(resolve, 3000));

      toast.success(`Successfully synced data with ${id}`);

      // Update the integration last sync time
      // In a real app, you would update the state based on the API response
    } catch (error) {
      toast.error(`Failed to sync data with ${id}`);
      console.error(error);
    } finally {
      setSyncing(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>External Integrations</CardTitle>
          <CardDescription>
            Connect InvenTree with your favorite services and platforms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="accounting">Accounting</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-6">
              {getIntegrations().map((integration) => (
                <div
                  key={integration.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted">
                      {integration.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{integration.name}</h3>
                        {integration.status === "connected" ? (
                          <Badge className="bg-green-100 text-green-800">
                            Connected
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground"
                          >
                            Disconnected
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {integration.description}
                      </p>
                      {integration.status === "connected" &&
                        integration.lastSync && (
                          <div className="text-xs text-muted-foreground mt-2">
                            Last synced: {integration.lastSync}
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    {integration.status === "connected" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSync(integration.id)}
                          disabled={syncing === integration.id}
                        >
                          {syncing === integration.id ? (
                            <>Syncing...</>
                          ) : (
                            <>
                              <IconRefresh className="mr-2 h-4 w-4" />
                              Sync
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(integration.id)}
                        >
                          <IconX className="mr-2 h-4 w-4" />
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => handleConnect(integration.id)}
                        disabled={connecting === integration.id}
                      >
                        {connecting === integration.id ? (
                          <>Connecting...</>
                        ) : (
                          <>
                            <IconLink className="mr-2 h-4 w-4" />
                            Connect
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Settings</CardTitle>
          <CardDescription>
            Configure global settings for all integrations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-md border">
            <div>
              <h3 className="font-medium">Automatic Sync</h3>
              <p className="text-sm text-muted-foreground">
                Automatically sync data with connected integrations on a
                schedule.
              </p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="space-y-3">
            <Label htmlFor="sync-frequency">Sync Frequency</Label>
            <Select defaultValue="hourly">
              <SelectTrigger id="sync-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15min">Every 15 minutes</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="manual">Manual only</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How often InvenTree should automatically sync with integrated
              platforms.
            </p>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-medium">Data Sharing Settings</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="share-products" className="flex-1">
                Share product data
              </Label>
              <Switch id="share-products" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="share-customers" className="flex-1">
                Share customer data
              </Label>
              <Switch id="share-customers" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="share-pricing" className="flex-1">
                Share pricing information
              </Label>
              <Switch id="share-pricing" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="share-analytics" className="flex-1">
                Share analytics data
              </Label>
              <Switch id="share-analytics" />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h3 className="font-medium">Conflict Resolution</h3>
            <Select defaultValue="newest">
              <SelectTrigger id="conflict-resolution">
                <SelectValue placeholder="Select conflict resolution strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Use newest data</SelectItem>
                <SelectItem value="inventree">InvenTree is master</SelectItem>
                <SelectItem value="external">
                  External system is master
                </SelectItem>
                <SelectItem value="ask">Ask me every time</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              How to resolve conflicts when the same data is updated in multiple
              systems.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Save Settings</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Integration Health</CardTitle>
          <CardDescription>
            Monitor the health and status of your active integrations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Shopify Integration</Label>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <Progress value={98} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>98% uptime</span>
                <span>Last issue: 12 days ago</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>QuickBooks Integration</Label>
                <Badge className="bg-yellow-100 text-yellow-800">
                  Degraded
                </Badge>
              </div>
              <Progress value={85} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>85% uptime</span>
                <span>Last issue: 2 hours ago</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Stripe Integration</Label>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <Progress value={100} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>100% uptime</span>
                <span>No issues detected</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Google Workspace Integration</Label>
                <Badge className="bg-green-100 text-green-800">Healthy</Badge>
              </div>
              <Progress value={95} className="h-2" />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>95% uptime</span>
                <span>Last issue: 5 days ago</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
