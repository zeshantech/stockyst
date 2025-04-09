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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function StoreSettings() {
  const { data: stores = [], isLoading } = useStores();
  const [activeTab, setActiveTab] = useState("stores");
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  // Form state
  const [storeForm, setStoreForm] = useState({
    name: "",
    type: "warehouse",
    address: "",
    city: "",
    country: "",
    isActive: true,
    isDefault: false,
  });

  const handleEditStore = (storeId: string) => {
    const store = stores.find((s) => s.id === storeId);
    if (store) {
      setSelectedStore(storeId);
      setStoreForm({
        name: store.name,
        type: "warehouse", // This would come from the store data in a real app
        address: store.address || "",
        city: store.city || "",
        country: store.country || "",
        isActive: true,
        isDefault: false,
      });
      setIsEditingStore(true);
    }
  };

  const handleCreateStore = () => {
    setSelectedStore(null);
    setStoreForm({
      name: "",
      type: "warehouse",
      address: "",
      city: "",
      country: "",
      isActive: true,
      isDefault: false,
    });
    setIsEditingStore(true);
  };

  const handleSaveStore = async (e: React.FormEvent) => {
    e.preventDefault();

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
                <form onSubmit={handleSaveStore} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Store Name</Label>
                      <Input
                        id="name"
                        value={storeForm.name}
                        onChange={(e) =>
                          setStoreForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Main Warehouse"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Store Type</Label>
                      <Select
                        value={storeForm.type}
                        onValueChange={(value) =>
                          setStoreForm((prev) => ({ ...prev, type: value }))
                        }
                      >
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select store type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="warehouse">Warehouse</SelectItem>
                          <SelectItem value="retail">Retail Store</SelectItem>
                          <SelectItem value="distribution">
                            Distribution Center
                          </SelectItem>
                          <SelectItem value="supplier">
                            Supplier Location
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={storeForm.address}
                      onChange={(e) =>
                        setStoreForm((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={storeForm.city}
                        onChange={(e) =>
                          setStoreForm((prev) => ({
                            ...prev,
                            city: e.target.value,
                          }))
                        }
                        placeholder="New York"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        value={storeForm.country}
                        onChange={(e) =>
                          setStoreForm((prev) => ({
                            ...prev,
                            country: e.target.value,
                          }))
                        }
                        placeholder="United States"
                      />
                    </div>
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
                          checked={storeForm.isActive}
                          onCheckedChange={(checked) =>
                            setStoreForm((prev) => ({
                              ...prev,
                              isActive: checked,
                            }))
                          }
                        />
                        <Label htmlFor="active-status">Store is active</Label>
                      </div>

                      <div className="flex items-center gap-2">
                        <Switch
                          id="default-status"
                          checked={storeForm.isDefault}
                          onCheckedChange={(checked) =>
                            setStoreForm((prev) => ({
                              ...prev,
                              isDefault: checked,
                            }))
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
                  <IconPlus className="mr-2 h-4 w-4" />
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
                        const StoreIcon = getStoreTypeIcon(store.id);

                        return (
                          <TableRow key={store.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8 bg-primary/10">
                                  <AvatarFallback>
                                    <StoreIcon className="h-4 w-4" />
                                  </AvatarFallback>
                                </Avatar>
                                <div>{store.name}</div>
                              </div>
                            </TableCell>
                            <TableCell>{getStoreType(store.id)}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <IconMapPin className="h-3.5 w-3.5" />
                                <span className="text-sm">
                                  {getStoreAddress(store)}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {store.id === "store-1" ? (
                                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                                  Default
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="bg-green-100 text-green-800 hover:bg-green-100"
                                >
                                  Active
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditStore(store.id)}
                                >
                                  <IconEdit className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteStore(store.id)}
                                  disabled={store.id === "store-1"} // Prevent deleting default store
                                >
                                  <IconTrash className="h-4 w-4 text-red-500" />
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
                      <IconBuildingStore className="h-6 w-6 text-primary" />
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
                  <div className="space-y-2">
                    <Label htmlFor="default-currency">Default Currency</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger id="default-currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD ($)</SelectItem>
                        <SelectItem value="eur">EUR (€)</SelectItem>
                        <SelectItem value="gbp">GBP (£)</SelectItem>
                        <SelectItem value="jpy">JPY (¥)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="default-weight-unit">
                      Default Weight Unit
                    </Label>
                    <Select defaultValue="kg">
                      <SelectTrigger id="default-weight-unit">
                        <SelectValue placeholder="Select weight unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">Kilograms (kg)</SelectItem>
                        <SelectItem value="g">Grams (g)</SelectItem>
                        <SelectItem value="lb">Pounds (lb)</SelectItem>
                        <SelectItem value="oz">Ounces (oz)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="default-dimension-unit">
                      Default Dimension Unit
                    </Label>
                    <Select defaultValue="cm">
                      <SelectTrigger id="default-dimension-unit">
                        <SelectValue placeholder="Select dimension unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cm">Centimeters (cm)</SelectItem>
                        <SelectItem value="m">Meters (m)</SelectItem>
                        <SelectItem value="in">Inches (in)</SelectItem>
                        <SelectItem value="ft">Feet (ft)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                    <Input
                      id="tax-rate"
                      type="number"
                      defaultValue="7.5"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
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
