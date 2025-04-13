"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/selector";
import { ImagePicker } from "@/components/ui/image-picker";
import { useStoreActions } from "@/hooks/use-store-actions";

// Schema for store creation form
const createStoreSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  type: z.string().optional(),
  logo: z.string().optional(),
});

type CreateStoreFormValues = z.infer<typeof createStoreSchema>;

export function CreateStoreDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { createStore, isCreating } = useStoreActions();

  const form = useForm<CreateStoreFormValues>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      country: "",
      phone: "",
      email: "",
      type: "warehouse",
      logo: "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = form;

  // Handle form submission
  const onSubmit = async (data: CreateStoreFormValues) => {
    try {
      // Filter out empty strings for optional fields
      const filteredData = {
        ...Object.fromEntries(
          Object.entries(data).filter(([_, value]) => value !== "")
        ),
        name: data.name, // Ensure name is always included
      };

      // Create the store
      await createStore(filteredData);

      // Close the dialog and reset the form
      onClose();
      reset();
    } catch (error) {
      console.error("Error creating store:", error);
    }
  };

  const handleLogoChange = (url: string) => {
    setValue("logo", url);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          reset();
        }
      }}
    >
      <DialogContent className="min-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="size-4" />
            Create New Store
          </DialogTitle>
          <DialogDescription>
            Add a new store or location to manage inventory.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <ImagePicker
            image={watch("logo")}
            onChange={(file) => {
              if (file) {
                // In a real app, you would upload the file here
                // and then set the returned URL
                const mockImageUrl = URL.createObjectURL(file);
                setValue("logo", mockImageUrl);
              }
            }}
            onRemove={() => setValue("logo", "")}
            className="w-full h-32"
            cropOptions={{ crop: true, ratio: 1 }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Store Name"
              required
              {...register("name")}
              placeholder="Main Warehouse"
              error={errors.name?.message}
            />

            <Selector
              label="Store Type"
              value={watch("type")}
              onChange={(value) => setValue("type", value)}
              options={[
                { label: "Warehouse", value: "warehouse" },
                { label: "Retail Store", value: "retail" },
                { label: "Distribution Center", value: "distribution" },
                { label: "Supplier Location", value: "supplier" },
              ]}
              placeholder="Select store type"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Phone"
              {...register("phone")}
              placeholder="+1 (234) 567-8901"
            />

            <Input
              label="Email"
              type="email"
              {...register("email")}
              placeholder="store@example.com"
              error={errors.email?.message}
            />
          </div>

          <Input
            label="Address"
            {...register("address")}
            placeholder="123 Inventory St"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              {...register("city")}
              placeholder="San Francisco"
            />
            <Input label="Country" {...register("country")} placeholder="USA" />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting || isCreating}>
              Create Store
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
