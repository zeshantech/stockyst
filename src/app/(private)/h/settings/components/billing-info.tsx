"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconEdit } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscription } from "@/hooks/use-subscription";

export function BillingInfo() {
  const [isEditingBilling, setIsEditingBilling] = useState(false);
  const {
    billingInfo,
    isLoadingBillingInfo,
    updateBillingInfo,
    isUpdatingBillingInfo,
  } = useSubscription();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  // Initialize the form when billing info is loaded
  useEffect(() => {
    if (billingInfo) {
      setFormData({
        name: billingInfo.name || "",
        email: billingInfo.email || "",
        address: billingInfo.address || "",
        city: billingInfo.city || "",
        state: billingInfo.state || "",
        zipCode: billingInfo.zipCode || "",
        country: billingInfo.country || "",
      });
    }
  }, [billingInfo]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id.replace("billing", "").toLowerCase()]: value,
    }));
  };

  const handleBillingInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateBillingInfo(formData);
    setIsEditingBilling(false);
  };

  if (isLoadingBillingInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Update your billing information for invoices.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>
            Update your billing information for invoices.
          </CardDescription>
        </div>
        {!isEditingBilling && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditingBilling(true)}
          >
            <IconEdit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditingBilling ? (
          <form onSubmit={handleBillingInfoSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="billingName">Business Name</Label>
              <Input
                id="billingName"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingEmail">Billing Email</Label>
              <Input
                id="billingEmail"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingAddress">Address</Label>
              <Input
                id="billingAddress"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingCity">City</Label>
                <Input
                  id="billingCity"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingState">State</Label>
                <Input
                  id="billingState"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingZipCode">ZIP Code</Label>
                <Input
                  id="billingZipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingCountry">Country</Label>
                <Input
                  id="billingCountry"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditingBilling(false)}
                disabled={isUpdatingBillingInfo}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingBillingInfo}>
                {isUpdatingBillingInfo ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-2 p-4 border rounded-md bg-muted/20">
            <div className="font-medium">{billingInfo?.name}</div>
            <div className="text-sm text-muted-foreground">
              {billingInfo?.email}
            </div>
            <div className="text-sm text-muted-foreground">
              {billingInfo?.address}
              <br />
              {billingInfo?.city}, {billingInfo?.state} {billingInfo?.zipCode}
              <br />
              {billingInfo?.country}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
