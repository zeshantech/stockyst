import { ISchema } from "./generic";

export interface IAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IOrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface IOrder extends ISchema {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: IAddress;
  billingAddress: IAddress;
  notes?: string;
}

export interface DeleteOrderParams {
  id: string;
}

export interface BulkDeleteOrdersParams {
  ids: string[];
}

export interface UpdateOrderStatusParams {
  id: string;
  status: IOrder["status"];
}

export interface UpdatePaymentStatusParams {
  id: string;
  paymentStatus: IOrder["paymentStatus"];
}

export interface BulkUploadOrdersParams {
  formData: FormData;
}
