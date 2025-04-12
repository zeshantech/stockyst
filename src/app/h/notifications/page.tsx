"use client";

import * as React from "react";
import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconCheck,
  IconX,
  IconLayoutCards,
  IconLayoutList,
  IconPlus,
} from "@tabler/icons-react";
import { Selector } from "@/components/ui/selector";
import { SearchInput } from "@/components/ui/search-input";
import NotificationTable from "@/components/(private)/dashboard/notifications/notification-table";
import NotificationCards from "@/components/(private)/dashboard/notifications/notification-cards";
import EmptyNotifications from "@/components/(private)/dashboard/notifications/empty-notifications";
import { Settings } from "lucide-react";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    markAsRead,
    dismissNotification,
  } = useNotifications();

  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("all");
  const [priorityFilter, setPriorityFilter] = React.useState("all");
  const [view, setView] = React.useState<"grid" | "table">("grid");
  const [activeTab, setActiveTab] = React.useState("all");

  React.useEffect(() => {
    document.title = "Notifications | InvenTree";
  }, []);

  // Filter logic
  const filteredNotifications = React.useMemo(() => {
    return notifications
      .filter((notification) => {
        // Filter by tab
        if (activeTab === "unread" && notification.read) {
          return false;
        }

        // Filter by search
        if (searchTerm) {
          const lowercaseSearch = searchTerm.toLowerCase();
          const titleMatches = notification.title
            .toLowerCase()
            .includes(lowercaseSearch);
          const descriptionMatches = notification.description
            ? notification.description.toLowerCase().includes(lowercaseSearch)
            : false;

          if (!titleMatches && !descriptionMatches) {
            return false;
          }
        }

        // Filter by type
        if (typeFilter !== "all" && notification.type !== typeFilter) {
          return false;
        }

        // Filter by priority
        if (
          priorityFilter !== "all" &&
          notification.priority !== priorityFilter
        ) {
          return false;
        }

        return true;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [notifications, activeTab, searchTerm, typeFilter, priorityFilter]);

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setPriorityFilter("all");
  };

  // Check if filters are applied
  const hasFilters =
    searchTerm !== "" || typeFilter !== "all" || priorityFilter !== "all";

  return (
    <div className="flex flex-col p-6 gap-2">
      {/* Header */}

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-8">
          Notifications
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {unreadCount} unread
            </Badge>
          )}
        </h1>
        <Button href="/h/settings?tab=notifications">
          <Settings />
          Notification Settings
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        {/* Tabs and Filter Controls */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full max-w-md"
          >
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="all" className="flex-1">
                All Notifications
                <Badge variant="secondary" className="size-5 ml-2">
                  {notifications.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="unread" className="flex-1">
                Unread
                <Badge variant="secondary" className="size-5 ml-2">
                  {unreadCount}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 flex-wrap">
            <SearchInput
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search notifications..."
              className="md:w-60"
              onClear={() => setSearchTerm("")}
            />
            <Selector
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { label: "All Types", value: "all" },
                { label: "Information", value: "info" },
                { label: "Success", value: "success" },
                { label: "Warning", value: "warning" },
                { label: "Error", value: "error" },
              ]}
              placeholder="Type"
              containerClass="min-w-32"
            />
            <Selector
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                { label: "All Priority", value: "all" },
                { label: "High", value: "high" },
                { label: "Medium", value: "medium" },
                { label: "Low", value: "low" },
              ]}
              placeholder="Priority"
              containerClass="min-w-32"
            />
            {hasFilters && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <IconX className="h-4 w-4 mr-1" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {filteredNotifications.length} notification
            {filteredNotifications.length !== 1 ? "s" : ""}
            {filteredNotifications.length !== notifications.length &&
              ` (filtered from ${notifications.length})`}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <IconCheck className="mr-1" />
                Mark All Read
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setView(view === "grid" ? "table" : "grid")}
            >
              {view === "grid" ? (
                <>
                  <IconLayoutList className="mr-1" />
                  Table View
                </>
              ) : (
                <>
                  <IconLayoutCards className="mr-1" />
                  Card View
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 h-full mt-4">
        {filteredNotifications.length === 0 ? (
          <EmptyNotifications
            hasFilters={hasFilters}
            resetFilters={resetFilters}
            isUnread={activeTab === "unread"}
          />
        ) : view === "grid" ? (
          <NotificationCards
            notifications={filteredNotifications}
            markAsRead={markAsRead}
            dismissNotification={dismissNotification}
          />
        ) : (
          <NotificationTable
            notifications={filteredNotifications}
            markAsRead={markAsRead}
            dismissNotification={dismissNotification}
          />
        )}
      </div>
    </div>
  );
}
