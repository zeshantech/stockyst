"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  IconAdjustments,
  IconArrowLeft,
  IconArrowRight,
  IconBoxModel2,
  IconDeviceFloppy,
  IconWeight,
} from "@tabler/icons-react";

interface EquipmentEditorProps {
  itemId: string;
  itemType: string;
  onClose: () => void;
}

const mockEquipmentData = {
  rack: {
    dimensions: {
      width: 42,
      depth: 48,
      height: 96,
    },
    capacity: {
      weight: 2000,
      items: 100,
    },
    configuration: {
      shelves: 4,
      adjustable: true,
      reinforced: false,
    },
  },
  zone: {
    dimensions: {
      width: 300,
      depth: 200,
      height: 120,
    },
    capacity: {
      weight: 8000,
      items: 400,
    },
    configuration: {
      hasRacks: true,
      hasShelves: true,
      hazardous: false,
    },
  },
};

export function EquipmentEditor({
  itemId,
  itemType,
  onClose,
}: EquipmentEditorProps) {
  const [activeTab, setActiveTab] = useState("dimensions");
  const [saving, setSaving] = useState(false);

  // Get initial data based on item type
  const initialData =
    mockEquipmentData[itemType as keyof typeof mockEquipmentData] ||
    mockEquipmentData.rack;

  const [dimensions, setDimensions] = useState(initialData.dimensions);
  const [capacity, setCapacity] = useState(initialData.capacity);
  const [configuration, setConfiguration] = useState(initialData.configuration);

  // Handle saving equipment changes
  const handleSave = () => {
    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast.success(`Equipment "${itemId}" updated successfully`);
      onClose();
    }, 800);
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Equipment Editor</CardTitle>
            <CardDescription>
              Configure equipment specifications
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <IconArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4 mx-6">
            <TabsTrigger value="dimensions">
              <IconBoxModel2 className="h-4 w-4 mr-2" />
              Dimensions
            </TabsTrigger>
            <TabsTrigger value="capacity">
              <IconWeight className="h-4 w-4 mr-2" />
              Capacity
            </TabsTrigger>
            <TabsTrigger value="configuration">
              <IconAdjustments className="h-4 w-4 mr-2" />
              Configuration
            </TabsTrigger>
          </TabsList>

          <div className="px-6 pb-6">
            <TabsContent value="dimensions" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="width">Width (inches)</Label>
                <Input
                  id="width"
                  type="number"
                  value={dimensions.width}
                  onChange={(e) =>
                    setDimensions({
                      ...dimensions,
                      width: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="depth">Depth (inches)</Label>
                <Input
                  id="depth"
                  type="number"
                  value={dimensions.depth}
                  onChange={(e) =>
                    setDimensions({
                      ...dimensions,
                      depth: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (inches)</Label>
                <Input
                  id="height"
                  type="number"
                  value={dimensions.height}
                  onChange={(e) =>
                    setDimensions({
                      ...dimensions,
                      height: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="capacity" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight Capacity (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  value={capacity.weight}
                  onChange={(e) =>
                    setCapacity({
                      ...capacity,
                      weight: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="items">Item Capacity</Label>
                <Input
                  id="items"
                  type="number"
                  value={capacity.items}
                  onChange={(e) =>
                    setCapacity({
                      ...capacity,
                      items: parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2 pt-4">
                <Label>Utilization Threshold</Label>
                <div className="pt-2">
                  <Slider defaultValue={[80]} max={100} step={5} />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                  <span>Warning at 80%</span>
                  <span>Critical at 95%</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="configuration" className="mt-0 space-y-4">
              {itemType === "rack" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="shelves">Number of Shelves</Label>
                    <Select
                      value={configuration.shelves?.toString()}
                      onValueChange={(value) =>
                        setConfiguration({
                          ...configuration,
                          shelves: parseInt(value),
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select shelves" />
                      </SelectTrigger>
                      <SelectContent>
                        {[2, 3, 4, 5, 6, 8].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} Shelves
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between space-y-0 pt-2">
                    <Label htmlFor="adjustable">Adjustable Shelves</Label>
                    <Switch
                      id="adjustable"
                      checked={configuration.adjustable}
                      onCheckedChange={(checked) =>
                        setConfiguration({
                          ...configuration,
                          adjustable: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between space-y-0 pt-2">
                    <Label htmlFor="reinforced">Reinforced Structure</Label>
                    <Switch
                      id="reinforced"
                      checked={configuration.reinforced}
                      onCheckedChange={(checked) =>
                        setConfiguration({
                          ...configuration,
                          reinforced: checked,
                        })
                      }
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between space-y-0">
                    <Label htmlFor="hasRacks">Contains Racks</Label>
                    <Switch
                      id="hasRacks"
                      checked={configuration.hasRacks}
                      onCheckedChange={(checked) =>
                        setConfiguration({
                          ...configuration,
                          hasRacks: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between space-y-0 pt-2">
                    <Label htmlFor="hasShelves">Contains Shelves</Label>
                    <Switch
                      id="hasShelves"
                      checked={configuration.hasShelves}
                      onCheckedChange={(checked) =>
                        setConfiguration({
                          ...configuration,
                          hasShelves: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between space-y-0 pt-2">
                    <Label htmlFor="hazardous">Hazardous Materials</Label>
                    <Switch
                      id="hazardous"
                      checked={configuration.hazardous}
                      onCheckedChange={(checked) =>
                        setConfiguration({
                          ...configuration,
                          hazardous: checked,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2 pt-4">
                    <Label htmlFor="zoneType">Zone Type</Label>
                    <Select defaultValue="storage">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="storage">Storage</SelectItem>
                        <SelectItem value="picking">Picking</SelectItem>
                        <SelectItem value="packing">Packing</SelectItem>
                        <SelectItem value="receiving">Receiving</SelectItem>
                        <SelectItem value="shipping">Shipping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t px-6 py-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} loading={saving}>
          <IconDeviceFloppy />
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
