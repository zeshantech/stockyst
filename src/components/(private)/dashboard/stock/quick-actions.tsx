import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  IconClipboardCheck,
  IconTransferIn,
  IconAdjustmentsHorizontal,
  IconCalendarStats,
  IconBarcode,
  IconExchange,
} from "@tabler/icons-react";

// Helper component for quick action buttons
const QuickActionButton = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <Button
    variant="outline"
    className="flex flex-col items-center h-auto py-4 gap-2"
    onClick={onClick}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </Button>
);

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <QuickActionButton
        icon={<IconClipboardCheck className="h-5 w-5" />}
        label="Stock Count"
        onClick={() => router.push("/h/stock/counts")}
      />
      <QuickActionButton
        icon={<IconTransferIn className="h-5 w-5" />}
        label="Stock Transfer"
        onClick={() => router.push("/h/stock/transfers")}
      />
      <QuickActionButton
        icon={<IconAdjustmentsHorizontal className="h-5 w-5" />}
        label="Adjustments"
        onClick={() => router.push("/h/stock/adjustments")}
      />
      <QuickActionButton
        icon={<IconCalendarStats className="h-5 w-5" />}
        label="Expiry Tracking"
        onClick={() => router.push("/h/stock/expiry-tracking")}
      />
      <QuickActionButton
        icon={<IconBarcode className="h-5 w-5" />}
        label="Batch Tracking"
        onClick={() => router.push("/h/stock/batch-tracking")}
      />
      <QuickActionButton
        icon={<IconExchange className="h-5 w-5" />}
        label="Stock Levels"
        onClick={() => router.push("/h/stock/levels")}
      />
    </div>
  );
}
