import * as React from "react";
import { Button } from "@/components/ui/button";
import { IconBell, IconFilter } from "@tabler/icons-react";

interface EmptyNotificationsProps {
  hasFilters: boolean;
  resetFilters: () => void;
  isUnread?: boolean;
}

export default function EmptyNotifications({
  hasFilters,
  resetFilters,
  isUnread,
}: EmptyNotificationsProps): React.ReactElement {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="bg-muted/50 rounded-full p-6 mb-6">
        <IconBell className="h-12 w-12 text-muted-foreground/70" />
      </div>
      <h3 className="text-xl font-medium mb-2">No notifications found</h3>
      <p className="text-muted-foreground max-w-md">
        {hasFilters
          ? "No notifications match your current filters."
          : isUnread
          ? "You've read all your notifications."
          : "Your notification inbox is empty."}
      </p>
      {hasFilters && (
        <Button variant="outline" className="mt-6" onClick={resetFilters}>
          <IconFilter />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
