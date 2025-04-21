"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  IconCheck,
  IconClipboardCheck,
  IconClipboardList,
  IconPlus,
  IconSearch,
  IconTrash,
  IconX,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/ui/search-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { IStockCount } from "@/types/stock";
import { toast } from "sonner";

// Sample stock count data
const sampleStockCounts: IStockCount[] = [
  {
    id: "1",
    countNumber: "SC-001",
    status: "completed",
    scheduledDate: "2024-03-01",
    completedDate: "2024-03-02",
    locationId: "1",
    locationName: "Warehouse A",
    countedBy: "John Doe",
    notes: "Regular monthly count",
    items: [
      {
        id: "1",
        countId: "1",
        stockId: "1",
        productName: "Laptop Pro X1",
        sku: "LP-X1-2024",
        expectedQuantity: 45,
        actualQuantity: 44,
        discrepancy: -1,
        notes: "One unit may be misplaced",
      },
      {
        id: "2",
        countId: "1",
        stockId: "3",
        productName: "Wireless Mouse",
        sku: "WM-2024",
        expectedQuantity: 0,
        actualQuantity: 2,
        discrepancy: 2,
        notes: "Found in different location",
      },
    ],
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-02"),
  },
  {
    id: "2",
    countNumber: "SC-002",
    status: "in-progress",
    scheduledDate: "2024-04-01",
    locationId: "2",
    locationName: "Warehouse B",
    countedBy: "Jane Smith",
    notes: "Quarterly audit",
    items: [],
    createdAt: new Date("2024-03-25"),
    updatedAt: new Date("2024-03-25"),
  },
  {
    id: "3",
    countNumber: "SC-003",
    status: "draft",
    scheduledDate: "2024-04-15",
    locationId: "1",
    locationName: "Warehouse A",
    countedBy: "Alex Johnson",
    notes: "End of month verification",
    items: [],
    createdAt: new Date("2024-03-28"),
    updatedAt: new Date("2024-03-28"),
  },
];

// Sample locations
const sampleLocations = [
  { id: "1", name: "Warehouse A" },
  { id: "2", name: "Warehouse B" },
  { id: "3", name: "Store Front" },
  { id: "4", name: "Distribution Center" },
];

// Form schema for creating a stock count
const createStockCountSchema = z.object({
  scheduledDate: z.date({
    required_error: "Please select a scheduled date",
  }),
  locationId: z.string({
    required_error: "Please select a location",
  }),
  notes: z.string().optional(),
});

type CreateStockCountFormValues = z.infer<typeof createStockCountSchema>;

export default function StockCountsPage() {
  const router = useRouter();
  const [stockCounts, setStockCounts] =
    React.useState<IStockCount[]>(sampleStockCounts);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");

  const form = useForm<CreateStockCountFormValues>({
    resolver: zodResolver(createStockCountSchema),
    defaultValues: {
      notes: "",
    },
  });

  // Filter stock counts based on search query and status
  const filteredStockCounts = React.useMemo(() => {
    return stockCounts.filter((count) => {
      const matchesSearch =
        count.countNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        count.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        count.countedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (count.notes &&
          count.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" || count.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [stockCounts, searchQuery, statusFilter]);

  // Handle create stock count form submission
  const onSubmit = (data: CreateStockCountFormValues) => {
    // Create a new stock count
    const newCount: IStockCount = {
      id: `count-${Date.now()}`,
      countNumber: `SC-${String(stockCounts.length + 1).padStart(3, "0")}`,
      status: "draft",
      scheduledDate: format(data.scheduledDate, "yyyy-MM-dd"),
      locationId: data.locationId,
      locationName:
        sampleLocations.find((loc) => loc.id === data.locationId)?.name || "",
      countedBy: "Current User", // This would be the current user in a real app
      notes: data.notes,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setStockCounts([...stockCounts, newCount]);
    setIsCreateDialogOpen(false);
    form.reset();
    toast.success("Stock count created successfully");
  };

  // Render status badge
  const renderStatusBadge = (status: IStockCount["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "in-progress":
        return <Badge variant="warning">In Progress</Badge>;
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "cancelled":
        return <Badge variant="error">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stock Counts</h1>
          <p className="text-muted-foreground mt-1">
            Manage physical inventory counts and reconciliation
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          New Count
        </Button>
      </div>

      {/* Stock Counts Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Inventory Counts</CardTitle>
            <div className="flex gap-2">
              <SearchInput
                placeholder="Search counts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[250px]"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Count #</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Counted By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStockCounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <IconClipboardList className="h-10 w-10 text-muted-foreground/40" />
                        <span className="mt-2 text-muted-foreground">
                          No stock counts found
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-4"
                          onClick={() => setIsCreateDialogOpen(true)}
                        >
                          <IconPlus className="mr-2 h-4 w-4" />
                          Create New Count
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStockCounts.map((count) => (
                    <TableRow key={count.id}>
                      <TableCell className="font-medium">
                        <div
                          className="hover:underline cursor-pointer"
                          onClick={() =>
                            router.push(`/h/stock/counts/${count.id}`)
                          }
                        >
                          {count.countNumber}
                        </div>
                      </TableCell>
                      <TableCell>{count.locationName}</TableCell>
                      <TableCell>
                        {format(new Date(count.scheduledDate), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>{count.countedBy}</TableCell>
                      <TableCell>{renderStatusBadge(count.status)}</TableCell>
                      <TableCell>{count.items.length}</TableCell>
                      <TableCell>
                        {format(new Date(count.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <IconSearch className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/h/stock/counts/${count.id}`)
                              }
                            >
                              <IconClipboardCheck className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {count.status === "draft" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/h/stock/counts/${count.id}/edit`
                                  )
                                }
                              >
                                <IconClipboardList className="mr-2 h-4 w-4" />
                                Start Count
                              </DropdownMenuItem>
                            )}
                            {count.status === "in-progress" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/h/stock/counts/${count.id}/edit`
                                  )
                                }
                              >
                                <IconCheck className="mr-2 h-4 w-4" />
                                Continue Count
                              </DropdownMenuItem>
                            )}
                            {(count.status === "draft" ||
                              count.status === "in-progress") && (
                              <DropdownMenuItem
                                onClick={() => {
                                  // Would update count status to cancelled
                                  setStockCounts(
                                    stockCounts.map((c) =>
                                      c.id === count.id
                                        ? { ...c, status: "cancelled" }
                                        : c
                                    )
                                  );
                                  toast.success("Stock count cancelled");
                                }}
                              >
                                <IconX className="mr-2 h-4 w-4" />
                                Cancel Count
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                // Would delete the count
                                setStockCounts(
                                  stockCounts.filter((c) => c.id !== count.id)
                                );
                                toast.success("Stock count deleted");
                              }}
                              className="text-destructive"
                            >
                              <IconTrash className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Stock Count Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Stock Count</DialogTitle>
            <DialogDescription>
              Schedule a new physical inventory count
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="scheduledDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Scheduled Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal ${
                              !field.value ? "text-muted-foreground" : ""
                            }`}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The date when this count should be performed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sampleLocations.map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      The location where this count will be performed
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add any notes about this count"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional notes or instructions for this count
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Create Count</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
