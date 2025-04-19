"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/(private)/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Page } from "@/components/(private)/dashboard/page";
import { useRouter, useParams } from "next/navigation";
import { IStockTransfer } from "@/types/stock";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  ArrowLeft,
  Edit,
  Download,
  Truck,
  ClipboardList,
  Calendar,
  MapPin,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ViewStockTransferPage() {
  const router = useRouter();
  const params = useParams();
  const transferId = params.id as string;
  const [transfer, setTransfer] = useState<IStockTransfer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Mock function to get transfer by ID (in a real app, this would come from the hooks)
  useEffect(() => {
    // This would be replaced with a real API call
    const mockGetTransferById = async (id: string) => {
      // Mock data for demonstration
      const mockTransfer: IStockTransfer = {
        id: id,
        transferNumber: `TR-${id.padStart(3, "0")}`,
        status: "in-progress",
        sourceLocationId: "1",
        sourceLocationName: "Warehouse A",
        destinationLocationId: "2",
        destinationLocationName: "Warehouse B",
        requestedBy: "John Doe",
        requestedDate: new Date().toISOString(),
        completedDate: null,
        notes: "Sample transfer notes for detailed viewing",
        items: [
          {
            id: "1",
            transferId: id,
            stockId: "1",
            productName: "Laptop Pro X1",
            sku: "LP-X1-2023",
            quantity: 5,
            notes: "Handle with care",
          },
          {
            id: "2",
            transferId: id,
            stockId: "2",
            productName: "Office Chair Ergo",
            sku: "OC-E-2023",
            quantity: 2,
            notes: "",
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return mockTransfer;
    };

    const loadTransfer = async () => {
      try {
        const data = await mockGetTransferById(transferId);
        setTransfer(data);
        setIsLoading(false);
      } catch (error) {
        toast.error("Failed to load transfer");
        router.push("/h/stock/transfers");
      }
    };

    loadTransfer();
  }, [transferId, router]);

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // This would call the actual delete function in a real app
    toast.success(`Transfer ${transfer?.transferNumber} deleted successfully`);
    setDeleteDialogOpen(false);
    router.push("/h/stock/transfers");
  };

  const handleStartTransfer = () => {
    // This would call the actual start transfer function in a real app
    toast.success(`Transfer ${transfer?.transferNumber} started`);
    // Refresh the page or update the state
    setTransfer((prev) => (prev ? { ...prev, status: "in-progress" } : null));
  };

  const handleCompleteTransfer = () => {
    // This would call the actual complete transfer function in a real app
    toast.success(`Transfer ${transfer?.transferNumber} completed`);
    // Refresh the page or update the state
    setTransfer((prev) =>
      prev
        ? {
            ...prev,
            status: "completed",
            completedDate: new Date().toISOString(),
          }
        : null
    );
  };

  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full inline-block"></div>
            <p className="mt-2">Loading transfer data...</p>
          </div>
        </div>
      </Page>
    );
  }

  if (!transfer) {
    return (
      <Page>
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Transfer Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested transfer could not be found.
          </p>
          <Button onClick={() => router.push("/h/stock/transfers")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transfers
          </Button>
        </div>
      </Page>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>;
      case "in-progress":
        return <Badge variant="warning">In Progress</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Page>
      <PageHeader
        title={`Stock Transfer: ${transfer.transferNumber}`}
        description="View and manage stock transfer details"
        action={
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push("/h/stock/transfers")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Transfers
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                toast.success(`Transfer ${transfer.transferNumber} exported`)
              }
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/h/stock/transfers/${transferId}/edit`)
              }
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            {transfer.status === "draft" && (
              <Button variant="default" onClick={handleStartTransfer}>
                <Truck className="mr-2 h-4 w-4" />
                Start Transfer
              </Button>
            )}
            {transfer.status === "in-progress" && (
              <Button variant="default" onClick={handleCompleteTransfer}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Complete Transfer
              </Button>
            )}
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Transfer Information</CardTitle>
            <CardDescription>Details about this stock transfer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">Status</div>
              <div>{getStatusBadge(transfer.status)}</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                Date Requested
              </div>
              <div className="text-sm">
                {format(new Date(transfer.requestedDate), "dd MMM yyyy")}
              </div>
            </div>
            {transfer.completedDate && (
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Date Completed
                </div>
                <div className="text-sm">
                  {format(new Date(transfer.completedDate), "dd MMM yyyy")}
                </div>
              </div>
            )}
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground flex items-center">
                <User className="h-4 w-4 mr-1" />
                Requested By
              </div>
              <div className="text-sm">{transfer.requestedBy}</div>
            </div>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Last Updated
              </div>
              <div className="text-sm">
                {format(new Date(transfer.updatedAt), "dd MMM yyyy")}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Locations</CardTitle>
            <CardDescription>Source and destination locations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Source Location
              </div>
              <div className="font-medium">{transfer.sourceLocationName}</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                Destination Location
              </div>
              <div className="font-medium">
                {transfer.destinationLocationName}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>Additional information</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {transfer.notes || "No notes provided for this transfer."}
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="destructive"
              size="sm"
              className="ml-auto"
              onClick={handleDelete}
            >
              Delete Transfer
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Transfer Items</CardTitle>
            <CardDescription>
              Items included in this transfer ({transfer.items.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transfer.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.productName}
                    </TableCell>
                    <TableCell>{item.sku}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.notes || "—"}</TableCell>
                  </TableRow>
                ))}
                {transfer.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No items in this transfer.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <div className="flex justify-between items-center w-full">
              <div className="text-sm text-muted-foreground">
                Total Items:{" "}
                <span className="font-medium">{transfer.items.length}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Total Quantity:{" "}
                <span className="font-medium">
                  {transfer.items.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete the transfer {transfer.transferNumber}.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}
