import * as React from "react";
import {
  NotificationProps,
  NotificationType,
  NotificationPriority,
} from "@/components/ui/notification";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconBell,
  IconInfoCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconExclamationCircle,
  IconCalendar,
  IconTrash,
  IconArrowUp,
} from "@tabler/icons-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface NotificationCardsProps {
  notifications: NotificationProps[];
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
}

export default function NotificationCards({
  notifications,
  markAsRead,
  dismissNotification,
}: NotificationCardsProps): React.ReactElement {
  // Group notifications by date
  const groups = React.useMemo(() => {
    const result: Record<string, NotificationProps[]> = {};

    notifications.forEach((notification) => {
      const date = new Date(notification.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupKey: string;

      if (date.toDateString() === today.toDateString()) {
        groupKey = "Today";
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = "Yesterday";
      } else {
        groupKey = format(date, "MMMM d, yyyy");
      }

      if (!result[groupKey]) {
        result[groupKey] = [];
      }

      result[groupKey].push(notification);
    });

    return result;
  }, [notifications]);

  return (
    <div className="space-y-8">
      {Object.entries(groups).map(([date, groupNotifications]) => (
        <div key={date}>
          <div className="flex items-center mb-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <IconCalendar className="size-4 text-muted-foreground" />
              {date}
            </div>
            <div className="h-px flex-1 bg-border ml-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                markAsRead={markAsRead}
                dismissNotification={dismissNotification}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Card component for individual notifications
interface NotificationCardProps {
  notification: NotificationProps;
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
}

function NotificationCard({
  notification,
  markAsRead,
  dismissNotification,
}: NotificationCardProps): React.ReactElement {
  // Determine border color based on priority
  const priorityBorder = getPriorityBorderClass(notification.priority);

  return (
    <div
      className={cn(
        "group rounded-lg border overflow-hidden transition-all hover:shadow-md",
        !notification.read && "bg-primary/5",
        priorityBorder
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "rounded-full p-2 flex-shrink-0",
              getTypeBackgroundClass(notification.type)
            )}
          >
            <NotificationIcon type={notification.type} />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-base">{notification.title}</h4>
              {!notification.read && (
                <Badge className="bg-primary rounded-full h-2 w-2 p-0 ml-2 mt-2" />
              )}
            </div>

            {notification.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {notification.description}
              </p>
            )}

            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span>
                {formatDistanceToNow(notification.createdAt, {
                  addSuffix: true,
                })}
              </span>
              <PriorityBadge priority={notification.priority} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex border-t">
        {notification.link && (
          <Button
            variant="ghost"
            href={notification.link}
            className="flex-1 text-xs rounded-none"
          >
            View
          </Button>
        )}

        {!notification.read && (
          <Button
            variant="ghost"
            className="flex-1 text-xs rounded-none"
            onClick={() => markAsRead(notification.id)}
          >
            Mark as read
          </Button>
        )}

        <Button
          variant="ghost"
          color="error"
          className="rounded-none"
          onClick={() => dismissNotification(notification.id)}
        >
          <IconTrash />
        </Button>
      </div>
    </div>
  );
}

// Helper functions for consistent styling
function NotificationIcon({
  type,
}: {
  type?: NotificationType;
}): React.ReactElement {
  switch (type) {
    case "info":
      return <IconInfoCircle className="size-4 text-info" />;
    case "success":
      return <IconCircleCheck className="size-4 text-success" />;
    case "warning":
      return <IconAlertTriangle className="size-4 text-warning" />;
    case "error":
      return <IconExclamationCircle className="size-4 text-error" />;
    default:
      return <IconBell className="size-4 text-primary" />;
  }
}

function PriorityBadge({
  priority,
}: {
  priority?: NotificationPriority;
}): React.ReactElement | null {
  if (!priority || priority === "low") return null;

  const variant = priority === "high" ? "error" : "warning";
  const label = priority === "high" ? "High" : "Medium";
  const rotation = priority === "high" ? "" : "rotate-45";

  return (
    <Badge variant={variant as any} className="text-xs">
      <IconArrowUp className={`size-3.5 mr-1 ${rotation}`} />
      {label}
    </Badge>
  );
}

function getTypeBackgroundClass(type?: NotificationType): string {
  switch (type) {
    case "info":
      return "bg-info-background";
    case "success":
      return "bg-success-background";
    case "warning":
      return "bg-warning-background";
    case "error":
      return "bg-error-background";
    default:
      return "bg-muted";
  }
}

function getPriorityBorderClass(priority?: NotificationPriority): string {
  switch (priority) {
    case "high":
      return "border-l-4 border-l-error";
    case "medium":
      return "border-l-4 border-l-warning";
    case "low":
      return "border-l-4 border-l-success";
    default:
      return "";
  }
}
