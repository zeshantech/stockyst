export interface IStock {
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
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface IStockAlert {
  id: string;
  stockId: string;
  productName: string;
  sku: string;
  location: string;
  currentQuantity: number;
  reorderPoint: number;
  alertType: "low-stock" | "out-of-stock" | "reorder-point";
  severity: "low" | "medium" | "high";
  status: "active" | "resolved" | "dismissed";
  createdAt: string;
  resolvedAt?: string;
  notes?: string;
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
