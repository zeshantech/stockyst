import * as React from "react";
import {
  NotificationProps,
  NotificationType,
  NotificationPriority,
} from "@/components/ui/notification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconBell,
  IconInfoCircle,
  IconAlertTriangle,
  IconCircleCheck,
  IconExclamationCircle,
  IconDotsVertical,
  IconArrowUp,
} from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface NotificationTableProps {
  notifications: NotificationProps[];
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
}

export default function NotificationTable({
  notifications,
  markAsRead,
  dismissNotification,
}: NotificationTableProps): React.ReactElement {
  const router = useRouter();

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="hidden md:table-cell">Priority</TableHead>
            <TableHead className="w-[80px] text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.map((notification) => (
            <TableRow
              key={notification.id}
              className={cn(
                !notification.read && "bg-primary/5",
                notification.priority === "high" && "border-l-4 border-l-error",
                notification.priority === "medium" &&
                  "border-l-4 border-l-warning"
              )}
            >
              <TableCell>
                <Avatar className="h-9 w-9">
                  <AvatarFallback
                    className={cn(
                      notification.type === "info" &&
                        "bg-info-background text-info",
                      notification.type === "success" &&
                        "bg-success-background text-success",
                      notification.type === "warning" &&
                        "bg-warning-background text-warning",
                      notification.type === "error" &&
                        "bg-error-background text-error"
                    )}
                  >
                    <NotificationIcon type={notification.type} />
                  </AvatarFallback>
                </Avatar>
              </TableCell>

              <TableCell>
                <div className="flex items-start gap-2">
                  <div>
                    <div className="font-medium flex items-center">
                      {notification.title}
                      {!notification.read && (
                        <Badge className="bg-primary rounded-full h-2 w-2 p-0 ml-2" />
                      )}
                    </div>
                    {notification.description && (
                      <div className="text-sm text-muted-foreground line-clamp-1">
                        {notification.description}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>

              <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                {formatDistanceToNow(notification.createdAt, {
                  addSuffix: true,
                })}
              </TableCell>

              <TableCell className="hidden md:table-cell">
                <PriorityBadge priority={notification.priority} />
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <IconDotsVertical />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {!notification.read && (
                      <DropdownMenuItem
                        onClick={() => markAsRead(notification.id)}
                      >
                        Mark as read
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => dismissNotification(notification.id)}
                    >
                      Dismiss
                    </DropdownMenuItem>
                    {notification.link && (
                      <DropdownMenuItem
                        onClick={() => router.push(notification.link!)}
                      >
                        View
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Helper components to simplify main component

function NotificationIcon({
  type,
}: {
  type?: NotificationType;
}): React.ReactElement {
  switch (type) {
    case "info":
      return <IconInfoCircle className="size-4" />;
    case "success":
      return <IconCircleCheck className="size-4" />;
    case "warning":
      return <IconAlertTriangle className="size-4" />;
    case "error":
      return <IconExclamationCircle className="size-4" />;
    default:
      return <IconBell className="size-4" />;
  }
}

function PriorityBadge({
  priority,
}: {
  priority?: NotificationPriority;
}): React.ReactElement | null {
  if (!priority || priority === "low") return null;

  if (priority === "high") {
    return (
      <Badge variant="error">
        <IconArrowUp className="size-3.5 mr-1" />
        High
      </Badge>
    );
  }

  if (priority === "medium") {
    return (
      <Badge variant="warning">
        <IconArrowUp className="size-3.5 rotate-45 mr-1" />
        Medium
      </Badge>
    );
  }

  return null;
}
