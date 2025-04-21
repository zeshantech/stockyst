import React from "react";
import { useRouter } from "next/navigation";
import {
  IconEdit,
  IconTrash,
  IconEye,
  IconBuildingWarehouse,
  IconBoxSeam,
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
import { IWarehouse } from "@/types/warehouse";
import { useDeleteWarehouse } from "@/hooks/use-warehousing";

// Status badge component
const WarehouseStatusBadge = ({ status }: { status: IWarehouse["status"] }) => {
  const statusMap: Record<
    IWarehouse["status"],
    {
      label: string;
      variant: "default" | "success" | "error" | "outline" | "secondary";
    }
  > = {
    active: { label: "Active", variant: "success" },
    inactive: { label: "Inactive", variant: "secondary" },
    maintenance: { label: "Maintenance", variant: "error" },
  };

  const { label, variant } = statusMap[status] || {
    label: status,
    variant: "default",
  };

  return <Badge variant={variant}>{label}</Badge>;
};

// Warehouse row actions
const WarehouseRowActions = ({
  warehouse,
  onDelete,
}: {
  warehouse: IWarehouse;
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
          onClick={() => router.push(`/h/warehousing/${warehouse.id}`)}
        >
          <IconEye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/h/warehousing/${warehouse.id}/edit`)}
        >
          <IconEdit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onDelete(warehouse.id)}>
          <IconTrash className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Main warehouses table component
export function WarehousesTable({ data }: { data: IWarehouse[] }) {
  const router = useRouter();
  const { mutate: deleteWarehouse } = useDeleteWarehouse();

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this warehouse?")) {
      deleteWarehouse({ id });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Utilization</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No warehouses found.
              </TableCell>
            </TableRow>
          ) : (
            data.map((warehouse) => (
              <TableRow
                key={warehouse.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => router.push(`/h/warehousing/${warehouse.id}`)}
              >
                <TableCell>
                  <div className="flex items-center">
                    <IconBuildingWarehouse className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{warehouse.name}</span>
                    {warehouse.isDefault && (
                      <Badge className="ml-2" variant="outline">
                        Default
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{warehouse.code}</TableCell>
                <TableCell>
                  {warehouse.city}, {warehouse.state}
                </TableCell>
                <TableCell>
                  <WarehouseStatusBadge status={warehouse.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full max-w-24 rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min(
                            100,
                            (warehouse.utilization / warehouse.capacity) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs">
                      {Math.round(
                        (warehouse.utilization / warehouse.capacity) * 100
                      )}
                      %
                    </span>
                  </div>
                </TableCell>
                <TableCell>{warehouse.manager}</TableCell>
                <TableCell
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <WarehouseRowActions
                    warehouse={warehouse}
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
