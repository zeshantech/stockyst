import { useState, useEffect } from "react";
import { NotificationProps } from "@/components/ui/notification";
import { INotification } from "@/types/notification";

// Mock data for notifications
const MOCK_NOTIFICATIONS: INotification[] = [
  {
    id: "n1",
    title: "Low stock alert",
    description:
      "Product 'Resistor 10k' is running low on stock. Consider restocking.",
    read: false,
    priority: "high",
    type: "warning",
    link: "/order",
    createdAt: new Date(Date.now() - 1000 * 60 * 15) // 15 minutes ago
  },
  {
    id: "n2",
    title: "New order received",
    description: "Order #12345 has been placed and is awaiting processing.",
    read: false,
    priority: "medium",
    type: "info",
    link: "/orders/12345",
    createdAt: new Date(Date.now() - 1000 * 60 * 45) // 45 minutes ago
  },
  {
    id: "n3",
    title: "Shipment delivered",
    description: "Order #10982 has been delivered to the customer.",
    read: true,
    priority: "low",
    type: "success",
    link: "/orders/10982",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3) // 3 hours ago
  },
  {
    id: "n4",
    title: "Payment received",
    description: "Payment for order #11546 has been processed successfully.",
    read: true,
    priority: "low",
    type: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5) // 5 hours ago
  },
  {
    id: "n5",
    title: "System update scheduled",
    description: "The system will undergo maintenance on Sunday at 2:00 AM.",
    read: true,
    priority: "medium",
    type: "info",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  },
];

export function useNotifications() {
  const [notifications, setNotifications] =
    useState<INotification[]>(MOCK_NOTIFICATIONS);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread count whenever notifications change
  useEffect(() => {
    setUnreadCount(
      notifications.filter((notification) => !notification.read).length
    );
  }, [notifications]);

  // Mark a single notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Dismiss (remove) a notification
  const dismissNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  // Add a new notification
  const addNotification = (notification: Omit<INotification, "id">) => {
    const newNotification: INotification = {
      ...notification,
      id: `n${Date.now()}`,
      createdAt: notification.createdAt || new Date(),
      read: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    addNotification,
  };
}
