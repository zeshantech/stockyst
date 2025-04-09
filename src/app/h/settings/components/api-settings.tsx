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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  IconKey,
  IconCopy,
  IconRefresh,
  IconTrash,
  IconPlus,
  IconAlertCircle,
  IconInfoCircle,
  IconChevronDown,
} from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface APIKey {
  id: string;
  name: string;
  prefix: string;
  permission: "read" | "write" | "admin";
  createdAt: string;
  lastUsed: string | null;
  expiresAt: string | null;
}

export function APISettings() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [newKeyForm, setNewKeyForm] = useState({
    name: "",
    permission: "read" as "read" | "write" | "admin",
    expiresAt: "",
  });
  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: "key-1",
      name: "Production API Key",
      prefix: "inv_prod_",
      permission: "read",
      createdAt: "2023-05-15T10:30:00Z",
      lastUsed: "2023-06-10T14:22:00Z",
      expiresAt: null,
    },
    {
      id: "key-2",
      name: "Development API Key",
      prefix: "inv_dev_",
      permission: "write",
      createdAt: "2023-06-22T09:15:00Z",
      lastUsed: "2023-06-25T11:45:00Z",
      expiresAt: "2023-12-31T23:59:59Z",
    },
  ]);
  const [newKeyRevealed, setNewKeyRevealed] = useState<string | null>(null);
  const [apiDocExpanded, setApiDocExpanded] = useState(false);

  const generateNewKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // In a real implementation, we would call an API to generate a key
      // For now, we'll just simulate a delay and generate a mock key
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const keyPrefix =
        newKeyForm.permission === "admin"
          ? "inv_admin_"
          : newKeyForm.permission === "write"
          ? "inv_write_"
          : "inv_read_";

      // Generate a random key
      const randomBytes = new Array(24)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join("");
      const fullKey = `${keyPrefix}${randomBytes}`;

      // Create the new key object
      const newKey: APIKey = {
        id: `key-${Date.now()}`,
        name: newKeyForm.name,
        prefix: keyPrefix,
        permission: newKeyForm.permission,
        createdAt: new Date().toISOString(),
        lastUsed: null,
        expiresAt: newKeyForm.expiresAt
          ? new Date(newKeyForm.expiresAt).toISOString()
          : null,
      };

      // Add the new key to the list
      setApiKeys((prev) => [newKey, ...prev]);

      // Reset the form
      setNewKeyForm({
        name: "",
        permission: "read",
        expiresAt: "",
      });

      // Show the new key for copying
      setNewKeyRevealed(fullKey);

      // Show success message
      toast.success("API key generated successfully");

      // Close the form
      setIsCreatingKey(false);
    } catch (error) {
      toast.error("Failed to generate API key");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success("API key copied to clipboard");
  };

  const deleteKey = (id: string) => {
    setApiKeys((prev) => prev.filter((key) => key.id !== id));
    toast.success("API key deleted successfully");
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getPermissionColor = (permission: "read" | "write" | "admin") => {
    switch (permission) {
      case "read":
        return "bg-green-100 text-green-800";
      case "write":
        return "bg-blue-100 text-blue-800";
      case "admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle>API Keys</CardTitle>
            <CardDescription>
              Manage your API keys for programmatic access to the InvenTree
              platform.
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsCreatingKey(true)}
            disabled={isCreatingKey}
          >
            <IconPlus className="mr-2 h-4 w-4" />
            New API Key
          </Button>
        </CardHeader>
        <CardContent>
          {isCreatingKey && (
            <div className="mb-6 rounded-lg border p-4">
              <h3 className="text-lg font-medium mb-4">Generate New API Key</h3>
              <form onSubmit={generateNewKey} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">API Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g. Production API Key"
                    value={newKeyForm.name}
                    onChange={(e) =>
                      setNewKeyForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keyPermission">Permission Level</Label>
                  <Select
                    value={newKeyForm.permission}
                    onValueChange={(value: "read" | "write" | "admin") =>
                      setNewKeyForm((prev) => ({ ...prev, permission: value }))
                    }
                  >
                    <SelectTrigger id="keyPermission">
                      <SelectValue placeholder="Select permission level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="read">Read-only</SelectItem>
                      <SelectItem value="write">Read & Write</SelectItem>
                      <SelectItem value="admin">Full Access</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground mt-1">
                    {newKeyForm.permission === "read" &&
                      "Can only read data from the API"}
                    {newKeyForm.permission === "write" &&
                      "Can read and write data via the API"}
                    {newKeyForm.permission === "admin" &&
                      "Full access to all API endpoints"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keyExpiration">
                    Expiration Date (Optional)
                  </Label>
                  <Input
                    id="keyExpiration"
                    type="date"
                    value={newKeyForm.expiresAt}
                    onChange={(e) =>
                      setNewKeyForm((prev) => ({
                        ...prev,
                        expiresAt: e.target.value,
                      }))
                    }
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Leave blank for a non-expiring key
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreatingKey(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isGenerating || !newKeyForm.name}
                  >
                    {isGenerating ? "Generating..." : "Generate Key"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {newKeyRevealed && (
            <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <IconAlertCircle className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-yellow-800">
                    Your new API key
                  </h4>
                  <p className="text-sm text-yellow-700 mb-3">
                    Make sure to copy your API key now. You won't be able to see
                    it again!
                  </p>
                  <div className="flex items-center space-x-2">
                    <code className="px-3 py-2 rounded-md bg-white border border-yellow-200 text-sm font-mono flex-1 truncate">
                      {newKeyRevealed}
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyKey(newKeyRevealed)}
                    >
                      <IconCopy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setNewKeyRevealed(null)}
                >
                  I've saved my API key
                </Button>
              </div>
            </div>
          )}

          {apiKeys.length > 0 ? (
            <div className="rounded-md border">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_150px_150px_100px] text-sm font-medium p-3 bg-muted/50">
                <div>Name</div>
                <div className="hidden lg:block">Created</div>
                <div className="hidden lg:block">Last Used</div>
                <div className="text-right">Actions</div>
              </div>
              <Separator />
              {apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="p-3 flex flex-col lg:grid lg:grid-cols-[1fr_150px_150px_100px] gap-2 items-start lg:items-center border-b last:border-0"
                >
                  <div className="space-y-1 w-full">
                    <div className="font-medium">{key.name}</div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm text-muted-foreground font-mono">
                        {key.prefix}••••••••
                      </span>
                      <Badge
                        variant="outline"
                        className={getPermissionColor(key.permission)}
                      >
                        {key.permission === "read" && "Read-only"}
                        {key.permission === "write" && "Read & Write"}
                        {key.permission === "admin" && "Full Access"}
                      </Badge>
                      {key.expiresAt && (
                        <Badge
                          variant="outline"
                          className="bg-orange-100 text-orange-800"
                        >
                          Expires {formatDate(key.expiresAt)}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground lg:text-right lg:w-auto w-full">
                    <div className="lg:hidden font-medium text-xs mb-1">
                      Created:
                    </div>
                    {formatDate(key.createdAt)}
                  </div>
                  <div className="text-sm text-muted-foreground lg:text-right lg:w-auto w-full">
                    <div className="lg:hidden font-medium text-xs mb-1">
                      Last Used:
                    </div>
                    {formatDate(key.lastUsed)}
                  </div>
                  <div className="flex justify-end items-center space-x-2 lg:w-auto w-full">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteKey(key.id)}
                    >
                      <IconTrash className="h-4 w-4 text-red-500" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 px-4 border rounded-md bg-muted/20">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <IconKey className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-medium">No API keys yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Create an API key to start integrating with InvenTree.
              </p>
              <Button className="mt-4" onClick={() => setIsCreatingKey(true)}>
                Generate API Key
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Documentation</CardTitle>
          <CardDescription>
            Reference materials and guides for using the InvenTree API.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md border p-4 bg-primary/5">
            <div className="flex items-start space-x-3">
              <div className="mt-0.5">
                <IconInfoCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">API Base URL</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  All API requests should be sent to the following base URL:
                </p>
                <code className="mt-2 inline-block px-3 py-1 rounded-md bg-primary-foreground text-sm font-mono">
                  https://api.inventree.com/v1
                </code>
              </div>
            </div>
          </div>

          <Collapsible
            open={apiDocExpanded}
            onOpenChange={setApiDocExpanded}
            className="border rounded-md overflow-hidden"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex w-full items-center justify-between p-4"
              >
                <div className="flex items-center">
                  <div className="font-medium">Quick Start Guide</div>
                </div>
                <IconChevronDown
                  className={`h-4 w-4 transition-transform ${
                    apiDocExpanded ? "rotate-180" : ""
                  }`}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="border-t p-4 space-y-4">
              <h3 className="font-medium">Authentication</h3>
              <p className="text-sm text-muted-foreground">
                All API requests require authentication using an API key.
                Include your API key in the request headers:
              </p>
              <pre className="mt-2 bg-primary-foreground p-3 rounded-md overflow-x-auto text-xs font-mono">
                {`Authorization: Bearer YOUR_API_KEY
Content-Type: application/json`}
              </pre>

              <h3 className="font-medium mt-4">Example Request</h3>
              <p className="text-sm text-muted-foreground">
                Here's an example of how to fetch all products:
              </p>
              <pre className="mt-2 bg-primary-foreground p-3 rounded-md overflow-x-auto text-xs font-mono">
                {`curl -X GET "https://api.inventree.com/v1/products" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}
              </pre>

              <div className="pt-2">
                <Button variant="outline" size="sm">
                  View Full API Documentation
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">REST API</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Comprehensive RESTful API for inventory management.
                </p>
                <Button variant="link" className="p-0 h-auto mt-2">
                  View Documentation
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Webhooks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real-time event notifications for your integrations.
                </p>
                <Button variant="link" className="p-0 h-auto mt-2">
                  View Documentation
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Client SDKs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Libraries for Node.js, Python, PHP, and more.
                </p>
                <Button variant="link" className="p-0 h-auto mt-2">
                  View Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Usage & Rate Limits</CardTitle>
          <CardDescription>
            Monitor your API usage and manage rate limits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>API Requests (This Month)</Label>
                <span className="text-sm font-medium">12,450 / 50,000</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: "25%" }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                25% of your monthly limit used. Resets in 12 days.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Rate Limit (Requests per minute)</Label>
                <span className="text-sm font-medium">60</span>
              </div>
              <div className="flex items-center justify-between">
                <Label>Burst Limit (Requests per second)</Label>
                <span className="text-sm font-medium">10</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Upgrade API Limits</h3>
                <p className="text-sm text-muted-foreground">
                  Need higher limits? Upgrade your plan for increased API
                  capacity.
                </p>
              </div>
              <Button>View Plans</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
