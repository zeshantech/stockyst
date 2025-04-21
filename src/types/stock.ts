import { ISchema } from "./generic";

// Base stock interface
export interface IStock extends ISchema {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  location: string;
  quantity: number;
  reorderPoint: number;
  unitCost: number;
  totalValue: number;
  status: "in-stock" | "low-stock" | "out-of-stock";
  lastRestocked: string;
  expiryDate?: string;
  batchNumber?: string;
  serialNumbers?: string[];
  notes?: string;
}

// Stock Count interfaces
export interface IStockCount extends ISchema {
  id: string;
  countNumber: string;
  status: "draft" | "in-progress" | "completed" | "cancelled";
  scheduledDate: string;
  completedDate?: string;
  locationId: string;
  locationName: string;
  countedBy: string;
  notes?: string;
  items: IStockCountItem[];
}

export interface IStockCountItem {
  id: string;
  countId: string;
  stockId: string;
  productName: string;
  sku: string;
  expectedQuantity: number;
  actualQuantity: number;
  discrepancy: number;
  notes?: string;
}

// Stock Transfer interfaces
export interface IStockTransfer extends ISchema {
  id: string;
  transferNumber: string;
  status: "draft" | "in-progress" | "completed" | "cancelled";
  sourceLocationId: string;
  sourceLocationName: string;
  destinationLocationId: string;
  destinationLocationName: string;
  requestedBy: string;
  requestedDate: string;
  completedDate?: string;
  notes?: string;
  items: IStockTransferItem[];
}

export interface IStockTransferItem {
  id: string;
  transferId: string;
  stockId: string;
  productName: string;
  sku: string;
  quantity: number;
  notes?: string;
}

// Stock Adjustment interfaces
export interface IStockAdjustment extends ISchema {
  id: string;
  adjustmentNumber: string;
  type: "addition" | "subtraction" | "write-off" | "correction";
  status: "draft" | "pending-approval" | "approved" | "rejected";
  locationId: string;
  locationName: string;
  adjustedBy: string;
  adjustmentDate: string;
  approvedBy?: string;
  approvalDate?: string;
  reason: string;
  notes?: string;
  items: IStockAdjustmentItem[];
}

export interface IStockAdjustmentItem {
  id: string;
  adjustmentId: string;
  stockId: string;
  productName: string;
  sku: string;
  previousQuantity: number;
  adjustmentQuantity: number;
  newQuantity: number;
  reason: string;
  notes?: string;
}

// Stock Alerts
export interface IStockAlert extends ISchema {
  id: string;
  stockId: string;
  productName: string;
  sku: string;
  location: string;
  currentQuantity: number;
  reorderPoint: number;
  alertType: "low-stock" | "out-of-stock" | "expiry" | "reorder-point";
  severity: "low" | "medium" | "high";
  status: "active" | "resolved" | "dismissed";
  resolvedAt?: string;
  notes?: string;
}

// Stock Expiry interfaces
export interface IStockExpiry {
  id: string;
  stockId: string;
  productName: string;
  sku: string;
  location: string;
  quantity: number;
  expiryDate: string;
  daysToExpiry: number;
  status: "upcoming" | "imminent" | "expired";
  notes?: string;
}

// Batch tracking interfaces
export interface IStockBatch {
  id: string;
  stockId: string;
  productName: string;
  sku: string;
  batchNumber: string;
  manufacturingDate?: string;
  expiryDate?: string;
  quantity: number;
  location: string;
  status: "active" | "depleted" | "expired";
  notes?: string;
}

// Serial number tracking interfaces
export interface IStockSerial {
  id: string;
  stockId: string;
  productName: string;
  sku: string;
  serialNumber: string;
  receivedDate: string;
  location: string;
  status: "in-stock" | "sold" | "reserved" | "defective";
  soldDate?: string;
  notes?: string;
}

// Stock level interfaces
export interface IStockLevel {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  minLevel: number;
  maxLevel: number;
  reorderPoint: number;
  safetyStock: number;
  preferredStockLevel: number;
  currentStock: number;
  status: "under-min" | "optimal" | "over-max";
  notes?: string;
}

// Parameters for API calls
export interface CreateStockParams {
  productId: string;
  location: string;
  quantity: number;
  unitCost: number;
  reorderPoint: number;
  expiryDate?: string;
  batchNumber?: string;
  serialNumbers?: string[];
  notes?: string;
}

export interface UpdateStockParams {
  id: string;
  location?: string;
  quantity?: number;
  unitCost?: number;
  reorderPoint?: number;
  expiryDate?: string;
  batchNumber?: string;
  serialNumbers?: string[];
  notes?: string;
}

export interface DeleteStockParams {
  id: string;
}

export interface BulkDeleteStockParams {
  ids: string[];
}

export interface BulkUploadStockParams {
  formData: FormData;
}

export interface CreateStockAlertParams {
  stockId: string;
  alertType: IStockAlert["alertType"];
  notes?: string;
}

export interface UpdateStockAlertParams {
  id: string;
  status: IStockAlert["status"];
  notes?: string;
}

export interface DeleteStockAlertParams {
  id: string;
}

export interface BulkDeleteStockAlertsParams {
  ids: string[];
}

export interface CreateStockCountParams {
  scheduledDate: string;
  locationId: string;
  notes?: string;
}

export interface UpdateStockCountParams {
  id: string;
  status?: IStockCount["status"];
  completedDate?: string;
  notes?: string;
  items?: Partial<IStockCountItem>[];
}

export interface CreateStockTransferParams {
  sourceLocationId: string;
  destinationLocationId: string;
  items: {
    stockId: string;
    quantity: number;
    notes?: string;
  }[];
  notes?: string;
}

export interface UpdateStockTransferParams {
  id: string;
  status?: IStockTransfer["status"];
  completedDate?: string;
  notes?: string;
}

export interface CreateStockAdjustmentParams {
  type: IStockAdjustment["type"];
  locationId: string;
  reason: string;
  items: {
    stockId: string;
    adjustmentQuantity: number;
    reason: string;
    notes?: string;
  }[];
  notes?: string;
}

export interface UpdateStockAdjustmentParams {
  id: string;
  status?: IStockAdjustment["status"];
  approvedBy?: string;
  approvalDate?: string;
  notes?: string;
}
