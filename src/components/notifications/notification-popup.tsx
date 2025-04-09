"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCircle2,
  Clock,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

type NotificationType = "info" | "success" | "warning" | "error";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: NotificationType;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Stock Alert",
    message: "Resistor 10k is running low on stock.",
    time: "10 minutes ago",
    read: false,
    type: "warning",
  },
  {
    id: "2",
    title: "Order Received",
    message: "New order #45621 has been received.",
    time: "25 minutes ago",
    read: false,
    type: "info",
  },
  {
    id: "3",
    title: "Item Restocked",
    message: "Transistor BC547 has been restocked.",
    time: "1 hour ago",
    read: true,
    type: "success",
  },
  {
    id: "4",
    title: "System Update",
    message: "System will undergo maintenance tonight at 2 AM.",
    time: "3 hours ago",
    read: true,
    type: "info",
  },
];

export function NotificationPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Calculate unread notifications
    setUnreadCount(notifications.filter((n) => !n.read).length);

    // Listen for toggle event
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener("toggle-notifications", handleToggle);

    return () => {
      window.removeEventListener("toggle-notifications", handleToggle);
    };
  }, [notifications]);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            className="relative w-full max-w-md rounded-xl bg-white shadow-lg dark:bg-gray-800 overflow-hidden"
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between border-b p-4 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all as read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-2">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    className={`mb-2 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      !notification.read ? "bg-primary/5" : ""
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 2 }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {getIconForType(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`font-medium ${
                              !notification.read ? "text-primary" : ""
                            }`}
                          >
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <p className="text-xs text-gray-400">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <div className="flex justify-end mt-1">
                            <span className="h-2 w-2 rounded-full bg-primary"></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Bell className="h-10 w-10 text-gray-300 mb-4" />
                  <h3 className="font-medium">No notifications</h3>
                  <p className="text-sm text-gray-500 max-w-xs mt-1">
                    When you receive notifications, they'll appear here.
                  </p>
                </div>
              )}
            </div>

            <div className="border-t p-3 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-primary text-sm"
              >
                View all notifications
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
