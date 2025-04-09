"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { IconArrowLeft, IconCheck } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Selector } from "@/components/ui/selector";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  contactPerson: z.string().min(2, {
    message: "Contact person must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
  status: z.enum(["active", "inactive"], {
    required_error: "Please select a status.",
  }),
});

export default function AddSupplierPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      status: "active",
    },
  });

  const addSupplier = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return values;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      toast.success("Supplier added successfully");
      router.push("/h/suppliers");
    },
    onError: () => {
      toast.error("Failed to add supplier");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    addSupplier.mutate(values);
  }

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
          <h1 className="text-3xl font-bold">Add New Supplier</h1>
          <p className="text-muted-foreground">
            Add a new supplier to your inventory
          </p>
        </div>
      </div>

      <div className="rounded-lg border p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              {...form.register("name")}
              label="Supplier Name"
              placeholder="Enter supplier name"
              error={form.formState.errors.name?.message}
              info="Name of the supplier company"
            />

            <Input
              {...form.register("contactPerson")}
              label="Contact Person"
              placeholder="Enter contact person name"
              error={form.formState.errors.contactPerson?.message}
              info="Primary contact person at the supplier"
            />

            <Input
              {...form.register("email")}
              label="Email"
              type="email"
              placeholder="Enter email address"
              error={form.formState.errors.email?.message}
              info="Business email address"
            />

            <Input
              {...form.register("phone")}
              label="Phone"
              placeholder="Enter phone number"
              error={form.formState.errors.phone?.message}
              info="Business phone number"
            />

            <Selector
              label="Status"
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

          <Textarea
            {...form.register("address")}
            label="Address"
            placeholder="Enter supplier address"
            className="min-h-[100px] resize-none"
            error={form.formState.errors.address?.message}
            info="Complete business address"
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/h/suppliers")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Saving...</>
              ) : (
                <>
                  <IconCheck className="mr-2 size-4" />
                  Save Supplier
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
