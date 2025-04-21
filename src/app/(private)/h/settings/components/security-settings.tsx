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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  IconDeviceMobile,
  IconAlertCircle,
  IconChevronRight,
  IconShieldLock,
  IconBrandGoogle,
  IconFingerprint,
  IconHistory,
} from "@tabler/icons-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      // In a real implementation, we would update the password in Keycloak
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Clear the form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast.success("Password updated successfully");
    } catch (error) {
      toast.error("Failed to update password");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMfaToggle = async (checked: boolean) => {
    try {
      // In a real implementation, we would enable/disable MFA in Keycloak
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setMfaEnabled(checked);
      toast.success(
        checked
          ? "Two-factor authentication enabled"
          : "Two-factor authentication disabled"
      );
    } catch (error) {
      toast.error("Failed to update two-factor authentication settings");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account by enabling
            two-factor authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <IconDeviceMobile className="size-5 text-primary" />
              </div>
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-muted-foreground">
                  Secure your account with two-factor authentication
                </div>
              </div>
            </div>
            <Switch checked={mfaEnabled} onCheckedChange={handleMfaToggle} />
          </div>

          {mfaEnabled ? (
            <div className="rounded-lg border p-4 mt-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconShieldLock className="size-5 text-primary" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-medium">Authentication Methods</p>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between p-2 rounded-md border">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50">
                          <IconBrandGoogle className="size-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            Google Authenticator
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Active
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        Manage <IconChevronRight className="size-3" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-md border bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
                          <IconFingerprint className="size-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">
                            Biometric Authentication
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Not configured
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        Setup <IconChevronRight className="size-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Alert variant="error">
              <IconAlertCircle />
              <AlertTitle>Your account is at risk</AlertTitle>
              <AlertDescription>
                We strongly recommend enabling two-factor authentication to
                protect your account.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage and view your active login sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-background">
                  <IconHistory className="size-4 text-success" />
                </div>
                <div>
                  <div className="font-medium">Current Session</div>
                  <div className="text-xs text-muted-foreground">
                    Started 2 hours ago • Chrome on Windows
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <span className="inline-flex items-center rounded-full bg-success-background px-2.5 py-0.5 text-xs font-medium text-success">
                  Active
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success-background">
                  <IconHistory className="size-4 text-gray-600" />
                </div>
                <div>
                  <div className="font-medium">Mobile Session</div>
                  <div className="text-xs text-muted-foreground">
                    Started 1 day ago • Safari on iPhone
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" color="error">
                Revoke
              </Button>
            </div>
          </div>

          <div className="flex justify-end">
            <Button color="error">Revoke All Other Sessions</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Log</CardTitle>
          <CardDescription>
            Review recent security events for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-md border bg-muted/50">
              <div className="mt-0.5 text-muted-foreground">
                <IconShieldLock className="size-4" />
              </div>
              <div>
                <div className="font-medium text-sm">Password changed</div>
                <div className="text-xs text-muted-foreground mt-1">
                  2 weeks ago • Chrome on Windows
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-md border bg-muted/50">
              <div className="mt-0.5 text-muted-foreground">
                <IconDeviceMobile className="size-4" />
              </div>
              <div>
                <div className="font-medium text-sm">New device logged in</div>
                <div className="text-xs text-muted-foreground mt-1">
                  1 month ago • Safari on iPhone (New York, USA)
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-md border bg-muted/50">
              <div className="mt-0.5 text-muted-foreground">
                <IconShieldLock className="size-4" />
              </div>
              <div>
                <div className="font-medium text-sm">
                  Two-factor authentication enabled
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  1 month ago • Chrome on Windows
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <Button variant="outline" size="sm">
              View Full Security Log
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
