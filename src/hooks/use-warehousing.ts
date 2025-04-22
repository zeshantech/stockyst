import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  IWarehouse,
  ILocation,
  ITransfer,
  IReceiving,
  IPutaway,
  IEquipment,
  EquipmentType,
  EquipmentFormValues,
  WarehouseFormValues,
  TransferFormValues,
} from "@/types/warehouse";

export const WAREHOUSING_QUERY_KEYS = {
  ALL_WAREHOUSES: ["warehouses"],
  WAREHOUSE_DETAIL: (id: string) => ["warehouses", id],
  ALL_LOCATIONS: ["locations"],
  LOCATION_DETAIL: (id: string) => ["locations", id],
  WAREHOUSE_LOCATIONS: (warehouseId: string) => [
    "warehouses",
    warehouseId,
    "locations",
  ],
  ALL_TRANSFERS: ["transfers"],
  TRANSFER_DETAIL: (id: string) => ["transfers", id],
  ALL_RECEIVING: ["receiving"],
  RECEIVING_DETAIL: (id: string) => ["receiving", id],
  ALL_PUTAWAY: ["putaway"],
  PUTAWAY_DETAIL: (id: string) => ["putaway", id],
  STATISTICS: ["warehousing", "statistics"],
};

// Sample data - replace with actual API call
const sampleWarehouses: IWarehouse[] = [
  {
    id: "wh1",
    name: "Main Warehouse",
    code: "WH-MAIN",
    description: "Primary warehouse facility for general inventory",
    address: "123 Storage Lane",
    city: "Springfield",
    state: "IL",
    country: "USA",
    zipCode: "62701",
    status: "active",
    capacity: 10000,
    utilization: 6500,
    manager: "John Smith",
    phone: "+1-555-123-4567",
    email: "john.smith@example.com",
    isDefault: true,
    type: "warehouse",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "wh2",
    name: "East Coast Distribution",
    code: "WH-EAST",
    description: "Distribution center for east coast operations",
    address: "456 Shipping Blvd",
    city: "Boston",
    state: "MA",
    country: "USA",
    zipCode: "02108",
    status: "active",
    capacity: 8000,
    utilization: 5200,
    manager: "Emily Johnson",
    phone: "+1-555-987-6543",
    email: "emily.johnson@example.com",
    isDefault: false,
    type: "distribution-center",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "wh3",
    name: "West Coast Hub",
    code: "WH-WEST",
    description: "Main facility for west coast operations",
    address: "789 Harbor Way",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    zipCode: "90012",
    status: "active",
    capacity: 12000,
    utilization: 8700,
    manager: "Michael Chen",
    phone: "+1-555-456-7890",
    email: "michael.chen@example.com",
    isDefault: false,
    type: "warehouse",
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2024-01-30"),
  },
  {
    id: "wh4",
    name: "Midwest Facility",
    code: "WH-MID",
    description: "Central distribution center for midwest region",
    address: "101 Central Avenue",
    city: "Chicago",
    state: "IL",
    country: "USA",
    zipCode: "60601",
    status: "maintenance",
    capacity: 7500,
    utilization: 0,
    manager: "Sarah Miller",
    phone: "+1-555-321-6540",
    email: "sarah.miller@example.com",
    isDefault: false,
    type: "distribution-center",
    createdAt: new Date("2023-07-05"),
    updatedAt: new Date("2024-04-01"),
  },
  {
    id: "wh5",
    name: "Southern Depot",
    code: "WH-SOUTH",
    description: "Storage facility for southern region operations",
    address: "202 Cotton Lane",
    city: "Atlanta",
    state: "GA",
    country: "USA",
    zipCode: "30303",
    status: "inactive",
    capacity: 6000,
    utilization: 1200,
    manager: "Robert Johnson",
    phone: "+1-555-789-0123",
    email: "robert.johnson@example.com",
    isDefault: false,
    type: "store",
    createdAt: new Date("2023-09-15"),
    updatedAt: new Date("2024-03-01"),
  },
];

