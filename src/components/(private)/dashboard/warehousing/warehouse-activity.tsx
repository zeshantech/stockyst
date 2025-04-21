import React from "react";
import {
  IconPackage,
  IconTruck,
  IconArrowRight,
  IconBox,
} from "@tabler/icons-react";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ITransfer, IReceiving, IPutaway } from "@/types/warehouse";

// Types of activity for the warehouse
type WarehouseActivity = {
  id: string;
  type: "transfer-in" | "transfer-out" | "receiving" | "putaway";
  title: string;
  status: string;
  timestamp: Date;
  badge: {
    label: string;
    variant: "success" | "default" | "outline" | "secondary" | "error";
  };
  icon: React.ReactNode;
};

// Generate activities from transfers, receiving and putaway operations
const generateActivities = (
  transfers: ITransfer[] = [],
  receiving: IReceiving[] = [],
  putaways: IPutaway[] = [],
  warehouseId: string
): WarehouseActivity[] => {
  const activities: WarehouseActivity[] = [];

  // Add transfer activities
  transfers.forEach((transfer) => {
    const isSource = transfer.sourceWarehouseId === warehouseId;
    const isDestination = transfer.destinationWarehouseId === warehouseId;

    if (isSource) {
      activities.push({
        id: `transfer-out-${transfer.id}`,
        type: "transfer-out",
        title: `Transfer to ${transfer.destinationWarehouseId}`,
        status: transfer.status,
        timestamp: transfer.initiatedAt,
        badge: {
          label: transfer.status,
          variant:
            transfer.status === "completed"
              ? "success"
              : transfer.status === "cancelled"
              ? "error"
              : transfer.status === "in-transit"
              ? "default"
              : "outline",
        },
        icon: <IconTruck className="h-4 w-4" />,
      });
    }

    if (isDestination) {
      activities.push({
        id: `transfer-in-${transfer.id}`,
        type: "transfer-in",
        title: `Transfer from ${transfer.sourceWarehouseId}`,
        status: transfer.status,
        timestamp: transfer.initiatedAt,
        badge: {
          label: transfer.status,
          variant:
            transfer.status === "completed"
              ? "success"
              : transfer.status === "cancelled"
              ? "error"
              : transfer.status === "in-transit"
              ? "default"
              : "outline",
        },
        icon: <IconArrowRight className="h-4 w-4" />,
      });
    }
  });

  // Add receiving activities
  receiving.forEach((rec) => {
    activities.push({
      id: `receiving-${rec.id}`,
      type: "receiving",
      title: `Received shipment ${rec.trackingNumber || ""}`,
      status: rec.status,
      timestamp: rec.receivedAt,
      badge: {
        label: rec.status,
        variant:
          rec.status === "completed"
            ? "success"
            : rec.status === "cancelled"
            ? "error"
            : rec.status === "partially-received"
            ? "secondary"
            : "outline",
      },
      icon: <IconPackage className="h-4 w-4" />,
    });
  });

  // Add putaway activities
  putaways.forEach((putaway) => {
    activities.push({
      id: `putaway-${putaway.id}`,
      type: "putaway",
      title: `Putaway operation`,
      status: putaway.status,
      timestamp: putaway.initiatedAt,
      badge: {
        label: putaway.status,
        variant:
          putaway.status === "completed"
            ? "success"
            : putaway.status === "in-progress"
            ? "secondary"
            : "outline",
      },
      icon: <IconBox className="h-4 w-4" />,
    });
  });

  // Sort by timestamp descending (newest first)
  return activities.sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
};

export function WarehouseActivity({
  transfers = [],
  receiving = [],
  putaways = [],
  warehouseId,
  isLoading,
}: {
  transfers?: ITransfer[];
  receiving?: IReceiving[];
  putaways?: IPutaway[];
  warehouseId: string;
  isLoading: boolean;
}) {
  const activities = generateActivities(
    transfers,
    receiving,
    putaways,
    warehouseId
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No recent activity found
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 rounded-lg border p-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{activity.title}</h4>
                    <Badge variant={activity.badge.variant}>
                      {activity.badge.label}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {format(activity.timestamp, "PPP 'at' p")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
