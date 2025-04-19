import { ISchema } from "./generic";

// Base Warehouse interface
export interface IWarehouse extends ISchema {
  name: string;
  code: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  status: "active" | "inactive" | "maintenance";
  capacity: number;
  utilization: number;
  manager: string;
  phone: string;
  email: string;
  isDefault: boolean;
}

// Warehouse location interface
export interface ILocation extends ISchema {
  warehouseId: string;
  name: string;
  code: string;
  description: string;
  type: "aisle" | "shelf" | "bin" | "zone" | "section";
  status: "active" | "inactive" | "maintenance" | "reserved";
  capacity: number;
  utilization: number;
  parent?: string; // Parent location ID (e.g., bin is in shelf)
}

// Stock transfer interface
export interface ITransfer extends ISchema {
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  items: ITransferItem[];
  status: "draft" | "pending" | "in-transit" | "completed" | "cancelled";
  initiatedBy: string;
  approvedBy?: string;
  initiatedAt: Date;
  completedAt?: Date;
  notes?: string;
  trackingNumber?: string;
  estimatedArrival?: Date;
}

// Transfer item interface
export interface ITransferItem extends ISchema {
  transferId: string;
  productId: string;
  quantity: number;
  sourceLocationId?: string;
  destinationLocationId?: string;
  notes?: string;
  status: "pending" | "in-transit" | "received" | "discrepancy";
  receivedQuantity?: number;
}

// Receiving interface
export interface IReceiving extends ISchema {
  warehouseId: string;
  purchaseOrderId?: string;
  supplierId: string;
  items: IReceivingItem[];
  status:
    | "draft"
    | "pending"
    | "partially-received"
    | "completed"
    | "cancelled";
  receivedBy: string;
  receivedAt: Date;
  notes?: string;
  trackingNumber?: string;
}

// Receiving item interface
export interface IReceivingItem extends ISchema {
  receivingId: string;
  productId: string;
  expectedQuantity: number;
  receivedQuantity: number;
  locationId?: string;
  notes?: string;
  status: "pending" | "partially-received" | "received" | "rejected";
  qualityCheck: "pending" | "passed" | "failed";
}

// Putaway interface
export interface IPutaway extends ISchema {
  warehouseId: string;
  receivingId?: string;
  items: IPutawayItem[];
  status: "pending" | "in-progress" | "completed";
  assignedTo: string;
  initiatedAt: Date;
  completedAt?: Date;
  notes?: string;
}

// Putaway item interface
export interface IPutawayItem extends ISchema {
  putawayId: string;
  productId: string;
  quantity: number;
  sourceLocationId?: string;
  destinationLocationId: string;
  status: "pending" | "in-progress" | "completed";
  notes?: string;
}

// Form values for Warehouse
export interface WarehouseFormValues {
  name: string;
  code: string;
  description: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  status: IWarehouse["status"];
  capacity: string;
  utilization: string;
  manager: string;
  phone: string;
  email: string;
  isDefault: boolean;
}

// Form values for Location
export interface LocationFormValues {
  warehouseId: string;
  name: string;
  code: string;
  description: string;
  type: ILocation["type"];
  status: ILocation["status"];
  capacity: string;
  utilization: string;
  parent?: string;
}

// Form values for Transfer
export interface TransferFormValues {
  sourceWarehouseId: string;
  destinationWarehouseId: string;
  items: {
    productId: string;
    quantity: string;
    sourceLocationId?: string;
    destinationLocationId?: string;
    notes?: string;
  }[];
  notes?: string;
  trackingNumber?: string;
  estimatedArrival?: string;
}

// Form values for Receiving
export interface ReceivingFormValues {
  warehouseId: string;
  purchaseOrderId?: string;
  supplierId: string;
  items: {
    productId: string;
    expectedQuantity: string;
    receivedQuantity: string;
    locationId?: string;
    notes?: string;
    qualityCheck: IReceivingItem["qualityCheck"];
  }[];
  notes?: string;
  trackingNumber?: string;
}

// Form values for Putaway
export interface PutawayFormValues {
  warehouseId: string;
  receivingId?: string;
  items: {
    productId: string;
    quantity: string;
    sourceLocationId?: string;
    destinationLocationId: string;
    notes?: string;
  }[];
  assignedTo: string;
  notes?: string;
}
