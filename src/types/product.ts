import { ISchema } from "./generic";

// Base product interface
export interface IProduct extends ISchema {
  name: string;
  sku: string;
  description: string;
  categoryId: string;
  price: number;
  cost: number;
  quantity: number;
  reorderPoint: number;
  supplierId: string;
  location: string;
  status: "active" | "inactive" | "discontinued";
  lastRestocked: Date;
  image?: string;
  tags: string[];
  specifications: Record<string, string>;
}

// Bundle product interface
export interface IBundle extends IProduct {
  bundledProducts: string[]; // IDs of products in the bundle
  bundledProductQuantities: Record<string, number>; // Product ID to quantity mapping
}

// Variant product interface
export interface IVariant extends IProduct {
  parentProduct: string; // ID of the parent product
  variantAttributes: Record<string, string>; // Attributes like size, color, etc.
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

// Base form values
export interface ProductFormValues {
  name: string;
  sku: string;
  description: string;
  categoryId: string;
  price: string;
  cost: string;
  quantity: string;
  reorderPoint: string;
  supplierId: string;
  location: string;
  status?: IProduct["status"];
  tags?: string[];
  specifications?: Record<string, string>;
  image?: string;
  lastRestocked?: string;
}

// Bundle form values
export interface BundleFormValues extends ProductFormValues {
  bundledProducts?: string[];
  bundledProductQuantities?: Record<string, number>;
}

// Variant form values
export interface VariantFormValues extends ProductFormValues {
  parentProduct?: string;
  variantAttributes?: Record<string, string>;
}
