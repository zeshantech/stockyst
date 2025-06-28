"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Store, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/selector";
import { ImagePicker } from "@/components/ui/image-picker";
import { useStoreStore } from "@/store/useStoreStore";
import { ICreateStoreInput } from "@/types/store";
import { useState, useEffect } from "react";
import { useUploadImage } from "@/hooks/use-upload-image";
import { PaymentForm } from "@/components/ui/payment-form";
import { formatCurrency } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const ReactConfetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

const createStoreSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  type: z.string(),
  logoUrl: z.string().optional(),
});

type CreateStoreFormData = z.infer<typeof createStoreSchema>;

export function CreateStoreDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createStore = useStoreStore((store) => store.createStore);
  const completeStorePayment = useStoreStore((store) => store.completeStorePayment);
  const resetCreateStoreResult = useStoreStore((store) => store.resetCreateStoreResult);
  const isCreateStoreLoading = useStoreStore((store) => store.isCreateStoreLoading);
  const isCompleteStorePaymentLoading = useStoreStore((store) => store.isCompleteStorePaymentLoading);
  const createStoreResult = useStoreStore((store) => store.createStoreResult);
  const { upload } = useUploadImage();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateStoreFormData>({
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
    resetCreateStoreResult();
    setShowConfetti(false);
  };

  const handleOnSubmit = async (data: CreateStoreFormData) => {
    let storeInput = { ...data } as ICreateStoreInput;

    if (selectedImage) {
      const imageUrl = await upload(selectedImage);
      storeInput = { ...storeInput, logoUrl: imageUrl.url };
    }

    await createStore(storeInput);
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    await completeStorePayment(paymentIntentId, watch() as ICreateStoreInput);
    setShowConfetti(true);
    setTimeout(() => {
      handleClose();
    }, 8000);
  };

  return (
    <>
      {showConfetti && <ReactConfetti width={windowDimensions.width} height={windowDimensions.height} recycle={false} numberOfPieces={500} tweenDuration={5000} />}
      <Dialog
        open={open}
        onOpenChange={(open) => {
          if (!open) {
            handleClose();
          }
        }}
      >
        <DialogContent className="min-w-lg">
          {showConfetti ? (
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold text-success">
                Welcome to
                <br />
                <span className="text-success text-8xl">--{watch("name")}--</span>
              </h2>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Store className="size-4" />
                  {createStoreResult?.clientSecret ? "Payment Required" : "Create New Store"}
                </DialogTitle>
                <DialogDescription>{createStoreResult?.clientSecret ? `A ${formatCurrency(createStoreResult.amount)} fee is required to create an additional store.` : "Add a new store or location to manage inventory."}</DialogDescription>
              </DialogHeader>

              {createStoreResult?.clientSecret ? (
                <PaymentForm clientSecret={createStoreResult.clientSecret} onPaymentSuccess={handlePaymentSuccess} amount={createStoreResult.amount} />
              ) : (
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
                    <Button type="submit" loading={isCreateStoreLoading || isCompleteStorePaymentLoading}>
                      Create Store
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
