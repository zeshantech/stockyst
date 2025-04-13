"use client";

import { useState } from "react";
import { Notification, NotificationProps } from "@/components/ui/notification";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconBell, IconCheck, IconEye } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/hooks/use-notifications";
import { useRouter } from "next/navigation";

export function NotificationPopup() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
  } = useNotifications();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const visibleNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter(
          (notification: NotificationProps) => !notification.read
        );

  const hasUnread = unreadCount > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="notification-button"
        >
          <IconBell />
          {hasUnread && (
            <Badge
              className={cn(
                "absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full p-0 text-xs",
                unreadCount > 9 ? "min-w-5" : ""
              )}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end" sideOffset={5}>
        <div className="flex items-center justify-between p-2 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {hasUnread && (
            <Button variant="ghost" size="sm" onClick={() => markAllAsRead()}>
              <IconCheck />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "all" | "unread")}
        >
          <TabsList className="w-full mb-2">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread
              {hasUnread && (
                <Badge variant="secondary" className="size-5 ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <ScrollArea className="h-[400px]">
          {visibleNotifications.length > 0 ? (
            visibleNotifications.map((notification: NotificationProps) => (
              <Notification
                key={notification.id}
                {...notification}
                onMarkAsRead={() => markAsRead(notification.id)}
                onDismiss={() => dismissNotification(notification.id)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-muted/50 rounded-full p-3 mb-3">
                <IconEye className="size-6 text-muted-foreground" />
              </div>
              <h4 className="font-medium">No notifications</h4>
              <p className="text-sm text-muted-foreground mt-1.5">
                {activeTab === "all"
                  ? "You don't have any notifications yet"
                  : "You've read all your notifications"}
              </p>
            </div>
          )}
        </ScrollArea>

        <Button
          variant="ghost"
          className="w-full border-t "
          onClick={() => {
            setOpen(false);
            router.push("/h/notifications");
          }}
        >
          View all notifications
        </Button>
      </PopoverContent>
    </Popover>
  );
}
