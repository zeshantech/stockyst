import { ISchema } from "./generic";

export interface IProduct extends ISchema {
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  quantity: number;
  reorderPoint: number;
  supplier: string;
  location: string;
  status: "active" | "inactive" | "discontinued";
  lastRestocked: string;
  image?: string;
  tags: string[];
  specifications: Record<string, string>;
}

export interface DeleteProductParams {
  id: string;
}

export interface BulkDeleteProductsParams {
  ids: string[];
}

export interface BulkUploadProductsParams {
  formData: FormData;
}

export interface UpdateProductStatusParams {
  id: string;
  status: IProduct["status"];
}
