import React from "react";
import { useRouter } from "next/navigation";
import {
  IconEdit,
  IconTrash,
  IconEye,
  IconBox,
  IconSection,
} from "@tabler/icons-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ILocation } from "@/types/warehouse";
import { useDeleteLocation } from "@/hooks/use-warehousing";

// Icon mapping for location types
const LocationTypeIcon = ({ type }: { type: ILocation["type"] }) => {
  const iconMap: Record<ILocation["type"], React.ReactNode> = {
    aisle: <IconSection className="h-4 w-4" />,
    shelf: <IconSection className="h-4 w-4" />,
    bin: <IconBox className="h-4 w-4" />,
    zone: <IconSection className="h-4 w-4" />,
    section: <IconSection className="h-4 w-4" />,
  };

  return (
    <div className="mr-2 text-muted-foreground">
      {iconMap[type] || <IconBox className="h-4 w-4" />}
    </div>
  );
};

// Status badge component for locations
const LocationStatusBadge = ({ status }: { status: ILocation["status"] }) => {
  const statusMap: Record<
    ILocation["status"],
    {
      label: string;
      variant: "default" | "success" | "error" | "outline" | "secondary";
    }
  > = {
    active: { label: "Active", variant: "success" },
    inactive: { label: "Inactive", variant: "secondary" },
    maintenance: { label: "Maintenance", variant: "error" },
    reserved: { label: "Reserved", variant: "outline" },
  };

  const { label, variant } = statusMap[status] || {
    label: status,
    variant: "default",
  };

  return <Badge variant={variant}>{label}</Badge>;
};

// Location row actions
const LocationRowActions = ({
  location,
  onDelete,
}: {
  location: ILocation;
  onDelete: (id: string) => void;
}) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <IconEye className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => router.push(`/h/warehousing/locations/${location.id}`)}
        >
          <IconEye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.push(`/h/warehousing/locations/${location.id}/edit`)
          }
        >
          <IconEdit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(location.id)}>
          <IconTrash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Main locations table component
export function LocationsTable({
  data,
  warehouseId,
}: {
  data: ILocation[];
  warehouseId?: string;
}) {
  const router = useRouter();
  const { mutate: deleteLocation } = useDeleteLocation();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this location?")) {
      deleteLocation({ id });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Utilization</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No locations found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((location) => (
              <TableRow
                key={location.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() =>
                  router.push(`/h/warehousing/locations/${location.id}`)
                }
              >
                <TableCell>
                  <div className="flex items-center">
                    <LocationTypeIcon type={location.type} />
                    <span className="font-medium">{location.name}</span>
                  </div>
                </TableCell>
                <TableCell>{location.code}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {location.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <LocationStatusBadge status={location.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full max-w-24 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min(
                            100,
                            (location.utilization / location.capacity) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs">
                      {Math.round(
                        (location.utilization / location.capacity) * 100
                      )}
                      %
                    </span>
                  </div>
                </TableCell>
                <TableCell
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <LocationRowActions
                    location={location}
                    onDelete={handleDelete}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
