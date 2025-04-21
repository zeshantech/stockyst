import React from "react";
import {
  IconBuildingWarehouse,
  IconMapPin,
  IconUser,
  IconPhone,
  IconMail,
  IconBox,
} from "@tabler/icons-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { IWarehouse } from "@/types/warehouse";

export function WarehouseDetailCard({
  warehouse,
  isLoading,
}: {
  warehouse?: IWarehouse;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-1/2" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!warehouse) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Warehouse Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested warehouse could not be found.</p>
        </CardContent>
      </Card>
    );
  }

  const statusVariant: Record<
    IWarehouse["status"],
    "success" | "secondary" | "error"
  > = {
    active: "success",
    inactive: "secondary",
    maintenance: "error",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IconBuildingWarehouse className="h-6 w-6 text-primary" />
            <CardTitle>{warehouse.name}</CardTitle>
            {warehouse.isDefault && <Badge variant="outline">Default</Badge>}
          </div>
          <Badge variant={statusVariant[warehouse.status] || "default"}>
            {warehouse.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Code</p>
          <p>{warehouse.code}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Description
          </p>
          <p>{warehouse.description}</p>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Address</p>
          <div className="flex items-start gap-2">
            <IconMapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
            <p>
              {warehouse.address}, {warehouse.city}, {warehouse.state},{" "}
              {warehouse.zipCode}, {warehouse.country}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Manager</p>
            <div className="flex items-center gap-2">
              <IconUser className="h-4 w-4 text-muted-foreground" />
              <p>{warehouse.manager}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Contact</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <IconPhone className="h-4 w-4 text-muted-foreground" />
                <p>{warehouse.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <IconMail className="h-4 w-4 text-muted-foreground" />
                <p>{warehouse.email}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-muted-foreground">Capacity</p>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <IconBox className="h-4 w-4 text-muted-foreground" />
                <p>
                  {warehouse.utilization} / {warehouse.capacity} units
                </p>
              </div>
              <p className="text-sm font-medium">
                {Math.round((warehouse.utilization / warehouse.capacity) * 100)}
                % utilized
              </p>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${Math.min(
                    100,
                    (warehouse.utilization / warehouse.capacity) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
