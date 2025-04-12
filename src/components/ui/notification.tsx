import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import {
  IconBell,
  IconCheck,
  IconExclamationCircle,
  IconInfoCircle,
} from "@tabler/icons-react";
import { Button } from "./button";
import { formatDistanceToNow } from "date-fns";
import { INotification } from "@/types/notification";
import Link from "next/link";

export type NotificationPriority = "low" | "medium" | "high";
export type NotificationType = "info" | "warning" | "success" | "error";

export interface NotificationProps extends INotification {
  onDismiss?: () => void;
  onMarkAsRead?: () => void;
}

export function Notification({
  title,
  description,
  read = false,
  priority = "low",
  type = "info",
  image,
  createdAt,
  link,
  onDismiss,
  onMarkAsRead,
  className,
  ...props
}: NotificationProps & React.HTMLAttributes<HTMLDivElement>) {
  const priorityColors = {
    low: "",
    medium: "border-l-warning",
    high: "border-l-error",
  };

  const typeIcons = {
    info: <IconInfoCircle className="text-info" />,
    warning: <IconExclamationCircle className="text-warning" />,
    success: <IconCheck className="text-success" />,
    error: <IconExclamationCircle className="text-error" />,
  };

  const formattedTime = formatDistanceToNow(createdAt, { addSuffix: true });

  const NotificationContent = (
    <div
      className={cn(
        "flex gap-4 p-4 border-b last:border-b-0 transition-colors",
        !read && "bg-muted/30",
        priority !== "low" && "border-l-4",
        priorityColors[priority],
        link && "cursor-pointer hover:bg-muted/50",
        className
      )}
      {...props}
    >
      <Avatar className="h-10 w-10 flex-shrink-0">
        {image ? (
          <AvatarImage src={image} alt="" />
        ) : (
          <AvatarFallback>
            {typeIcons[type] || <IconBell className="size-5" />}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 space-y-1 overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="font-medium">{title}</div>
          <div className="flex items-center gap-2">
            {!read && <Badge className="h-2 w-2 rounded-full p-0 bg-primary" />}
            <div className="text-xs text-muted-foreground whitespace-nowrap">
              {formattedTime}
            </div>
          </div>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        {(onMarkAsRead || onDismiss) && (
          <div className="flex items-center justify-end pt-2">
            {onMarkAsRead && !read && (
              <Button
                variant="ghost"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead();
                }}
              >
                Mark as read
              </Button>
            )}

            {onDismiss && (
              <Button
                variant="ghost"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
              >
                Dismiss
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (link) {
    return <Link href={link}>{NotificationContent}</Link>;
  }

  return NotificationContent;
}
