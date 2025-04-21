"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWarehousing } from "@/hooks/use-warehousing";
import { toast } from "sonner";
import {
  IconArrowsMaximize,
  IconBuildingWarehouse,
  IconLayout2,
  IconPackage,
  IconPackageExport,
  IconPackageImport,
  IconPlus,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons-react";
import { EquipmentEditor } from "./equipment-editor";

// Mock data for floor plan elements
const floorPlanItems = [
  {
    id: "zone-a",
    type: "zone",
    name: "Zone A",
    x: 50,
    y: 50,
    width: 300,
    height: 200,
    utilization: 75,
    status: "active",
  },
  {
    id: "zone-b",
    type: "zone",
    name: "Zone B",
    x: 400,
    y: 50,
    width: 250,
    height: 200,
    utilization: 90,
    status: "active",
  },
  {
    id: "zone-c",
    type: "zone",
    name: "Zone C",
    x: 50,
    y: 300,
    width: 300,
    height: 150,
    utilization: 60,
    status: "maintenance",
  },
  {
    id: "zone-d",
    type: "zone",
    name: "Zone D",
    x: 400,
    y: 300,
    width: 250,
    height: 150,
    utilization: 40,
    status: "active",
  },
  {
    id: "receiving",
    type: "receiving",
    name: "Receiving Area",
    x: 700,
    y: 50,
    width: 150,
    height: 150,
    status: "active",
  },
  {
    id: "shipping",
    type: "shipping",
    name: "Shipping Area",
    x: 700,
    y: 300,
    width: 150,
    height: 150,
    status: "active",
  },
  {
    id: "rack-a1",
    type: "rack",
    name: "Rack A1",
    x: 75,
    y: 75,
    width: 40,
    height: 150,
    utilization: 80,
    status: "active",
  },
  {
    id: "rack-a2",
    type: "rack",
    name: "Rack A2",
    x: 125,
    y: 75,
    width: 40,
    height: 150,
    utilization: 85,
    status: "active",
  },
  {
    id: "rack-a3",
    type: "rack",
    name: "Rack A3",
    x: 175,
    y: 75,
    width: 40,
    height: 150,
    utilization: 65,
    status: "active",
  },
  {
    id: "rack-a4",
    type: "rack",
    name: "Rack A4",
    x: 225,
    y: 75,
    width: 40,
    height: 150,
    utilization: 75,
    status: "active",
  },
  {
    id: "rack-b1",
    type: "rack",
    name: "Rack B1",
    x: 425,
    y: 75,
    width: 40,
    height: 150,
    utilization: 95,
    status: "active",
  },
  {
    id: "rack-b2",
    type: "rack",
    name: "Rack B2",
    x: 475,
    y: 75,
    width: 40,
    height: 150,
    utilization: 90,
    status: "active",
  },
  {
    id: "rack-b3",
    type: "rack",
    name: "Rack B3",
    x: 525,
    y: 75,
    width: 40,
    height: 150,
    utilization: 85,
    status: "active",
  },
  {
    id: "rack-b4",
    type: "rack",
    name: "Rack B4",
    x: 575,
    y: 75,
    width: 40,
    height: 150,
    utilization: 90,
    status: "active",
  },
];

// Function to get fill color based on utilization
const getUtilizationColor = (utilization: number) => {
  if (utilization > 90) return "#ef4444"; // Red for high utilization
  if (utilization > 75) return "#f97316"; // Orange for medium-high utilization
  if (utilization > 50) return "#22c55e"; // Green for medium utilization
  return "#a3e635"; // Light green for low utilization
};

// Function to get color based on status
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "#22c55e"; // Green
    case "maintenance":
      return "#f97316"; // Orange
    case "inactive":
      return "#6b7280"; // Gray
    default:
      return "#6b7280"; // Default gray
  }
};

