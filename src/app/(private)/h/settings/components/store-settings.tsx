"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useStores } from "@/hooks/use-stores";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  IconBuilding,
  IconBuildingStore,
  IconEdit,
  IconMapPin,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ImagePicker } from "@/components/ui/image-picker";
import { Selector } from "@/components/ui/selector";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const storeFormSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  type: z.enum(["warehouse", "retail", "distribution", "supplier"]),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  isActive: z.boolean(),
  isDefault: z.boolean(),
  logo: z.string().optional(),
});

type StoreFormValues = z.infer<typeof storeFormSchema>;

const DEFAULT = {
  name: "",
  type: "warehouse" as const,
  address: "",
  city: "",
  country: "",
  phone: "",
  email: "",
  isActive: true,
  isDefault: false,
  logo: "",
};

export function StoreSettings() {
  const { data: stores = [], isLoading } = useStores();
  const [activeTab, setActiveTab] = useState("stores");
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StoreFormValues>({
    resolver: zodResolver(storeFormSchema),
    defaultValues: DEFAULT,
  });

  const handleEditStore = (storeId: string) => {
    const store = stores.find((s) => s.ID === storeId);
    if (store) {
      setSelectedStore(storeId);
      reset({
        name: store.name,
        type: (store.type as any) || "warehouse",
        address: store.address || "",
        city: store.city || "",
        country: store.country || "",
        phone: store.phoneNumber || "",
        email: store.email || "",
        isActive: true,
        isDefault: false,
        logo: store.logoUrl || "",
      });
      setIsEditingStore(true);
    }
  };

  const handleCreateStore = () => {
    setSelectedStore(null);
    reset(DEFAULT);
    setIsEditingStore(true);
  };

  const handleSaveStore = async (data: StoreFormValues) => {
    try {
      // Here you would save the store data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(
        selectedStore
          ? "Store updated successfully"
          : "Store created successfully"
      );
      setIsEditingStore(false);
    } catch (error) {
      toast.error(
        selectedStore ? "Failed to update store" : "Failed to create store"
      );
      console.error(error);
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    try {
      // Here you would delete the store
      await new Promise((resolve) => setTimeout(resolve, 500));

      toast.success("Store deleted successfully");
    } catch (error) {
      toast.error("Failed to delete store");
      console.error(error);
    }
  };

  const getStoreType = (storeId: string) => {
    // This would come from the store data in a real app
    return storeId === "store-1" ? "Warehouse" : "Retail Store";
  };

  const getStoreTypeIcon = (storeId: string) => {
    const type = getStoreType(storeId);
    return type === "Warehouse" ? IconBuilding : IconBuildingStore;
  };

  const getStoreAddress = (store: any) => {
    const parts = [store.address, store.city, store.country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "No address provided";
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stores">Stores & Locations</TabsTrigger>
          <TabsTrigger value="settings">Default Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="pt-6 space-y-6">
          {isEditingStore ? (
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedStore ? "Edit Store" : "Create New Store"}
                </CardTitle>
                <CardDescription>
                  {selectedStore
                    ? "Update the details of this store/location."
                    : "Add a new store or warehouse location to your inventory system."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={handleSubmit(handleSaveStore)}
                  className="space-y-6"
                >
                  <ImagePicker
                    image={watch("logo") as unknown as File}
                    onChange={(file) => {
                      if (file) {
                        // In a real app, you would upload the file here
                        // and then set the returned URL
                        const mockImageUrl = URL.createObjectURL(file);
                        setValue("logo", mockImageUrl);
                      }
                    }}
                      className="w-full h-32"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      id="name"
                      label="Store Name"
                      {...register("name")}
                      placeholder="Main Warehouse"
                      required
                      error={errors.name?.message}
                    />

                    <Selector
                      label="Store Type"
                      value={watch("type")}
                      onChange={(value) => setValue("type", value as any)}
                      options={[
                        { label: "Warehouse", value: "warehouse" },
                        { label: "Retail Store", value: "retail" },
                        { label: "Distribution Center", value: "distribution" },
                        { label: "Supplier Location", value: "supplier" },
                      ]}
                      placeholder="Select store type"
                      error={errors.type?.message}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      id="phone"
                      label="Phone"
                      {...register("phone")}
                      placeholder="+1 (234) 567-8901"
                      error={errors.phone?.message}
                    />

                    <Input
                      id="email"
                      label="Email"
                      type="email"
                      {...register("email")}
                      placeholder="store@example.com"
                      error={errors.email?.message}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      id="address"
                      label="Address"
                      {...register("address")}
                      placeholder="123 Main St"
                      error={errors.address?.message}
                    />
                    <Input
                      id="city"
                      label="City"
                      {...register("city")}
                      placeholder="New York"
                      error={errors.city?.message}
                    />

                    <Input
                      id="country"
                      label="Country"
                      {...register("country")}
                      placeholder="United States"
                      error={errors.country?.message}
                    />
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-4 border rounded-md bg-muted/30">
                    <div className="space-y-0.5">
                      <div className="text-base font-medium">Store Status</div>
                      <div className="text-sm text-muted-foreground">
                        Manage the availability and default status of this
                        store.
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          id="active-status"
                          checked={watch("isActive")}
                          onCheckedChange={(checked) =>
                            setValue("isActive", checked)
                          }
                        />
                        <Label htmlFor="active-status">Store is active</Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          id="default-status"
                          checked={watch("isDefault")}
                          onCheckedChange={(checked) =>
                            setValue("isDefault", checked)
                          }
                        />
                        <Label htmlFor="default-status">
                          Set as default store
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditingStore(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {selectedStore ? "Update Store" : "Create Store"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle>Stores & Warehouse Locations</CardTitle>
                  <CardDescription>
                    Manage all physical locations where you store inventory.
                  </CardDescription>
                </div>
                <Button onClick={handleCreateStore}>
                  <IconPlus />
                  Add Store
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="text-lg font-medium">
                        Loading stores...
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Please wait while we fetch your store data.
                      </div>
                    </div>
                  </div>
                ) : stores.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Store Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Location
                        </TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stores.map((store) => {
                        const StoreIcon = getStoreTypeIcon(store.ID);

                        return (
                          <TableRow key={store.ID}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 bg-primary/10">
                                  <AvatarFallback>
                                    <StoreIcon className="size-4" />
                                  </AvatarFallback>
                                </Avatar>
                                <div>{store.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{getStoreType(store.ID)}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <IconMapPin className="h-3.5 w-3.5" />
                                <span className="text-sm">
                                  {getStoreAddress(store)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {store.ID === "store-1" ? (
                                <Badge variant="info">Default</Badge>
                              ) : (
                                <Badge variant="success">Active</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditStore(store.ID)}
                                >
                                  <IconEdit className="size-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  color="error"
                                  onClick={() => handleDeleteStore(store.ID)}
                                  disabled={store.ID === "store-1"} // Prevent deleting default store
                                >
                                  <IconTrash />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 px-4 border rounded-md bg-muted/20">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <IconBuildingStore className="size-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-medium">
                      No stores configured
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Add your first store to start managing inventory
                      locations.
                    </p>
                    <Button className="mt-4" onClick={handleCreateStore}>
                      Add Your First Store
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="pt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Settings</CardTitle>
              <CardDescription>
                Configure global settings for all stores and locations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-4 border rounded-md">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">
                    Multi-Location Support
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Enable tracking the same item across multiple store
                    locations.
                  </div>
                </div>
                <Switch id="multi-location" defaultChecked />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-4 border rounded-md">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">
                    Track Item Transfers
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Record when items are transferred between different
                    locations.
                  </div>
                </div>
                <Switch id="track-transfers" defaultChecked />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center p-4 border rounded-md">
                <div className="space-y-0.5">
                  <div className="text-base font-medium">
                    Different Pricing Per Location
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Allow different pricing for the same product at different
                    locations.
                  </div>
                </div>
                <Switch id="different-pricing" />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="text-lg font-medium">
                  Default Units & Measurements
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Selector
                    label="Default Currency"
                    value="usd"
                    onChange={() => {}}
                    options={[
                      { label: "USD ($)", value: "usd" },
                      { label: "EUR (€)", value: "eur" },
                      { label: "GBP (£)", value: "gbp" },
                      { label: "JPY (¥)", value: "jpy" },
                    ]}
                    placeholder="Select currency"
                  />

                  <Selector
                    label="Default Weight Unit"
                    value="kg"
                    onChange={() => {}}
                    options={[
                      { label: "Kilograms (kg)", value: "kg" },
                      { label: "Grams (g)", value: "g" },
                      { label: "Pounds (lb)", value: "lb" },
                      { label: "Ounces (oz)", value: "oz" },
                    ]}
                    placeholder="Select weight unit"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Selector
                    label="Default Dimension Unit"
                    value="cm"
                    onChange={() => {}}
                    options={[
                      { label: "Centimeters (cm)", value: "cm" },
                      { label: "Meters (m)", value: "m" },
                      { label: "Inches (in)", value: "in" },
                      { label: "Feet (ft)", value: "ft" },
                    ]}
                    placeholder="Select dimension unit"
                  />

                  <Input
                    id="tax-rate"
                    label="Default Tax Rate (%)"
                    type="number"
                    defaultValue="7.5"
                    min="0"
                    max="100"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
