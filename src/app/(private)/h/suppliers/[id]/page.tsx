"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  IconArrowLeft,
  IconBuilding,
  IconCheck,
  IconEdit,
  IconPhone,
  IconTrash,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/selector";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useSupplierActions } from "@/hooks/use-supplier-actions";
import { ISupplier } from "@/types/supplier";

// Sample supplier data
const sampleSupplier: ISupplier = {
  id: "1",
  name: "Acme Corporation",
  email: "contact@acme.com",
  phone: "+1 234 567 8900",
  address: {
    street: "123 Business Ave",
    city: "Business City",
    state: "BC",
    zipCode: "12345",
    country: "USA",
  },
  status: "active",
  products: 25,
  lastOrder: "2024-03-15T10:00:00Z",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    country: z.string(),
  }),
  status: z.enum(["active", "inactive"], {
    required_error: "Please select a status.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SupplierDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [supplier, setSupplier] = React.useState<ISupplier>(sampleSupplier);
  const { deleteSupplier, toggleSupplierStatus } = useSupplierActions();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      status: supplier.status,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSupplier({
        ...supplier,
        ...values,
        updatedAt: new Date().toISOString(),
      });
      setIsEditing(false);
      toast.success("Supplier updated successfully");
    } catch (error) {
      console.error("Error updating supplier:", error);
      toast.error("Failed to update supplier");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSupplier.mutateAsync({ id: supplier.id });
      toast.success("Supplier deleted successfully");
      router.push("/h/suppliers");
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast.error("Failed to delete supplier");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/h/suppliers")}
        >
          <IconArrowLeft />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Supplier Details</h1>
          <p className="text-muted-foreground">
            View and manage supplier information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          {isEditing ? (
            <div className="rounded-lg border p-6">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input
                    {...form.register("name")}
                    error={form.formState.errors.name?.message}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <Input
                      {...form.register("email")}
                      error={form.formState.errors.email?.message}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      {...form.register("phone")}
                      error={form.formState.errors.phone?.message}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      {...form.register("address.street")}
                      placeholder="Street"
                    />

                    <Input
                      {...form.register("address.city")}
                      placeholder="City"
                    />
                    <Input
                      {...form.register("address.state")}
                      placeholder="State"
                    />
                    <Input
                      {...form.register("address.zipCode")}
                      placeholder="ZIP Code"
                    />
                    <Input
                      {...form.register("address.country")}
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Selector
                    value={form.watch("status")}
                    onChange={(value) => form.setValue("status", value)}
                    error={form.formState.errors.status?.message}
                    info="Current status of the supplier"
                    options={[
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                    ]}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={isSubmitting}>
                    <IconCheck />
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="rounded-lg border p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Supplier Information</h2>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  <IconEdit />
                  Edit Supplier
                </Button>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Company Name</p>
                  <p className="font-medium">{supplier.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    variant={supplier.status === "active" ? "success" : "muted"}
                  >
                    {supplier.status.charAt(0).toUpperCase() +
                      supplier.status.slice(1)}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{supplier.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{supplier.phone}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">
                    {`${supplier.address.street}, ${supplier.address.city}, ${supplier.address.state} ${supplier.address.zipCode}, ${supplier.address.country}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Products</p>
                  <p className="font-medium">{supplier.products}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Order</p>
                  <p className="font-medium">
                    {new Date(supplier.lastOrder).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created At</p>
                  <p className="font-medium">
                    {new Date(supplier.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Updated At</p>
                  <p className="font-medium">
                    {new Date(supplier.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supplier Status</CardTitle>
              <CardDescription>Current status of the supplier</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge
                variant={supplier.status === "active" ? "success" : "muted"}
              >
                {supplier.status.charAt(0).toUpperCase() +
                  supplier.status.slice(1)}
              </Badge>
              <p className="mt-2 text-sm text-muted-foreground">
                {supplier.status === "active"
                  ? "This supplier is active and can provide products"
                  : "This supplier is inactive and cannot provide products"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>
                Products supplied by this supplier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{supplier.products}</div>
              <p className="text-sm text-muted-foreground">Total products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Last Order</CardTitle>
              <CardDescription>
                Most recent order from this supplier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {new Date(supplier.lastOrder).toLocaleDateString()}
              </div>
              <p className="text-sm text-muted-foreground">
                Date of last order
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>
                Once you delete a supplier, there is no going back. Please be
                certain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button color="error" className="w-full" onClick={handleDelete}>
                <IconTrash />
                Delete Supplier
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