export function WarehouseFloorPlan() {
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>("1");
  const [selectedFloor, setSelectedFloor] = useState<string>("ground");
  const [zoom, setZoom] = useState<number>(1);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showUtilization, setShowUtilization] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("layout");

  // Modals state
  const [addZoneOpen, setAddZoneOpen] = useState<boolean>(false);
  const [addRackOpen, setAddRackOpen] = useState<boolean>(false);

  // New zone/rack form data
  const [newZoneName, setNewZoneName] = useState<string>("");
  const [newRackName, setNewRackName] = useState<string>("");

  const { warehouses } = useWarehousing();

  const [showEquipmentEditor, setShowEquipmentEditor] =
    useState<boolean>(false);

  // Handle zoom in/out
  const handleZoomIn = () => {
    if (zoom < 2) setZoom(zoom + 0.2);
  };

  const handleZoomOut = () => {
    if (zoom > 0.6) setZoom(zoom - 0.2);
  };

  const handleReset = () => {
    setZoom(1);
  };

  // Get selected item details
  const getSelectedItemDetails = () => {
    if (!selectedItem) return null;
    return floorPlanItems.find((item) => item.id === selectedItem);
  };

  // Handle adding a new zone
  const handleAddZone = () => {
    if (!newZoneName.trim()) {
      toast.error("Zone name is required");
      return;
    }

    // Simulating adding a new zone
    toast.success(`Zone "${newZoneName}" added successfully`);
    setAddZoneOpen(false);
    setNewZoneName("");
  };

  // Handle adding a new rack
  const handleAddRack = () => {
    if (!newRackName.trim()) {
      toast.error("Rack name is required");
      return;
    }

    // Simulating adding a new rack
    toast.success(`Rack "${newRackName}" added successfully`);
    setAddRackOpen(false);
    setNewRackName("");
  };

  // Handle edit button click
  const handleEditEquipment = () => {
    if (selectedItem) {
      setShowEquipmentEditor(true);
    }
  };

  const selectedItemDetails = getSelectedItemDetails();

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue="layout"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="layout">Floor Layout</TabsTrigger>
            <TabsTrigger value="utilization">Space Utilization</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Heat Map</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Select
              value={selectedWarehouse}
              onValueChange={setSelectedWarehouse}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select Warehouse" />
              </SelectTrigger>
              <SelectContent>
                {warehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedFloor} onValueChange={setSelectedFloor}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Floor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ground">Ground Floor</SelectItem>
                <SelectItem value="mezzanine">Mezzanine</SelectItem>
                <SelectItem value="first">First Floor</SelectItem>
                <SelectItem value="second">Second Floor</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="layout" className="mt-0">
          <div className="flex flex-wrap gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => setShowUtilization(!showUtilization)}
            >
              {showUtilization ? "Hide Utilization" : "Show Utilization"}
            </Button>

            <div className="flex-1"></div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoom <= 0.6}
              >
                <IconZoomOut className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleReset}>
                100%
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoom >= 2}
              >
                <IconZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="col-span-1 md:col-span-3 bg-muted rounded-lg overflow-hidden relative">
              <div className="h-[500px] overflow-auto relative">
                <div
                  className="relative bg-white"
                  style={{
                    width: "900px",
                    height: "500px",
                    transform: `scale(${zoom})`,
                    transformOrigin: "top left",
                    transition: "transform 0.2s ease-out",
                  }}
                >
                  {/* Render floor plan elements */}
                  {floorPlanItems.map((item) => (
                    <div
                      key={item.id}
                      className={`absolute border-2 flex flex-col justify-center items-center cursor-pointer transition-all duration-200 ${
                        selectedItem === item.id
                          ? "border-primary shadow-md z-10"
                          : `border-gray-300`
                      }`}
                      style={{
                        left: `${item.x}px`,
                        top: `${item.y}px`,
                        width: `${item.width}px`,
                        height: `${item.height}px`,
                        backgroundColor:
                          showUtilization && item.utilization
                            ? getUtilizationColor(item.utilization)
                            : "white",
                        borderColor: getStatusColor(item.status),
                        opacity: item.status === "inactive" ? 0.6 : 1,
                      }}
                      onClick={() =>
                        setSelectedItem(
                          item.id === selectedItem ? null : item.id
                        )
                      }
                    >
                      <div className="text-xs font-medium text-center p-1 pointer-events-none">
                        {item.name}
                      </div>
                      {item.utilization && showUtilization && (
                        <div className="text-xs text-center p-1 pointer-events-none">
                          {item.utilization}%
                        </div>
                      )}

                      {item.type === "receiving" && (
                        <IconPackageImport className="h-5 w-5 text-gray-700" />
                      )}
                      {item.type === "shipping" && (
                        <IconPackageExport className="h-5 w-5 text-gray-700" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-4 left-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAddZoneOpen(true)}
                >
                  <IconPlus className="h-4 w-4 mr-1" />
                  Add Zone
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAddRackOpen(true)}
                >
                  <IconPlus className="h-4 w-4 mr-1" />
                  Add Rack
                </Button>
              </div>
            </div>

            <div className="col-span-1">
              {selectedItemDetails ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">
                      {selectedItemDetails.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Type:
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {selectedItemDetails.type}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Status:
                      </span>
                      <Badge
                        variant={
                          selectedItemDetails.status === "active"
                            ? "success"
                            : selectedItemDetails.status === "maintenance"
                            ? "warning"
                            : "secondary"
                        }
                        className="capitalize"
                      >
                        {selectedItemDetails.status}
                      </Badge>
                    </div>
                    {selectedItemDetails.utilization !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Utilization:
                        </span>
                        <Badge
                          variant={
                            selectedItemDetails.utilization > 90
                              ? "error"
                              : selectedItemDetails.utilization > 75
                              ? "warning"
                              : "success"
                          }
                        >
                          {selectedItemDetails.utilization}%
                        </Badge>
                      </div>
                    )}

                    <div className="flex gap-2 pt-4">
                      <Button size="sm" className="w-full">
                        Details
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={handleEditEquipment}
                      >
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="h-full flex flex-col justify-center items-center p-6">
                  <IconBuildingWarehouse className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-center text-muted-foreground">
                    Select a zone or rack to view details
                  </p>
                </Card>
              )}

              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Legend</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#22c55e]"></div>
                    <span className="text-sm">Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#f97316]"></div>
                    <span className="text-sm">Maintenance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#6b7280]"></div>
                    <span className="text-sm">Inactive</span>
                  </div>

                  <div className="mt-2 pt-2 border-t">
                    <p className="text-sm font-medium mb-1">Utilization</p>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#ef4444]"></div>
                      <span className="text-sm">High (90%+)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#f97316]"></div>
                      <span className="text-sm">Medium-High (75-90%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#22c55e]"></div>
                      <span className="text-sm">Medium (50-75%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-[#a3e635]"></div>
                      <span className="text-sm">Low (0-50%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="utilization" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-[500px] p-8 bg-gray-50 border rounded-lg">
                <IconLayout2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Space Utilization Heat Map
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Visualize space usage efficiency across your warehouse with
                  our dynamic heat map. Red areas indicate high utilization
                  while blue areas show underutilized spaces.
                </p>
                <div className="flex gap-3">
                  <Button>Generate Heat Map</Button>
                  <Button variant="outline">Schedule Analysis</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-[500px] p-8 bg-gray-50 border rounded-lg">
                <IconPackage className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Inventory Distribution Map
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Track inventory distribution with our visual heat map.
                  Identify where stock is concentrated and optimize your storage
                  strategy for faster order fulfillment.
                </p>
                <div className="flex gap-3">
                  <Button>View Inventory Map</Button>
                  <Button variant="outline">Configure Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow" className="mt-0">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center h-[500px] p-8 bg-gray-50 border rounded-lg">
                <IconArrowsMaximize className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  Workflow Visualization
                </h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Optimize movement patterns and reduce travel time with
                  workflow analysis. Identify bottlenecks and improve
                  operational efficiency throughout your warehouse.
                </p>
                <div className="flex gap-3">
                  <Button>Analyze Workflows</Button>
                  <Button variant="outline">View Reports</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Zone Dialog */}
      <Dialog open={addZoneOpen} onOpenChange={setAddZoneOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Zone</DialogTitle>
            <DialogDescription>
              Create a new zone in the warehouse floor plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="zone-name">Zone Name</Label>
              <Input
                id="zone-name"
                placeholder="e.g., Bulk Storage Zone"
                value={newZoneName}
                onChange={(e) => setNewZoneName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zone-type">Zone Type</Label>
                <Select defaultValue="storage">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="storage">Storage</SelectItem>
                    <SelectItem value="picking">Picking</SelectItem>
                    <SelectItem value="packing">Packing</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="zone-status">Status</Label>
                <Select defaultValue="active">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddZoneOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddZone}>Add Zone</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Rack Dialog */}
      <Dialog open={addRackOpen} onOpenChange={setAddRackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Rack</DialogTitle>
            <DialogDescription>
              Create a new rack in the warehouse floor plan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="rack-name">Rack Name</Label>
              <Input
                id="rack-name"
                placeholder="e.g., Rack A5"
                value={newRackName}
                onChange={(e) => setNewRackName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rack-type">Rack Type</Label>
                <Select defaultValue="pallet">
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pallet">Pallet Rack</SelectItem>
                    <SelectItem value="drive-in">Drive-In Rack</SelectItem>
                    <SelectItem value="cantilever">Cantilever Rack</SelectItem>
                    <SelectItem value="flow">Flow Rack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rack-status">Status</Label>
                <Select defaultValue="active">
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="rack-capacity">Capacity (units)</Label>
              <Input id="rack-capacity" type="number" placeholder="1000" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRackOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRack}>Add Rack</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Equipment Editor */}
      {showEquipmentEditor && selectedItemDetails && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <EquipmentEditor
              itemId={selectedItemDetails.id}
              itemType={selectedItemDetails.type}
              onClose={() => setShowEquipmentEditor(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
