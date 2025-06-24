"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IconEdit } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { useBillingStore } from "@/store/useBillingStore";
import { IBillingInfo } from "@/types/plan";

export function BillingInfo() {
  const [isEditingBilling, setIsEditingBilling] = useState(false);

  const billingInfo = useBillingStore((state) => state.billingInfo);
  const isLoadingBillingInfo = useBillingStore((state) => state.isLoadingBillingInfo);
  const updateBillingInfo = useBillingStore((state) => state.updateBillingInfo);
  const isUpdateBillingInfoPending = useBillingStore((state) => state.isUpdateBillingInfoPending);

  const { register, handleSubmit } = useForm<IBillingInfo>({
    defaultValues: {
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  useEffect(() => {
    if (billingInfo) {
      register("name", { value: billingInfo.name || "" });
      register("email", { value: billingInfo.email || "" });
      register("address", { value: billingInfo.address || "" });
      register("city", { value: billingInfo.city || "" });
      register("state", { value: billingInfo.state || "" });
      register("zipCode", { value: billingInfo.zipCode || "" });
      register("country", { value: billingInfo.country || "" });
    }
  }, [billingInfo]);

  if (isLoadingBillingInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>Update your billing information for invoices.</CardDescription>
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
          <CardDescription>Update your billing information for invoices.</CardDescription>
        </div>
        {!isEditingBilling && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditingBilling(true)}>
            <IconEdit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isEditingBilling ? (
          <form onSubmit={handleSubmit(updateBillingInfo)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="billingName">Business Name</Label>
              <Input id="billingName" {...register("name")} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingEmail">Billing Email</Label>
              <Input id="billingEmail" type="email" {...register("email")} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingAddress">Address</Label>
              <Input id="billingAddress" {...register("address")} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingCity">City</Label>
                <Input id="billingCity" {...register("city")} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingState">State</Label>
                <Input id="billingState" {...register("state")} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingZipCode">ZIP Code</Label>
                <Input id="billingZipCode" {...register("zipCode")} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingCountry">Country</Label>
                <Input id="billingCountry" {...register("country")} required />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditingBilling(false)} disabled={isUpdateBillingInfoPending}>
                Cancel
              </Button>
              <Button type="submit" loading={isUpdateBillingInfoPending}>
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-2 p-4 border rounded-md bg-muted/20">
            <div className="font-medium">{billingInfo?.name}</div>
            <div className="text-sm text-muted-foreground">{billingInfo?.email}</div>
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