const sampleLocations: ILocation[] = [
  {
    id: "loc1",
    warehouseId: "wh1",
    name: "Section A",
    code: "SEC-A",
    description: "General storage section A",
    type: "section",
    status: "active",
    capacity: 1000,
    utilization: 750,
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "loc2",
    warehouseId: "wh1",
    name: "Aisle 1",
    code: "AISLE-1",
    description: "First aisle in Section A",
    type: "aisle",
    status: "active",
    capacity: 200,
    utilization: 150,
    parent: "loc1",
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "loc3",
    warehouseId: "wh1",
    name: "Shelf 1A",
    code: "SH-1A",
    description: "First shelf in Aisle 1",
    type: "shelf",
    status: "active",
    capacity: 50,
    utilization: 35,
    parent: "loc2",
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "loc4",
    warehouseId: "wh1",
    name: "Bin 1A-1",
    code: "BIN-1A1",
    description: "First bin on Shelf 1A",
    type: "bin",
    status: "active",
    capacity: 10,
    utilization: 8,
    parent: "loc3",
    createdAt: new Date("2023-01-20"),
    updatedAt: new Date("2024-02-15"),
  },
  {
    id: "loc5",
    warehouseId: "wh2",
    name: "Section B",
    code: "SEC-B",
    description: "Electronics section",
    type: "section",
    status: "active",
    capacity: 800,
    utilization: 600,
    createdAt: new Date("2023-03-15"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "loc6",
    warehouseId: "wh2",
    name: "High Value Zone",
    code: "HVZ-1",
    description: "Secure zone for high-value items",
    type: "zone",
    status: "reserved",
    capacity: 200,
    utilization: 120,
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2024-02-25"),
  },
];

const sampleTransfers: ITransfer[] = [
  {
    id: "tr1",
    sourceWarehouseId: "wh1",
    destinationWarehouseId: "wh2",
    items: [
      {
        id: "tri1",
        transferId: "tr1",
        productId: "1", // Laptop Pro X1
        quantity: 5,
        sourceLocationId: "loc1",
        destinationLocationId: "loc5",
        status: "in-transit",
        createdAt: new Date("2024-04-01"),
        updatedAt: new Date("2024-04-01"),
      },
      {
        id: "tri2",
        transferId: "tr1",
        productId: "3", // Wireless Mouse
        quantity: 10,
        sourceLocationId: "loc2",
        destinationLocationId: "loc6",
        status: "in-transit",
        createdAt: new Date("2024-04-01"),
        updatedAt: new Date("2024-04-01"),
      },
    ],
    status: "in-transit",
    initiatedBy: "John Smith",
    initiatedAt: new Date("2024-04-01"),
    estimatedArrival: new Date("2024-04-05"),
    trackingNumber: "TR-2024-001",
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-02"),
  },
  {
    id: "tr2",
    sourceWarehouseId: "wh3",
    destinationWarehouseId: "wh1",
    items: [
      {
        id: "tri3",
        transferId: "tr2",
        productId: "2", // Office Chair Ergo
        quantity: 3,
        status: "received",
        receivedQuantity: 3,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-20"),
      },
    ],
    status: "completed",
    initiatedBy: "Michael Chen",
    approvedBy: "John Smith",
    initiatedAt: new Date("2024-03-15"),
    completedAt: new Date("2024-03-20"),
    trackingNumber: "TR-2024-002",
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-20"),
  },
  {
    id: "tr3",
    sourceWarehouseId: "wh2",
    destinationWarehouseId: "wh3",
    items: [
      {
        id: "tri4",
        transferId: "tr3",
        productId: "1", // Laptop Pro X1
        quantity: 2,
        status: "pending",
        createdAt: new Date("2024-04-03"),
        updatedAt: new Date("2024-04-03"),
      },
    ],
    status: "draft",
    initiatedBy: "Emily Johnson",
    initiatedAt: new Date("2024-04-03"),
    estimatedArrival: new Date("2024-04-08"),
    createdAt: new Date("2024-04-03"),
    updatedAt: new Date("2024-04-03"),
  },
];

const sampleReceiving: IReceiving[] = [
  {
    id: "rec1",
    warehouseId: "wh1",
    purchaseOrderId: "po123",
    supplierId: "1", // TechSuppliers Inc
    items: [
      {
        id: "reci1",
        receivingId: "rec1",
        productId: "1", // Laptop Pro X1
        expectedQuantity: 10,
        receivedQuantity: 10,
        locationId: "loc1",
        status: "received",
        qualityCheck: "passed",
        createdAt: new Date("2024-03-25"),
        updatedAt: new Date("2024-03-25"),
      },
      {
        id: "reci2",
        receivingId: "rec1",
        productId: "3", // Wireless Mouse
        expectedQuantity: 20,
        receivedQuantity: 18,
        locationId: "loc2",
        notes: "Two units damaged during shipping",
        status: "partially-received",
        qualityCheck: "passed",
        createdAt: new Date("2024-03-25"),
        updatedAt: new Date("2024-03-25"),
      },
    ],
    status: "partially-received",
    receivedBy: "John Smith",
    receivedAt: new Date("2024-03-25"),
    trackingNumber: "PO-2024-001",
    createdAt: new Date("2024-03-25"),
    updatedAt: new Date("2024-03-25"),
  },
  {
    id: "rec2",
    warehouseId: "wh2",
    supplierId: "2", // FurniCorp
    items: [
      {
        id: "reci3",
        receivingId: "rec2",
        productId: "2", // Office Chair Ergo
        expectedQuantity: 5,
        receivedQuantity: 5,
        locationId: "loc5",
        status: "received",
        qualityCheck: "passed",
        createdAt: new Date("2024-04-01"),
        updatedAt: new Date("2024-04-01"),
      },
    ],
    status: "completed",
    receivedBy: "Emily Johnson",
    receivedAt: new Date("2024-04-01"),
    trackingNumber: "SHIP-2024-002",
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-01"),
  },
];

const samplePutaways: IPutaway[] = [
  {
    id: "put1",
    warehouseId: "wh1",
    receivingId: "rec1",
    items: [
      {
        id: "puti1",
        putawayId: "put1",
        productId: "1", // Laptop Pro X1
        quantity: 10,
        sourceLocationId: "loc1", // Receiving area
        destinationLocationId: "loc4", // Permanent storage bin
        status: "completed",
        createdAt: new Date("2024-03-26"),
        updatedAt: new Date("2024-03-26"),
      },
      {
        id: "puti2",
        putawayId: "put1",
        productId: "3", // Wireless Mouse
        quantity: 18,
        sourceLocationId: "loc2", // Receiving area
        destinationLocationId: "loc3", // Permanent storage shelf
        status: "completed",
        createdAt: new Date("2024-03-26"),
        updatedAt: new Date("2024-03-26"),
      },
    ],
    status: "completed",
    assignedTo: "Alex Turner",
    initiatedAt: new Date("2024-03-26"),
    completedAt: new Date("2024-03-26"),
    createdAt: new Date("2024-03-26"),
    updatedAt: new Date("2024-03-26"),
  },
  {
    id: "put2",
    warehouseId: "wh2",
    receivingId: "rec2",
    items: [
      {
        id: "puti3",
        putawayId: "put2",
        productId: "2", // Office Chair Ergo
        quantity: 5,
        destinationLocationId: "loc5", // Storage section
        status: "pending",
        createdAt: new Date("2024-04-02"),
        updatedAt: new Date("2024-04-02"),
      },
    ],
    status: "pending",
    assignedTo: "Jessica Lee",
    initiatedAt: new Date("2024-04-02"),
    createdAt: new Date("2024-04-02"),
    updatedAt: new Date("2024-04-02"),
  },
];

const sampleEquipment: IEquipment[] = [
  {
    id: "eq1",
    warehouseId: "wh1",
    type: "rack",
    name: "Storage Rack A1",
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
    status: "active",
    createdAt: new Date("2023-02-15"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "eq2",
    warehouseId: "wh1",
    type: "zone",
    name: "Receiving Zone",
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
    status: "active",
    createdAt: new Date("2023-02-15"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "eq3",
    warehouseId: "wh2",
    type: "rack",
    name: "Heavy Duty Rack B2",
    dimensions: {
      width: 48,
      depth: 60,
      height: 120,
    },
    capacity: {
      weight: 4000,
      items: 150,
    },
    configuration: {
      shelves: 6,
      adjustable: true,
      reinforced: true,
    },
    status: "active",
    createdAt: new Date("2023-03-20"),
    updatedAt: new Date("2024-02-05"),
  },
];

const warehouseStatistics = {
  totalWarehouses: 5,
  activeWarehouses: 3,
  totalCapacity: 43500,
  totalUtilization: 21600,
  utilizationRate: 49.7,
  pendingTransfers: 2,
  pendingReceiving: 1,
  pendingPutaways: 1,
  monthlyTransfers: [
    { month: "Jan", count: 5, volume: 120 },
    { month: "Feb", count: 7, volume: 145 },
    { month: "Mar", count: 10, volume: 180 },
    { month: "Apr", count: 8, volume: 160 },
    { month: "May", count: 0, volume: 0 },
    { month: "Jun", count: 0, volume: 0 },
  ],
  topWarehouses: [
    { id: "wh3", name: "West Coast Hub", utilization: 72.5 },
    { id: "wh1", name: "Main Warehouse", utilization: 65.0 },
    { id: "wh2", name: "East Coast Distribution", utilization: 65.0 },
  ],
};

// Add sample floor plan items
const sampleFloorPlanItems = [
  {
    id: "zone-a",
    type: "zone",
    name: "Zone A",
    warehouseId: "wh1",
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
    warehouseId: "wh1",
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
    warehouseId: "wh1",
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
    warehouseId: "wh1",
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
    warehouseId: "wh1",
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
    warehouseId: "wh1",
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
    warehouseId: "wh1",
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
    warehouseId: "wh1",
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
    warehouseId: "wh1",
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
    warehouseId: "wh1",
    x: 225,
    y: 75,
    width: 40,
    height: 150,
    utilization: 75,
    status: "active",
  },
  // Warehouse 2 floor plan items
  {
    id: "zone-e",
    type: "zone",
    name: "Zone E",
    warehouseId: "wh2",
    x: 50,
    y: 50,
    width: 400,
    height: 250,
    utilization: 65,
    status: "active",
  },
  {
    id: "zone-f",
    type: "zone",
    name: "Zone F",
    warehouseId: "wh2",
    x: 500,
    y: 50,
    width: 350,
    height: 250,
    utilization: 80,
    status: "active",
  },
  {
    id: "receiving-wh2",
    type: "receiving",
    name: "Receiving Area",
    warehouseId: "wh2",
    x: 50,
    y: 350,
    width: 200,
    height: 150,
    status: "active",
  },
  {
    id: "shipping-wh2",
    type: "shipping",
    name: "Shipping Area",
    warehouseId: "wh2",
    x: 650,
    y: 350,
    width: 200,
    height: 150,
    status: "active",
  },
];

/**
 * Main hook for warehousing operations
 */
export function useWarehousing() {
  const queryClient = useQueryClient();
  const isAuthenticated = true; // TODO: make it dynamic

  // Query for all warehouses
  const allWarehousesQuery = useQuery({
    queryKey: WAREHOUSING_QUERY_KEYS.ALL_WAREHOUSES,
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return sampleWarehouses;
    },
    enabled: isAuthenticated,
  });

  // Query for all locations
  const allLocationsQuery = useQuery({
    queryKey: WAREHOUSING_QUERY_KEYS.ALL_LOCATIONS,
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return sampleLocations;
    },
    enabled: isAuthenticated,
  });

  // Query for all transfers
  const allTransfersQuery = useQuery({
    queryKey: WAREHOUSING_QUERY_KEYS.ALL_TRANSFERS,
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return sampleTransfers;
    },
    enabled: isAuthenticated,
  });

  // Query for all receiving records
  const allReceivingQuery = useQuery({
    queryKey: WAREHOUSING_QUERY_KEYS.ALL_RECEIVING,
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return sampleReceiving;
    },
    enabled: isAuthenticated,
  });

  // Query for all putaway records
  const allPutawayQuery = useQuery({
    queryKey: WAREHOUSING_QUERY_KEYS.ALL_PUTAWAY,
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return samplePutaways;
    },
    enabled: isAuthenticated,
  });

  // Query for warehousing statistics
  const statisticsQuery = useQuery({
    queryKey: WAREHOUSING_QUERY_KEYS.STATISTICS,
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 400));
      return warehouseStatistics;
    },
    enabled: isAuthenticated,
  });

  // Query for all equipment
  const allEquipmentQuery = useQuery({
    queryKey: ["equipment"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return sampleEquipment;
    },
    enabled: isAuthenticated,
  });

  // Query for floor plan items
  const allFloorPlanItemsQuery = useQuery({
    queryKey: ["floorPlanItems"],
    queryFn: async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      return sampleFloorPlanItems;
    },
    enabled: isAuthenticated,
  });

  // Function to get warehouse by ID
  const getWarehouseById = (id: string): IWarehouse | undefined => {
    return allWarehousesQuery.data?.find((warehouse) => warehouse.id === id);
  };

  // Function to get location by ID
  const getLocationById = (id: string): ILocation | undefined => {
    return allLocationsQuery.data?.find((location) => location.id === id);
  };

  // Function to get transfer by ID
  const getTransferById = (id: string): ITransfer | undefined => {
    return allTransfersQuery.data?.find((transfer) => transfer.id === id);
  };

  // Function to get receiving record by ID
  const getReceivingById = (id: string): IReceiving | undefined => {
    return allReceivingQuery.data?.find((receiving) => receiving.id === id);
  };

  // Function to get putaway record by ID
  const getPutawayById = (id: string): IPutaway | undefined => {
    return allPutawayQuery.data?.find((putaway) => putaway.id === id);
  };

  // Function to get locations by warehouse ID
  const getLocationsByWarehouseId = (warehouseId: string): ILocation[] => {
    return (
      allLocationsQuery.data?.filter(
        (location) => location.warehouseId === warehouseId
      ) || []
    );
  };

  // Function to get transfers by warehouse ID (as source or destination)
  const getTransfersByWarehouseId = (warehouseId: string): ITransfer[] => {
    return (
      allTransfersQuery.data?.filter(
        (transfer) =>
          transfer.sourceWarehouseId === warehouseId ||
          transfer.destinationWarehouseId === warehouseId
      ) || []
    );
  };

  // Function to get receiving records by warehouse ID
  const getReceivingByWarehouseId = (warehouseId: string): IReceiving[] => {
    return (
      allReceivingQuery.data?.filter(
        (receiving) => receiving.warehouseId === warehouseId
      ) || []
    );
  };

  // Function to get putaway records by warehouse ID
  const getPutawayByWarehouseId = (warehouseId: string): IPutaway[] => {
    return (
      allPutawayQuery.data?.filter(
        (putaway) => putaway.warehouseId === warehouseId
      ) || []
    );
  };

  // Function to get a warehouse detail with useQuery
  const useWarehouseById = (id: string) => {
    return useQuery({
      queryKey: WAREHOUSING_QUERY_KEYS.WAREHOUSE_DETAIL(id),
      queryFn: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        const warehouse = sampleWarehouses.find((w) => w.id === id);
        if (!warehouse) {
          throw new Error(`Warehouse with ID ${id} not found`);
        }
        return warehouse;
      },
      enabled: isAuthenticated && !!id,
    });
  };

  // Function to get locations by warehouse ID with useQuery
  const useLocationsByWarehouseId = (warehouseId: string) => {
    return useQuery({
      queryKey: WAREHOUSING_QUERY_KEYS.WAREHOUSE_LOCATIONS(warehouseId),
      queryFn: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        return sampleLocations.filter(
          (location) => location.warehouseId === warehouseId
        );
      },
      enabled: isAuthenticated && !!warehouseId,
    });
  };

  // Function to get transfer by ID with useQuery
  const useTransferById = (id: string) => {
    return useQuery({
      queryKey: WAREHOUSING_QUERY_KEYS.TRANSFER_DETAIL(id),
      queryFn: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        const transfer = sampleTransfers.find((t) => t.id === id);
        if (!transfer) {
          throw new Error(`Transfer with ID ${id} not found`);
        }
        return transfer;
      },
      enabled: isAuthenticated && !!id,
    });
  };

  // Function to get receiving record by ID with useQuery
  const useReceivingById = (id: string) => {
    return useQuery({
      queryKey: WAREHOUSING_QUERY_KEYS.RECEIVING_DETAIL(id),
      queryFn: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        const receiving = sampleReceiving.find((r) => r.id === id);
        if (!receiving) {
          throw new Error(`Receiving record with ID ${id} not found`);
        }
        return receiving;
      },
      enabled: isAuthenticated && !!id,
    });
  };

  // Function to get putaway record by ID with useQuery
  const usePutawayById = (id: string) => {
    return useQuery({
      queryKey: WAREHOUSING_QUERY_KEYS.PUTAWAY_DETAIL(id),
      queryFn: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        const putaway = samplePutaways.find((p) => p.id === id);
        if (!putaway) {
          throw new Error(`Putaway record with ID ${id} not found`);
        }
        return putaway;
      },
      enabled: isAuthenticated && !!id,
    });
  };

  // Equipment functions
  const getEquipmentById = (id: string): IEquipment | undefined => {
    return allEquipmentQuery.data?.find((equipment) => equipment.id === id);
  };

  const getEquipmentByWarehouseId = (warehouseId: string): IEquipment[] => {
    return (
      allEquipmentQuery.data?.filter(
        (equipment) => equipment.warehouseId === warehouseId
      ) || []
    );
  };

  // Function to get floor plan items by warehouse ID
  const getFloorPlanItemsByWarehouseId = (warehouseId: string) => {
    return (
      allFloorPlanItemsQuery.data?.filter(
        (item) => item.warehouseId === warehouseId
      ) || []
    );
  };

  // Create warehouse mutation
  const createWarehouseMutation = useMutation({
    mutationFn: async (
      newWarehouse: Omit<IWarehouse, "id" | "createdAt" | "updatedAt">
    ) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...newWarehouse,
        id: `wh-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as IWarehouse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.ALL_WAREHOUSES,
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.STATISTICS,
      });
      toast.success("Warehouse created successfully");
    },
    onError: (error) => {
      console.error("Error creating warehouse:", error);
      toast.error("Failed to create warehouse");
    },
  });

  // Update warehouse mutation
  const updateWarehouseMutation = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<IWarehouse> & { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...data,
        id,
        updatedAt: new Date(),
      } as IWarehouse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.ALL_WAREHOUSES,
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.WAREHOUSE_DETAIL(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.STATISTICS,
      });
      toast.success("Warehouse updated successfully");
    },
    onError: (error) => {
      console.error("Error updating warehouse:", error);
      toast.error("Failed to update warehouse");
    },
  });

  // Delete warehouse mutation
  const deleteWarehouseMutation = useMutation({
    mutationFn: async (_: { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.ALL_WAREHOUSES,
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.STATISTICS,
      });
      toast.success("Warehouse deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting warehouse:", error);
      toast.error("Failed to delete warehouse");
    },
  });

  // Create location mutation
  const createLocationMutation = useMutation({
    mutationFn: async (
      newLocation: Omit<ILocation, "id" | "createdAt" | "updatedAt">
    ) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...newLocation,
        id: `loc-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as ILocation;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.ALL_LOCATIONS,
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.WAREHOUSE_LOCATIONS(data.warehouseId),
      });
      toast.success("Location created successfully");
    },
    onError: (error) => {
      console.error("Error creating location:", error);
      toast.error("Failed to create location");
    },
  });

  // Update location mutation
  const updateLocationMutation = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<ILocation> & { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...data,
        id,
        updatedAt: new Date(),
      } as ILocation;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.ALL_LOCATIONS,
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.LOCATION_DETAIL(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.WAREHOUSE_LOCATIONS(data.warehouseId),
      });
      toast.success("Location updated successfully");
    },
    onError: (error) => {
      console.error("Error updating location:", error);
      toast.error("Failed to update location");
    },
  });

  // Delete location mutation
  const deleteLocationMutation = useMutation({
    mutationFn: async (_: { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.ALL_LOCATIONS,
      });
      toast.success("Location deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location");
    },
  });

  // Create transfer mutation
  const createTransferMutation = useMutation({
    mutationFn: async (
      newTransfer: Omit<
        ITransfer,
        "id" | "items" | "createdAt" | "updatedAt" | "initiatedAt"
      > & {
        items: Array<
          Omit<
            ITransfer["items"][0],
            "id" | "transferId" | "createdAt" | "updatedAt"
          >
        >;
      }
    ) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const transferId = `tr-${Date.now()}`;
      const now = new Date();

      return {
        ...newTransfer,
        id: transferId,
        initiatedAt: now,
        items: newTransfer.items.map((item, index) => ({
          ...item,
          id: `tri-${Date.now()}-${index}`,
          transferId,
          createdAt: now,
          updatedAt: now,
        })),
        createdAt: now,
        updatedAt: now,
      } as ITransfer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.ALL_TRANSFERS,
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.STATISTICS,
      });
      toast.success("Transfer created successfully");
    },
    onError: (error) => {
      console.error("Error creating transfer:", error);
      toast.error("Failed to create transfer");
    },
  });

  // Update transfer mutation
  const updateTransferMutation = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<ITransfer> & { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...data,
        id,
        updatedAt: new Date(),
      } as ITransfer;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.ALL_TRANSFERS,
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.TRANSFER_DETAIL(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.STATISTICS,
      });
      toast.success("Transfer updated successfully");
    },
    onError: (error) => {
      console.error("Error updating transfer:", error);
      toast.error("Failed to update transfer");
    },
  });

  // Delete transfer mutation
  const deleteTransferMutation = useMutation({
    mutationFn: async (_: { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.ALL_TRANSFERS,
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.STATISTICS,
      });
      toast.success("Transfer deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting transfer:", error);
      toast.error("Failed to delete transfer");
    },
  });

  // Create receiving record mutation
  const createReceivingMutation = useMutation({
    mutationFn: async (
      newReceiving: Omit<
        IReceiving,
        "id" | "items" | "createdAt" | "updatedAt" | "receivedAt"
      > & {
        items: Array<
          Omit<
            IReceiving["items"][0],
            "id" | "receivingId" | "createdAt" | "updatedAt"
          >
        >;
      }
    ) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const receivingId = `rec-${Date.now()}`;
      const now = new Date();

      return {
        ...newReceiving,
        id: receivingId,
        receivedAt: now,
        items: newReceiving.items.map((item, index) => ({
          ...item,
          id: `reci-${Date.now()}-${index}`,
          receivingId,
          createdAt: now,
          updatedAt: now,
        })),
        createdAt: now,
        updatedAt: now,
      } as IReceiving;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.ALL_RECEIVING,
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.STATISTICS,
      });
      toast.success("Receiving record created successfully");
    },
    onError: (error) => {
      console.error("Error creating receiving record:", error);
      toast.error("Failed to create receiving record");
    },
  });

  // Update receiving record mutation
  const updateReceivingMutation = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<IReceiving> & { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...data,
        id,
        updatedAt: new Date(),
      } as IReceiving;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.ALL_RECEIVING,
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.RECEIVING_DETAIL(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.STATISTICS,
      });
      toast.success("Receiving record updated successfully");
    },
    onError: (error) => {
      console.error("Error updating receiving record:", error);
      toast.error("Failed to update receiving record");
    },
  });

  // Create putaway record mutation
  const createPutawayMutation = useMutation({
    mutationFn: async (
      newPutaway: Omit<
        IPutaway,
        "id" | "items" | "createdAt" | "updatedAt" | "initiatedAt"
      > & {
        items: Array<
          Omit<
            IPutaway["items"][0],
            "id" | "putawayId" | "createdAt" | "updatedAt"
          >
        >;
      }
    ) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const putawayId = `put-${Date.now()}`;
      const now = new Date();

      return {
        ...newPutaway,
        id: putawayId,
        initiatedAt: now,
        items: newPutaway.items.map((item, index) => ({
          ...item,
          id: `puti-${Date.now()}-${index}`,
          putawayId,
          createdAt: now,
          updatedAt: now,
        })),
        createdAt: now,
        updatedAt: now,
      } as IPutaway;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.ALL_PUTAWAY,
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.STATISTICS,
      });
      toast.success("Putaway record created successfully");
    },
    onError: (error) => {
      console.error("Error creating putaway record:", error);
      toast.error("Failed to create putaway record");
    },
  });

  // Update putaway record mutation
  const updatePutawayMutation = useMutation({
    mutationFn: async ({ id, ...data }: Partial<IPutaway> & { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...data,
        id,
        updatedAt: new Date(),
      } as IPutaway;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.ALL_PUTAWAY,
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.PUTAWAY_DETAIL(data.id),
      });
      queryClient.invalidateQueries({
        queryKey: WAREHOUSING_QUERY_KEYS.STATISTICS,
      });
      toast.success("Putaway record updated successfully");
    },
    onError: (error) => {
      console.error("Error updating putaway record:", error);
      toast.error("Failed to update putaway record");
    },
  });

  // Hard-coded warehouse coordinates for demo purposes
  // In a real application, these would be stored in your database
  const warehouseCoordinates: Record<
    string,
    { lat: number; lng: number; type: string; stock: number }
  > = {
    wh1: { lat: 39.7817, lng: -89.6501, type: "distribution", stock: 6500 },
    wh2: { lat: 42.3601, lng: -71.0589, type: "distribution", stock: 5200 },
    wh3: { lat: 34.0522, lng: -118.2437, type: "storage", stock: 8700 },
    wh4: { lat: 41.8781, lng: -87.6298, type: "manufacturing", stock: 0 },
    wh5: { lat: 33.749, lng: -84.388, type: "fulfillment", stock: 1200 },
  };

  const getWarehouseCoordinates = (warehouseId: string) => {
    return (
      warehouseCoordinates[warehouseId] || {
        lat: 40.7128,
        lng: -74.006,
        type: "default",
        stock: 0,
      }
    );
  };

  // Update equipment mutation
  const updateEquipmentMutation = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<IEquipment> & { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...data,
        id,
        updatedAt: new Date(),
      } as IEquipment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["equipment"],
      });
      queryClient.invalidateQueries({
        queryKey: ["equipment", data.id],
      });
      toast.success("Equipment updated successfully");
    },
    onError: (error) => {
      console.error("Error updating equipment:", error);
      toast.error("Failed to update equipment");
    },
  });

  // Create equipment mutation
  const createEquipmentMutation = useMutation({
    mutationFn: async (
      newEquipment: Omit<IEquipment, "id" | "createdAt" | "updatedAt">
    ) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...newEquipment,
        id: `eq-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as IEquipment;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["equipment"],
      });
      toast.success("Equipment created successfully");
    },
    onError: (error) => {
      console.error("Error creating equipment:", error);
      toast.error("Failed to create equipment");
    },
  });

  // Delete equipment mutation
  const deleteEquipmentMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["equipment"],
      });
      toast.success("Equipment deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting equipment:", error);
      toast.error("Failed to delete equipment");
    },
  });

  // Function to parse API parameters from form values
  const parseWarehouseFormValues = (
    formValues: WarehouseFormValues
  ): Omit<IWarehouse, "id" | "createdAt" | "updatedAt"> => {
    return {
      ...formValues,
      capacity: parseInt(formValues.capacity),
      utilization: parseInt(formValues.utilization),
      type: formValues.type || "warehouse",
    };
  };

  // Parse transfer form values
  const parseTransferFormValues = (
    formValues: TransferFormValues,
    userId: string = "system"
  ): Omit<
    ITransfer,
    "id" | "items" | "createdAt" | "updatedAt" | "initiatedAt"
  > & {
    items: Array<
      Omit<
        ITransfer["items"][0],
        "id" | "transferId" | "createdAt" | "updatedAt"
      >
    >;
  } => {
    return {
      sourceWarehouseId: formValues.sourceWarehouseId,
      destinationWarehouseId: formValues.destinationWarehouseId,
      status: "draft",
      initiatedBy: userId,
      notes: formValues.notes,
      trackingNumber: formValues.trackingNumber,
      estimatedArrival: formValues.estimatedArrival
        ? new Date(formValues.estimatedArrival)
        : undefined,
      items: formValues.items.map((item) => ({
        productId: item.productId,
        quantity: parseInt(item.quantity),
        sourceLocationId: item.sourceLocationId,
        destinationLocationId: item.destinationLocationId,
        notes: item.notes,
        status: "pending",
      })),
    };
  };

  // Parse equipment form values
  const parseEquipmentFormValues = (
    formValues: EquipmentFormValues
  ): Omit<IEquipment, "id" | "createdAt" | "updatedAt"> => {
    return {
      warehouseId: formValues.warehouseId,
      type: formValues.type,
      name: formValues.name,
      dimensions: formValues.dimensions,
      capacity: formValues.capacity,
      configuration: formValues.configuration,
      status: formValues.status || "active",
    };
  };

  // Create floor plan item mutation
  const createFloorPlanItemMutation = useMutation({
    mutationFn: async (
      newItem: Omit<(typeof sampleFloorPlanItems)[0], "id">
    ) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...newItem,
        id: `item-${Date.now()}`,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["floorPlanItems"],
      });
      toast.success("Floor plan item created successfully");
    },
    onError: (error) => {
      console.error("Error creating floor plan item:", error);
      toast.error("Failed to create floor plan item");
    },
  });

  // Update floor plan item mutation
  const updateFloorPlanItemMutation = useMutation({
    mutationFn: async ({
      id,
      ...data
    }: Partial<(typeof sampleFloorPlanItems)[0]> & { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        ...data,
        id,
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["floorPlanItems"],
      });
      toast.success("Floor plan item updated successfully");
    },
    onError: (error) => {
      console.error("Error updating floor plan item:", error);
      toast.error("Failed to update floor plan item");
    },
  });

  // Delete floor plan item mutation
  const deleteFloorPlanItemMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["floorPlanItems"],
      });
      toast.success("Floor plan item deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting floor plan item:", error);
      toast.error("Failed to delete floor plan item");
    },
  });

  return {
    // Data
    warehouses: allWarehousesQuery.data || [],
    locations: allLocationsQuery.data || [],
    transfers: allTransfersQuery.data || [],
    receiving: allReceivingQuery.data || [],
    putaways: allPutawayQuery.data || [],
    statistics: statisticsQuery.data || null,
    equipment: allEquipmentQuery.data || [],
    floorPlanItems: allFloorPlanItemsQuery.data || [],

    // Loading states
    isLoadingWarehouses: allWarehousesQuery.isLoading,
    isLoadingLocations: allLocationsQuery.isLoading,
    isLoadingTransfers: allTransfersQuery.isLoading,
    isLoadingReceiving: allReceivingQuery.isLoading,
    isLoadingPutaways: allPutawayQuery.isLoading,
    isLoadingStatistics: statisticsQuery.isLoading,
    isLoadingEquipment: allEquipmentQuery.isLoading,
    isLoadingFloorPlanItems: allFloorPlanItemsQuery.isLoading,

    // Error states
    warehousesError: allWarehousesQuery.error,
    locationsError: allLocationsQuery.error,
    transfersError: allTransfersQuery.error,
    receivingError: allReceivingQuery.error,
    putawaysError: allPutawayQuery.error,
    statisticsError: statisticsQuery.error,
    equipmentError: allEquipmentQuery.error,
    floorPlanItemsError: allFloorPlanItemsQuery.error,

    // Utility functions
    getWarehouseById,
    getLocationById,
    getTransferById,
    getReceivingById,
    getPutawayById,
    getLocationsByWarehouseId,
    getTransfersByWarehouseId,
    getReceivingByWarehouseId,
    getPutawayByWarehouseId,
    getWarehouseCoordinates,
    useWarehouseById,
    useLocationsByWarehouseId,
    useTransferById,
    useReceivingById,
    usePutawayById,
    getEquipmentById,
    getEquipmentByWarehouseId,
    getFloorPlanItemsByWarehouseId,

    // Mutations
    createWarehouse: createWarehouseMutation.mutate,
    updateWarehouse: updateWarehouseMutation.mutate,
    deleteWarehouse: deleteWarehouseMutation.mutate,
    createLocation: createLocationMutation.mutate,
    updateLocation: updateLocationMutation.mutate,
    deleteLocation: deleteLocationMutation.mutate,
    createTransfer: createTransferMutation.mutate,
    updateTransfer: updateTransferMutation.mutate,
    deleteTransfer: deleteTransferMutation.mutate,
    createReceiving: createReceivingMutation.mutate,
    updateReceiving: updateReceivingMutation.mutate,
    createPutaway: createPutawayMutation.mutate,
    updatePutaway: updatePutawayMutation.mutate,
    createEquipment: createEquipmentMutation.mutate,
    updateEquipment: updateEquipmentMutation.mutate,
    deleteEquipment: deleteEquipmentMutation.mutate,
    createFloorPlanItem: createFloorPlanItemMutation.mutate,
    updateFloorPlanItem: updateFloorPlanItemMutation.mutate,
    deleteFloorPlanItem: deleteFloorPlanItemMutation.mutate,

    // Mutation states
    isCreatingWarehouse: createWarehouseMutation.isPending,
    isUpdatingWarehouse: updateWarehouseMutation.isPending,
    isDeletingWarehouse: deleteWarehouseMutation.isPending,
    isCreatingLocation: createLocationMutation.isPending,
    isUpdatingLocation: updateLocationMutation.isPending,
    isDeletingLocation: deleteLocationMutation.isPending,
    isCreatingTransfer: createTransferMutation.isPending,
    isUpdatingTransfer: updateTransferMutation.isPending,
    isDeletingTransfer: deleteTransferMutation.isPending,
    isCreatingReceiving: createReceivingMutation.isPending,
    isUpdatingReceiving: updateReceivingMutation.isPending,
    isCreatingPutaway: createPutawayMutation.isPending,
    isUpdatingPutaway: updatePutawayMutation.isPending,
    isCreatingEquipment: createEquipmentMutation.isPending,
    isUpdatingEquipment: updateEquipmentMutation.isPending,
    isDeletingEquipment: deleteEquipmentMutation.isPending,
    isCreatingFloorPlanItem: createFloorPlanItemMutation.isPending,
    isUpdatingFloorPlanItem: updateFloorPlanItemMutation.isPending,
    isDeletingFloorPlanItem: deleteFloorPlanItemMutation.isPending,

    isAuthenticated,

    // Form value parsing helpers
    parseWarehouseFormValues,
    parseTransferFormValues,
    parseEquipmentFormValues,
  };
}

// For specific use cases, export individual hooks that use the main hook
export function useAllWarehouses() {
  const {
    warehouses,
    isLoadingWarehouses: isLoading,
    warehousesError: error,
  } = useWarehousing();
  return { data: warehouses, isLoading, error };
}

export function useAllLocations() {
  const {
    locations,
    isLoadingLocations: isLoading,
    locationsError: error,
  } = useWarehousing();
  return { data: locations, isLoading, error };
}

export function useAllTransfers() {
  const {
    transfers,
    isLoadingTransfers: isLoading,
    transfersError: error,
  } = useWarehousing();
  return { data: transfers, isLoading, error };
}

export function useAllReceiving() {
  const {
    receiving,
    isLoadingReceiving: isLoading,
    receivingError: error,
  } = useWarehousing();
  return { data: receiving, isLoading, error };
}

export function useAllPutaways() {
  const {
    putaways,
    isLoadingPutaways: isLoading,
    putawaysError: error,
  } = useWarehousing();
  return { data: putaways, isLoading, error };
}

export function useWarehouseStatistics() {
  const {
    statistics,
    isLoadingStatistics: isLoading,
    statisticsError: error,
  } = useWarehousing();
  return { data: statistics, isLoading, error };
}

export function useCreateWarehouse() {
  const { createWarehouse, isCreatingWarehouse: isPending } = useWarehousing();
  return { mutate: createWarehouse, isPending };
}

export function useUpdateWarehouse() {
  const { updateWarehouse, isUpdatingWarehouse: isPending } = useWarehousing();
  return { mutate: updateWarehouse, isPending };
}

export function useDeleteWarehouse() {
  const { deleteWarehouse, isDeletingWarehouse: isPending } = useWarehousing();
  return { mutate: deleteWarehouse, isPending };
}

export function useDeleteLocation() {
  const { deleteLocation, isDeletingLocation: isPending } = useWarehousing();
  return { mutate: deleteLocation, isPending };
}

export function useDeleteTransfer() {
  const { deleteTransfer, isDeletingTransfer: isPending } = useWarehousing();
  return { mutate: deleteTransfer, isPending };
}

export function useCreateTransfer() {
  const { createTransfer, isCreatingTransfer: isPending } = useWarehousing();
  return { mutate: createTransfer, isPending };
}

export function useWarehouse(id: string) {
  const { useWarehouseById } = useWarehousing();
  return useWarehouseById(id);
}

export function useLocationsByWarehouse(warehouseId: string) {
  const { useLocationsByWarehouseId } = useWarehousing();
  return useLocationsByWarehouseId(warehouseId);
}

export function useTransfer(id: string) {
  const { useTransferById } = useWarehousing();
  return useTransferById(id);
}

export function useReceiving(id: string) {
  const { useReceivingById } = useWarehousing();
  return useReceivingById(id);
}

export function usePutaway(id: string) {
  const { usePutawayById } = useWarehousing();
  return usePutawayById(id);
}

export function useAllEquipment() {
  const {
    equipment,
    isLoadingEquipment: isLoading,
    equipmentError: error,
  } = useWarehousing();
  return { data: equipment, isLoading, error };
}

export function useEquipmentByWarehouse(warehouseId: string) {
  const { equipment, isLoadingEquipment: isLoading } = useWarehousing();
  const data = equipment.filter((eq) => eq.warehouseId === warehouseId);
  return { data, isLoading };
}

export function useCreateEquipment() {
  const {
    createEquipment,
    isCreatingEquipment: isPending,
    parseEquipmentFormValues,
  } = useWarehousing();
  return {
    mutate: createEquipment,
    isPending,
    parseFormValues: parseEquipmentFormValues,
  };
}

export function useUpdateEquipment() {
  const { updateEquipment, isUpdatingEquipment: isPending } = useWarehousing();
  return { mutate: updateEquipment, isPending };
}

// Add floor plan hook
export function useFloorPlanItems(warehouseId: string) {
  const { getFloorPlanItemsByWarehouseId, isLoadingFloorPlanItems } =
    useWarehousing();
  const items = getFloorPlanItemsByWarehouseId(warehouseId);
  return { data: items, isLoading: isLoadingFloorPlanItems };
}
