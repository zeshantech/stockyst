"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/selector";
import { ImagePicker } from "@/components/ui/image-picker";
import { useStoreStore } from "@/store/useStoreStore";
import { ICreateStoreInput } from "@/types/store";
import { useState } from "react";
import { useUploadImage } from "@/hooks/use-upload-image";

const createStoreSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  type: z.string().optional(),
  logoUrl: z.string().optional(),
});

export function CreateStoreDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createStore = useStoreStore((store) => store.createStore);
  const isCreateStoreLoading = useStoreStore((store) => store.isCreateStoreLoading);
  const { upload } = useUploadImage();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ICreateStoreInput>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      country: "",
      phoneNumber: "",
      email: "",
      type: "warehouse",
      logoUrl: "",
    },
  });

  const handleClose = () => {
    onClose();
    reset();
  };

  const handleOnSubmit = async (data: ICreateStoreInput) => {
    handleClose();

    if (selectedImage) {
      const imageUrl = await upload(selectedImage);
      createStore({ ...data, logoUrl: imageUrl.url });
    } else {
      createStore(data);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      <DialogContent className="min-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="size-4" />
            Create New Store
          </DialogTitle>
          <DialogDescription>Add a new store or location to manage inventory.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-4">
          <ImagePicker image={selectedImage} onImageSelect={setSelectedImage} croppable dropable />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Store Name" required {...register("name")} placeholder="Main Warehouse" error={errors.name?.message} />

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
            <Input label="Phone Number" {...register("phoneNumber")} placeholder="+1 (234) 567-8901" />
            <Input label="Email" type="email" {...register("email")} placeholder="store@example.com" error={errors.email?.message} />
          </div>

          <Input label="Address" {...register("address")} placeholder="123 Inventory St" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="City" {...register("city")} placeholder="San Francisco" />
            <Input label="Country" {...register("country")} placeholder="USA" />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={isCreateStoreLoading}>
              Create Store
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
